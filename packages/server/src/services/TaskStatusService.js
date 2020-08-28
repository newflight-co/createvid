import { tasks, constants, channel } from '@createvid/common';

import io from './SocketService';

class TaskStatusService {
  install() {
    channel.listen(constants.queue.TASK_STATUS, this.handleTaskStatusChange.bind(this));
    channel.listen('info', this.forwardInfoToIO.bind(this));
  }

  forwardInfoToIO(msg, ack) {
    io.io.emit(msg.type, { id: msg.taskId, ...msg.data });
    ack();
  }

  // eslint-disable-next-line complexity
  async handleTaskStatusChange(msg, ack) {
    if (msg.status) {
      await tasks.updateTaskStatus(msg.taskId, msg.status);
    }
    if (msg.url) {
      await tasks.updateTaskUrl(msg.taskId, msg.url, constants.task.status.CLOUD_SUCCESSFUL);
    }
    if (msg.error) {
      await tasks.setError(msg.taskId, msg.error, msg.stack);
    }
    ack();
  }
}

export default new TaskStatusService();
