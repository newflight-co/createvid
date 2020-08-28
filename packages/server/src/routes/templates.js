import TaskService from '../services/TaskService';

import RouterController from './details/RouterController';
import tasks from './tasks';

class TemplatesController extends RouterController {
  async install(router) {
    router.param('templateId', this.putParamInContext('templateId'));
    router.get('/', this.forwardError(this.getAll.bind(this)));
    router.get('/:templateId/fields', this.forwardError(this.getFields.bind(this)));
    router.get('/:templateId/csv', this.forwardError(this.generateCSVTemplate.bind(this)));
    router.use('/:templateId/tasks', await tasks());
  }

  async getAll(req, res) {
    const templates = await TaskService.getAllTemplates(req.user);
    await res.json(templates);
  }

  async getFields(req, res, next) {
    await res.json(await TaskService.getAllTemplateFields(req.context.templateId, req.user));
  }

  async generateCSVTemplate(req, res, next) {
    const fields = await TaskService.getAllTemplateFields(req.context.templateId, req.user);
    res.set('Content-Type', 'text/csv');
    res.send(fields.map((field) => `${field.layerName}[${field.type}]`).join(';'));
  }
}

export default async () => (new TemplatesController()).createRouter();
