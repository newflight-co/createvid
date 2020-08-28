import sinon from 'sinon';
import { templates, storage } from '@createvid/common';
import chai from 'chai';
import sinonChai from 'sinon-chai';

import ConfigBuilder, { TEMPLATES_DIR, TEMP_DIR } from '../src/ConfigBuilder';

const { expect } = chai;
chai.use(sinonChai);

describe('ConfigBuilder', () => {
  const TASK_ID = 'test_task_id';
  const TEMPLATE_ID = 'test';
  const DATA_JS_CONTENT = {
    templateId: TEMPLATE_ID,
    data: {
      test: 123,
    },
  };
  let TEMPLATE;
  let configBuilder = new ConfigBuilder(TASK_ID);

  beforeEach(() => {
    TEMPLATE = {
      template: {
        src: `//${TEMPLATE_ID}//project.aep`,
      },
      assets: [
        { type: 'image', layerName: 'asset_1' },
        { type: 'video', layerName: 'asset_2' },
        { type: 'data', layerName: 'test' },
      ],
      actions: {
        prerender: [],
        postrender: [
          { output: 'midfile' },
          { output: 'result.avi' },
        ],
      },
    };
    configBuilder = new ConfigBuilder(TASK_ID, { logger: { log: () => null } });
    sinon.stub(templates, 'getById').returns(TEMPLATE);
    sinon.stub(storage, 'download').resolves();
    sinon.stub(configBuilder, 'mkdir').resolves();
    sinon.stub(configBuilder, 'readFile').resolves(JSON.stringify(DATA_JS_CONTENT));
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('#loadRequest()', () => {
    it('should download config file', async () => {
      const config = await configBuilder.loadRequest();
      expect(config).to.deep.eql(DATA_JS_CONTENT);
    });

    it('should download correct file', async () => {
      await configBuilder.loadRequest();
      expect(storage.download).to.have.been.calledOnce;
      expect(storage.download.getCall(0).args[0]).to.eql(`${TASK_ID}/data.json`);
    });

    it('should load same file as downloaded', async () => {
      await configBuilder.loadRequest();
      expect(configBuilder.readFile)
        .to.have.been.calledOnceWithExactly(storage.download.getCall(0).args[1]);
    });
  });

  describe('#prepare()', () => {
    it('should transform template src to url form', async () => {
      const config = await configBuilder.prepare();
      expect(config.template.src).to.eql(`file://${TEMPLATES_DIR}/${TEMPLATE_ID}/project.aep`);
    });

    [0, 1].forEach((assetNo) => {
      it(`should download asset[${assetNo}] from storage`, async () => {
        const config = await configBuilder.prepare();
        expect(storage.download)
          .to.have.been.calledWithMatch(`${TASK_ID}/assets/${TEMPLATE.assets[assetNo].layerName}`);
      });
      it(`should fill asset[${assetNo}] src property`, async () => {
        const config = await configBuilder.prepare();
        const asset = config.assets[assetNo];
        expect(asset.src).to.be.eql(`file://${TEMP_DIR}/${TASK_ID}/assets/${asset.layerName}`);
      });
    });
    it('should fill asset[2] value property', async () => {
      const config = await configBuilder.prepare();
      const asset = config.assets[2];
      expect(asset.value).to.be.eql(123);
    });

    it('should replace destination of render process', async () => {
      const config = await configBuilder.prepare();
      expect(config.actions.postrender[config.actions.postrender.length - 1].output)
        .to.be.eql(`${TEMP_DIR}/${TASK_ID}_result.avi`);
    });
  });
});
