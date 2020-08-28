const chai = require('chai');
const path = require('path');
const fs = require('fs');
const util = require('util');
const imageTransform = require('../index');
chai.should();
const open = util.promisify(fs.open);
const read = util.promisify(fs.read);
const close = util.promisify(fs.close);

describe('image-transform - conversions', () => {
  it('should load jpg with png extension', async () => {
    const job = {
      uid: 'uid',
      workpath: path.join(__dirname, 'fixtures'),
    };
    const settings = {
      logger: console,
    };
    const config = {
      input: 'jpg.png',
      output: 'real.png',
      operations: [],
    };
    await imageTransform(job, settings, config)
    await checkPngMagicNumber('real.png');
  });

  async function checkPngMagicNumber(file){
    const fd = await open(path.join(__dirname,'fixtures', file));
    const { bytesRead, buffer } =  await read(fd, Buffer.alloc(4), 0, 4, null);
    buffer.toString().substr(1).should.be.eql('PNG');
    await close(fd);
  }
});




