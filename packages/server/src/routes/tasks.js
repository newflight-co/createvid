import { config, logger, storage } from '@createvid/common';
import path from 'path';
import fs from 'fs';
import _ from 'lodash'
import multer from 'multer';
import { mkdirp } from 'fs-extra';

import TaskService from '../services/TaskService';
import AssetsValidationService from '../services/AssetsValidationService';
import CSVService from '../services/CsvService'
import MulterStorageGCS from '../utils/MulterStorageGCS';

import RouterController from './details/RouterController';

function getFiles(dir){
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const files = dirents
    .filter(dirent => dirent.isFile())
    .map(dirent => dirent.name);
  return files;
}
var extensionRegex = /(?:\.([^.]+))?$/;
class TasksController extends RouterController {
  install(router) {
    const upload = this.createUploader();
    const zipUpload = this.createZipUploader()
    router.param('taskId', this.putParamInContext('taskId'));
    router.get('/', this.forwardError(this.getAllByTemplateId));
    router.post('/',
      this.forwardError(this.prepare),
      upload.any(),
      AssetsValidationService.validate,
      this.forwardError(this.create));
    router.post('/zip', 
      this.forwardError(this.prepare),
      zipUpload.any(),
      this.forwardError(this.unzip),
      this.forwardError(this.validateZipAndPrepare),
      this.forwardError(this.uploadZipToGS),
      this.forwardError(this.create));  
    router.post('/:taskId', this.forwardError(this.restart));
    router.delete('/:taskId', this.forwardError(this.deleteTask));
  }

  deleteTask = async (req, res) => {
    await res.json(await TaskService.deleteTask(req.context.taskId, req.user));
  };

  getAllByTemplateId = async (req, res) => {
    await res.json(await TaskService.getAllByTemplateId(req.context.templateId, req.user));
  };

  getAll = async (req, res) => {
    await res.json(await TaskService.getAll());
  };

  getOne = async (req, res) => {
    await res.json(await TaskService.getOne(req.context.taskId));
  };

  create = async (req, res, next) => {
    console.log('QQ', req.file, ":", req.files)
    const taskInfo = this.getTaskInfo(req, res);
    await TaskService.createTaskEntry(taskInfo);
    await res.json({ message: 'Task enqueued successfully!' });
    await TaskService.uploadTask(taskInfo, req);
    await TaskService.pushTaskToQueue(taskInfo);
  };

  restart = async (req, res, next) => {
    await res.json({ message: 'Task enqueued successfully!' });
    await TaskService.pushTaskToQueue({ taskId: req.context.taskId });
  };

  getTaskInfo = (req, res) => ({
    taskId: req.renderTask.id,
    taskDir: req.renderTask.base,
    templateId: req.context.templateId,
    user: req.user,
    data: req.body,
    assetList: req.files ? req.files.map((file) => file.fieldname) : undefined,
  });

  prepare = async (req, res, next) => {
    const renderTaskId = TaskService.generateNewTaskId();
    const folderPath = config.render.tasksDir;
    const assetsPath = path.join(renderTaskId, 'assets');

    req.renderTask = {
      id: renderTaskId,
      dir: assetsPath,
      base: folderPath,
    };

    next();
  };

  unzip = async(req, res, next) => {
    console.log('unziping', req.files)
    const file = req.files[0]
    await storage.unzip(file.path, file.destination)
    console.log('unziped')
    next();
  }

  validateZipAndPrepare = async(req, res, next) => {
    console.log('validation', req.files)
    const workingPath = req.files[0].destination
    const files = getFiles(workingPath)
    const {fileAssets, dataAssets} = AssetsValidationService.getAsssets(req.context.templateId)
    
    // if csv exists
    const csvFile = _.find(files, (file) => {
      return extensionRegex.exec(file)[1] === 'csv'
    }) 
    if(!csvFile) return next(new Error('no csv found'))

    const csv = await CSVService.read(path.join(workingPath, csvFile))
    if(!csv) return next(new Error('no valid csv '))
    console.log('CSV', csv)
    console.log('fileAssets', fileAssets)
    _.every(fileAssets, (asset) => {
      const row = _.find(csv, {layerName: asset.layerName})
      console.log('TEST CSV row', row)
      if (!row){
        next(new Error('no row in CSV for '+ asset.displayName)) 
        return false
      }
      
      // if(row.required && !row.source) {
      //   next(new Error('no source set for '+ row.displayName)) 
      //   return false
      // }
      const rowFilename = row.source || row.layerName
      const rowFile = fs.existsSync(path.join(workingPath, rowFilename))
      if(!rowFile) {
        next(new Error('no source file for '+ row.displayName)) 
        return false
      }
      //rename
      const ext = extensionRegex.exec(rowFilename)[1]
      const filename = rowFilename.replace(extensionRegex, '')
      console.log('filename, ext', filename, ext)
      fs.renameSync(path.join(workingPath, rowFilename), path.join(workingPath, row.layerName+'.'+ext))
      return true
    })
    
    
    console.log('validated')
    next();
  }

  uploadZipToGS = async(req, res, next) => {
    console.log('uploading')
    const files = getFiles(req.files[0].destination)
    console.log('found files: ', files)
    const promises = files.map((file) => {
      console.log('uploading file:', file)
      const ext = extensionRegex.exec(file)[1]
      
      if(ext === 'zip' || ext === 'csv'){
        console.log(file,'skiped')
        return Promise.resolve(null)
      }
      console.log(file, 'uploaded')
      return storage.upload(path.resolve(req.files[0].destination, file),`${req.renderTask.dir}/${file}`)
    })
    Promise.all(promises)
    .then((results) => {
        console.log('Results: ', results)
    })
    next()
  }

  createUploader = () => {
    const storage = MulterStorageGCS({
      destination: (req, file, cb) => {
        cb(null, req.renderTask.dir);
      },
      filename: (req, file, cb) => {
        const fileName = file.fieldname.replace(' ', '');
        cb(null, fileName);
      },
    });

    return multer({
      storage,
      onError(err, next) {
        logger.error('error', err);
        next(err);
      },
    });
  };

  createZipUploader = () => {
    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        const distPath = path.join(config.render_upload_dir, req.renderTask.dir)
        fs.mkdirSync(distPath, { recursive: true })
        cb(null, distPath)
      },
      filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+'.zip')
      }
    })
    return multer({
      storage,
      onError(err, next) {
        logger.error('error', err);
        next(err);
      },
    });
  }
}

export default async () => (new TasksController()).createRouter();
