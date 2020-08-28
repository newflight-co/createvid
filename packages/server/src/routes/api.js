import templates from './templates';
import csvImport from './csvImport';
import tasks from './tasks';
import download from './download';
import share from './share';
import auth, { accessCheck } from './auth';
import users from './users';
import RouterController from './details/RouterController';
import adminOnly from './details/adminOnly';

class ApiController extends RouterController {
  async install(router) {
    router.use('/auth', await auth());
    router.use('/templates', accessCheck, await templates());
    router.use('/download', await download());
    router.use('/tasks', accessCheck, await tasks());
    router.use('/csvimport', accessCheck, await csvImport());
    router.use('/users', accessCheck, adminOnly, await users());
    router.use('/share', await share());
    router.use('*', this.notFound.bind(this));
  }

  async notFound(req, res) {
    await res.status(404).send('No route');
  }
}

export default () => (new ApiController()).createRouter();
