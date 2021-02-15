import util from 'util';
import fs from 'fs';
import {Storage} from '@google-cloud/storage';
import moment from 'moment';
import config from './config';

const unlink = util.promisify(fs.unlink);

class GCStorage {
  constructor(){
    console.log('>>>>>>>> ',config.gcloud_storage,config.gcloud_storage.bucket)
    this.GCLOUD_BUCKET = config.gcloud_storage.bucket;
    this.GCLOUD_PROJECT = config.gcloud_storage.project;
    let storage = this.storage = new Storage({
      projectId: this.GCLOUD_PROJECT,
      keyFilename: config.gcloud_storage.keyFilename
        ? config.gcloud_storage.keyFilename
        : undefined,
      credentials: config.gcloud_storage.credentials
    });
    this.bucket = storage.bucket(this.GCLOUD_BUCKET);
  }

  exists(src){
    return this.bucket.file(src).exists().then(data=>data[0]);
  }

  sendFile(src, res, customFilename){
    return this.bucket.file(src).getMetadata().then(data=>{
      let contentType = data[0].contentType;
      console.log('contentType',contentType);
      res.setHeader('Content-disposition', `inline; filename="${customFilename}"`);
      res.setHeader('Content-type', contentType || 'application/octet-stream');
      this.bucket.file(src).createReadStream().pipe(res);
    }).catch(err=>{
      console.error(err);
      res.status(500).end('Internal error');
    });
  }

  readFile(src){
    return this.bucket.file(src).download().then(data=>{
      var contents = data[0];
      return contents;
    });
  }

  writeFile(src, data){
    return this.bucket.file(src).save(data).then(data=>{
      return data;
    });
  }

  async moveFromDisk(source, dest, mime, opts = {}){
    const ret = await this.upload(source, dest, mime, opts);
    await unlink(source);
    return ret;
  }

  upload(src, dest, mime= 'application/octet-stream', opts = {}){
    return this.bucket.upload(src, {
      ...opts,
      destination: dest,
      metadata: {
        contentType: mime
      }
    });
  }

  download(src, dest) {
    return this.bucket.file(src).download({destination: dest})
  }

  uploadReq(reqFile, dest){
    return new Promise((ok,nok)=>{
      const file = this.bucket.file(dest);
      const stream = file.createWriteStream({
        metadata: {
          contentType: reqFile.mimetype
        }
      });
      stream.on('error', nok);
      stream.on('finish', ok);
      stream.end(reqFile.buffer);
    });
  }


  rename(src, dest){
    return this.bucket.file(src).move(dest).then(data=>{
      return data;
    });
  }
  unlink(src){
    return this.exists(src).then(exists=>{
      if(exists){
        return this.bucket.file(src).delete().then(data=>{
          return data;
        });
      }
    });
  }
  async unlinkDir(prefix){
    const [files] = await this.bucket.getFiles({prefix});
    return Promise.all(files.map(file => {
      return file.delete();
    }));
  }

  getSignedUrl(filename) {
    return this.bucket
      .file(filename)
      .getSignedUrl({responseDisposition: 'attachment', action: 'read', expires: moment().add(5, 'm')})
      .then(ret => console.log(ret) || ret)
      .then(ret=>ret[0]);
  }
}

export default new GCStorage();

