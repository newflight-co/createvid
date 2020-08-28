import { channel, logger, config, constants } from '@createvid/common';

import TaskHandler from './TaskHandler';
import * as renderers from './render';

const initApp = async () => {
  try {
    const RenderHandler = renderers[config.render.type];
    const renderHandler = new RenderHandler();
    const handler = new TaskHandler({ renderHandler });
    await channel.install((ch, conn) => {
      ch.prefetch(1);
    });

    await renderHandler.getSettings();
    await channel.listen(constants.queue.TASK_RENDER, handler.handle);
  } catch (err) {
    if (err.code && err.code === 'ECONNREFUSED') {
      logger.error('Could not connect to RabbitMQ');
    } else {
      logger.error(err.message, {stack: err.stack});
    }
    logger.info('App shutdown...');
    process.exit(1);
  }
};

export default initApp();

