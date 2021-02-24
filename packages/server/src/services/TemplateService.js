import { templates } from '@createvid/common';
import CSVService from './CsvService'
import NotFound from '../errors/NotFound';
import AssetsValidationService from '../services/AssetsValidationService';


class TemplatesService {
  // eslint-disable-next-line complexity
  static canAccess(visibility, user) {
    if (visibility === 'public' || (user && user.admin)) {
      return true;
    }
    if (!user) return false;
    const [, domain] = user.email.split('@');

    return Array.isArray(visibility) && visibility.find(
      (entry) => String(entry).toLowerCase() === String(user.email).toLowerCase()
        || String(entry).toLowerCase() === String(domain).toLowerCase()
    );
  }

  static getById(templateId, user) {
    const template = templates.getById(templateId);
    if (!this.canAccess(template.visibility, user)) {
      throw new NotFound('Template was not found!');
    }
    return template;
  }

  static getAll(user) {
    return templates.getAll().filter((t) => TemplatesService.canAccess(t.visibility, user));
  }

  static getFields(templateId, user) {
    const template = templates.getById(templateId);
    if (!this.canAccess(template.visibility, user)) {
      throw new NotFound('Template was not found!');
    }
    return templates.getTemplateFields(template);
  }

  static async getTemplateCSV(templateId){
    const template = templates.getById(templateId);
    const {fileAssets, dataAssets} = AssetsValidationService.getAsssets(templateId)//templates.getTemplateFields(template);
    console.log('fields', fileAssets)
    return CSVService.generate(fileAssets);
  }
}


export default TemplatesService;
