import RouterController from './details/RouterController';

class WorkersController extends RouterController {
  async install(router) {
    router.get('/', this.forwardError(this.getAll.bind(this)));
  }

  async getAll(req, res) {
    await res.json([]);
  }
}

export default async () => (new WorkersController()).createRouter();
