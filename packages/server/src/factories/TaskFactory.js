import { constants } from '@createvid/common';

class TaskFactory {
  static createTaskEntry(taskId, templateId, userId, title) {
    return {
      id: taskId,
      title,
      templateid: templateId,
      status: constants.task.status.NEW,
      url: null,
      poster: '',
      error: null,
      categories: null,
      user_id: userId,
      domain: null,
      config: null,
    };
  }
}

export default TaskFactory;
