import { storage } from '@createvid/common';
import path from 'path';

import TaskService from '../services/TaskService';

import RouterController from './details/RouterController';


class DownloadController extends RouterController {
  install(router) {
    router.param('taskId', this.putParamInContext('taskId'));
    router.get('/:taskId', this.forwardError(this.download));
  }

  download = async (req, res, next) => {
    const task = await TaskService.getOne(req.context.taskId);
    const signedUrl = await storage.getSignedUrl(
      `results/${path.basename(new URL(task.url).pathname)}`
    );
    if (!signedUrl) {
      return res.redirect(req.header('Referer'));
    }
    await res.redirect(302, signedUrl);
  };
}

export default async () => (new DownloadController()).createRouter();
