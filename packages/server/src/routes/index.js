import api from './api';
import RouterController from './details/RouterController';

class IndexController extends RouterController {
  async install(router) {
    router.use('/v1', await api());
  }
}

export default () => (new IndexController()).createRouter();
