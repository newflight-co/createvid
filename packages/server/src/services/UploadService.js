import { storage, logger } from '@createvid/common';
import path from 'path';
import fs from 'fs';
import { remove } from 'fs-extra';


export default class UploadService {
  static uploadFolder(BASE_PATH) {
    const metas = [];
    return async function uploadFolder(target = '') {
      const DIR = path.join(BASE_PATH, target);
      const dir = fs.readdirSync(DIR);
      logger.debug('Start upload', { DIR, dir });
      await Promise.all(dir.map(async (file) => {
        const fileStat = fs.statSync(path.join(DIR, file));
        if (fileStat.isDirectory()) {
          logger.debug('Uploading folder', { file });
          return uploadFolder(path.join(target, file));
        }
        if (fileStat.isFile()) {
          logger.debug('Uploading file', { file });
          const [, meta] = await storage.moveFromDisk(
            path.join(DIR, file),
            path.join(target, file)
          );
          metas.push(meta.name);
        }
      }));

      logger.debug('Removing folder', { DIR });
      await remove(DIR);

      return metas;
    };
  }
}

