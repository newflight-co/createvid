import { config, logger, storage } from '@createvid/common';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { mkdirp } from 'fs-extra';

import TaskService from '../services/TaskService';
import AssetsValidationService from '../services/AssetsValidationService';
import MulterStorageGCS from '../utils/MulterStorageGCS';

import RouterController from './details/RouterController';

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
      // AssetsValidationService.validate,
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
    // const taskInfo = this.getTaskInfo(req, res);
    // await TaskService.createTaskEntry(taskInfo);
    // await res.json({ message: 'Task enqueued successfully!' });
    // await TaskService.uploadTask(taskInfo, req);
    // await TaskService.pushTaskToQueue(taskInfo);
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

  uploadZipToGS = async(req, res, next) => {
    //read dir
    console.log('uploading')
    //const files = fs.readdirSync(req.files[0].destination)
    const dirents = fs.readdirSync(req.files[0].destination, { withFileTypes: true });
    const files = dirents
      .filter(dirent => dirent.isFile())
      .map(dirent => dirent.name);
    console.log('found files: ', files)
    const promises = files.map((file) => {
      console.log('uploading file:', file)
      return storage.upload(path.resolve(req.files[0].destination, file),`${req.renderTask.dir}/${file}`)
    })
    Promise.all(promises)
    .then((results) => {
        console.log('Results: ', results)
        next()
    })
    //each upload

    // next();
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
