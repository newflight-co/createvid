import { init, render } from '@nexrender/core';
import { constants, storage, logger } from '@createvid/common';
import path from 'path';
import mime from 'mime';

import ConfigBuilder from './ConfigBuilder';
import StatusPusher from './StatusPusher';

const RESULTS_PATH = path.resolve(path.join(__dirname, '../../../results'));

const {
  ERROR,
  RENDER_PROCESS,
  RENDER_SUCCESSFUL,
  RENDER_ERROR,
  CLOUD_PROCESS,
  CLOUD_SUCCESSFUL,
  CLOUD_ERROR,
  SUCCESSFUL,
} = constants.task.status;

class TaskHandler {
  constructor({ renderHandler } = {}) {
    this.handle = this.handle.bind(this);
    this.settings = undefined;
    this.render = renderHandler;
  }

  async handleRender(taskId, config, push) {
    try {
      await push.status(RENDER_PROCESS);
      const results = await this.render.render(config);
      logger.info('Render output', {results});
      await push.status(RENDER_SUCCESSFUL);
    } catch (err) {
      await push.error(RENDER_ERROR, err);
      throw err;
    }
  }


  async handleUpload(taskId, output, push) {
    try {
      await push.status(CLOUD_PROCESS);
      const name = await this.render.upload(output);
      await push.url(CLOUD_SUCCESSFUL, name);
    } catch (err) {
      await push.error(CLOUD_ERROR, err);
      throw err;
    }
  }

  async handleTask(taskId, push) {
    logger.info(`New task to handle: ${taskId}`);
    const builder = new ConfigBuilder(taskId);
    logger.info('Preparing task...');
    const config = await builder.prepare();
    logger.info('Preparation complete!');
    logger.info('Rendering...');
    await this.handleRender(taskId, config, push);
    logger.info('Rendering complete!');
    logger.info('Uploading...');
    await this.handleUpload(taskId, builder.output, push);
    logger.info('Uploading complete!');
    await push.status(SUCCESSFUL);
  }

  async handle({ taskId }, ack, nack) {
    const push = new StatusPusher(taskId);
    try {
      await this.handleTask(taskId, push);
      ack();
    } catch (err) {
      push.error(ERROR, err);
      ack();
    }
  }
}

export default TaskHandler;
