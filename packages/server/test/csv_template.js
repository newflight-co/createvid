import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiHttp from 'chai-http';
import { config } from '@createvid/common';

import createApp from '../src/app';

import generateUser from './utils/generateUser';


chai.use(chaiHttp);
chai.use(sinonChai);
chai.should();


describe('CSV Template', () => {
  let agent;

  before(() => {
    config.debug = true;
    config.templates.test = {
      id: 'test',
      title: 'Template title',
      visibility: 'public',
      assets: [
        { type: 'text', layerName: 'clientName', displayName: 'Client Name', titleField: true, required: true },
        { type: 'video', layerName: 'testVideo', displayName: 'Video', required: true },
      ],
    };
  });

  after(() => {
    delete config.templates.test;
  });

  beforeEach(async () => {
    agent = chai.request.agent(await createApp());
  });

  afterEach(async () => {
    await agent.close();
  });

  describe('GET /v1/templates/test/csv', () => {
    it('should return all assets as headers', async () => {
      const res = await agent.get('/v1/templates/test/csv')
        .set('authorization', await generateUser());
      res.should.have.header('Content-Type', 'text/csv; charset=utf-8');
      res.text.should.eql('clientName[text];testVideo[video]');
    });
  });
});

