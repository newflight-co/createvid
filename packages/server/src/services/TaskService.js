import { channel, constants, tasks, storage } from '@createvid/common';
import path from 'path';
import shortid from 'shortid';

import TaskFactory from '../factories/TaskFactory';
import AccessDenied from '../errors/AccessDenied';

import TemplatesService from './TemplateService';

class TaskService {
  static generateNewTaskId() {
    return shortid();
  }

  static async getAll() {
    return tasks.getAll();
  }

  static async getOne(taskId) {
    return tasks.getTaskById(taskId);
  }

  static async getAllByTemplateId(templateId, user = {}) {
    const results = await tasks.getAllByTemplateId(templateId);
    if (user.admin) {
      return results;
    } if (user.id) {
      return results.filter((t) => t.user_id === user.id);
    }
    return [];
  }

  static async getAllTemplates(user) {
    let counts;
    if (user.admin) counts = await tasks.countTasksByTemplate();
    else counts = await tasks.countTasksByTemplateAndUser(user.id);
    const ts = TemplatesService.getAll(user);
    return ts.map((t) => ({ ...t, count: counts[t.id] || 0 }));
  }

  static async getAllTemplateFields(templateId, user) {
    return TemplatesService.getFields(templateId, user);
  }

  static async loadTaskEntry(taskId) {
    return tasks.getTaskById(taskId);
  }

  static async createTaskEntry({ taskId, templateId, user, data }) {
    const template = TemplatesService.getById(templateId, user);
    const titleAsset = template.assets.find((asset) => asset.titleField);
    let { title } = template;
    if (titleAsset && data && data[titleAsset.layerName]) {
      title = data[titleAsset.layerName];
    }
    return tasks.addTask(TaskFactory.createTaskEntry(taskId, templateId, user.id, title));
  }

  static async uploadTask({
    taskId, templateId, data, assetList,
  }, req) {
    await tasks.updateTaskStatus(taskId, constants.task.status.PREPARATION);
    await storage.writeFile(path.join(taskId, 'data.json'), JSON.stringify({
      templateId,
      data,
      assetList,
    }));
  }

  static async pushTaskToQueue({
    taskId,
  }) {
    await tasks.updateTaskStatus(taskId, constants.task.status.PREPARED);
    await channel.push(constants.queue.TASK_RENDER, { taskId });
  }

  static async deleteTask(taskId, user) {
    const task = await tasks.getTaskById(taskId);
    if (user.admin || user.id === task.user_id) {
      return tasks.deleteTask(taskId);
    }
    throw new AccessDenied('No access to task');
  }
}

export default TaskService;
