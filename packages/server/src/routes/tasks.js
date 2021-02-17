import { config, logger } from '@createvid/common';
import path from 'path';
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
      // AssetsValidationService.validate,
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
        cb(null, path.join(config.render_upload_dir, req.renderTask.dir))
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
