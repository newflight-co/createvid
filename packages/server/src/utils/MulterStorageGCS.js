/* eslint-disable no-param-reassign,max-nested-callbacks,no-shadow */

import path from 'path';
import crypto from 'crypto';
import { storage } from '@createvid/common';

export class MulterStorageGCS {
  constructor(opts) {
    this.getFilename = (opts.filename || this.getFilenameDefault);

    if (typeof opts.destination === 'string') {
      this.getDestination = ($0, $1, cb) => { cb(null, opts.destination); };
    } else {
      this.getDestination = (opts.destination || this.getDestinationDefault);
    }
  }

  getFilenameDefault = (req, file, cb) => {
    crypto.pseudoRandomBytes(16, (err, raw) => {
      cb(err, err ? undefined : raw.toString('hex'));
    });
  };

  getDestinationDefault = (req, file, cb) => {
    cb(null, 'uploads');
  };

  _handleFile(req, file, cb) {
    const that = this;

    this.getDestination(req, file, (err, destination) => {
      if (err) return cb(err);

      this.getFilename(req, file, (err2, filename) => {
        if (err2) return cb(err2);

        const finalPath = path.join(destination, filename);
        const outStream = storage.bucket.file(finalPath).createWriteStream({
          metaData: {
            contentType: file.mime,
          },
        });

        file.stream.pipe(outStream);
        outStream.on('error', cb);
        outStream.on('finish', () => {
          cb(null, {
            destination,
            filename,
            path: finalPath,
            size: outStream.bytesWritten,
          });
        });
      });
    });
  }

  __removeFile(req, file, cb) {
    const { path } = file;

    delete file.destination;
    delete file.filename;
    delete file.path;

    storage.unlink(path)
      .then(() => cb())
      .catch((err) => cb(err));
  }
}

export default (opts) => new MulterStorageGCS(opts);
