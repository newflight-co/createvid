import { templates } from '@createvid/common';
import stringify from 'csv-stringify';

import RouterController from './details/RouterController';

class ImportController extends RouterController {
  async install(router) {
    router.get('/:tid', this.forwardError(this.exportCsv.bind(this)));
    router.post('/:tid', this.forwardError(this.validateCsv.bind(this)));
  }

  async exportCsv(req, res, next) {
    const templateID = req.query.tid;


    res.setHeader('Content-Type', 'text/csv');
    // eslint-disable-next-line no-useless-escape
    res.setHeader('Content-Disposition', `attachment; filename=\"${templateID}.csv\"`);
    res.setHeader('Cache-Control', 'no-cache');

    // TODO map template fields to CSV headers

    stringify(templates.getFields(req.params.tid), { header: true })
      .pipe(res);
  }

  async validateCsv(req, res, next) {
    /*
    / TODO
    / loop through each field to check it is the correct type (text, image, colour...)
    / then check remote url's exist
    */
    await res.json({ status: 'success' });
  }
}


export default async () => (new ImportController()).createRouter();
