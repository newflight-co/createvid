import { init, render } from '@nexrender/core';
import path from 'path';
import { storage, logger } from '@createvid/common';
import mime from 'mime';

const RESULTS_PATH = path.resolve(path.join(__dirname, '../../../results'));

class NexRender {
  constructor() {
    this.settings = undefined;
  }

  async getSettings() {
    if (!this.settings) {
      this.settings = Promise.resolve(init({
        workpath: RESULTS_PATH,
        debug: true,
        logger: { log: (...logs) => logger.verbose(logs.join('; ')) },
        multiFrames: true,
      }));
    }
    return this.settings;
  }

  async render(config) {
    return render(config, await this.getSettings());
  }

  async upload(output) {
    const [file, meta] = await storage.moveFromDisk(output, `results/${path.basename(output)}`, mime.getType(output), { public: true });
    return meta.name;
  }
}

export default NexRender;
