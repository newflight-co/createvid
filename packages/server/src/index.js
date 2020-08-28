import './inits/index';
import { Server } from 'http';
import { channel, config, logger } from '@createvid/common';

import createApp from './app';
import SocketService from './services/SocketService';
import TaskStatusService from './services/TaskStatusService';
// import WorkersService from './services/WorkersService';

const initApp = async () => {
  try {
    const app = await createApp();
    const server = new Server(app);

    await SocketService.install(server);
    await channel.install();
    await TaskStatusService.install();
    // await WorkersService.install();

    const { port } = config.server;
    server.listen(port, () => logger.info(`🚀 Server ready at http://localhost:${port}/`));
    return server;
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

export default initApp();

