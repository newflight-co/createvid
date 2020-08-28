import SocketIO from 'socket.io';
import { constants } from '@createvid/common';

class SocketService {
  install(server) {
    const allowedOrigins = '*:*';
    const io = SocketIO(server);

    io.origins(allowedOrigins);

    this.io = io;
  }

  updateTaskStatus(task) {
    this.io.emit(constants.UPDATE_TASK_STATUS, task);
  }

  addUrl(task) {
    this.io.emit(constants.ADD_URL, task);
  }

  addNewTask(task) {
    this.io.emit(constants.ADD_NEW_TASK, task);
  }
}

export default new SocketService();
