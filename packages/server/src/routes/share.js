import TaskService from '../services/TaskService';

import RouterController from './details/RouterController';

class ShareController extends RouterController {
  install(router) {
    router.get('/:taskId', this.forwardError(this.getOne.bind(this)));
  }

  async getOne(req, res) {
    await res.json(await TaskService.getOne(req.params.taskId));
  }
}

export default async () => (new ShareController()).createRouter();

