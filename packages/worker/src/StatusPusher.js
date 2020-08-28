import { channel, config, constants, logger } from '@createvid/common';

class StatusPusher {
  constructor(taskId) {
    this.taskId = taskId;
  }

  async status(status) {
    return channel.push('status', { taskId: this.taskId, status });
  }

  async error(status, error) {
    logger.error(error.message, {stack: error.stack});
    await channel.push('status', {
      taskId: this.taskId,
      error,
      stack: error.stack,
      status,
    });
  }

  async url(status, fileName) {
    return channel.push('status', {
      taskId: this.taskId,
      url: config.cdn + fileName,
      status: constants.task.status.CLOUD_SUCCESSFUL,
    });
  }
}

export default StatusPusher;
