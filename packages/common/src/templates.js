
import config from './config';
import _ from 'lodash';

const allowedFeFiledTypes = [
	'data',
	'video',
	'image',
	'audio',
	'script'
];

class TemplatesService {

	static getById(templateId){
		const template = this.getAll().find(t=>t.id === templateId);

		if (!template) {
			throw new Error("Can't find template by id");
		}

		return {
			..._.cloneDeep(template),
			actions: {
				..._.cloneDeep(config.rendering.actions),
				..._.cloneDeep(template.actions || {}),
			},
		};
	}

	static getAll(){
		return Object.values(config.templates);
	}

  static getTemplateFields(template) {
    return template.assets.map((a) => ({
      type: a.type,
      layerName: a.layerName,
      displayName: a.displayName,
      titleField: a.titleField,
      required: a.required
    }));
  }
  /** @deprecated **/
	static getFields(templateId) {
		const template = this.getById(templateId);
		return this.getTemplateFields(template);
	}

	static _filterTemplateFields(a) {
		const skipGeneratedJs = a.name !== 'data.js';
		const skipBlockedFileTypes = allowedFeFiledTypes.includes(a.type);

		return skipBlockedFileTypes && skipGeneratedJs;
	}

}


export default TemplatesService;
