import chai from 'chai';
import sinon from 'sinon';
import chaiHttp from 'chai-http';
import { config, tasks } from '@createvid/common';

import createApp from '../src/app';

import generateUser from './utils/generateUser';


const USER_ID = 5;

chai.use(chaiHttp);
chai.should();

describe('Template visibility', () => {
  let agent;
  beforeEach(async () => {
    config.logs.level = 'debug';
    agent = chai.request.agent(await createApp());
  });
  afterEach(() => {
    agent.close();
    sinon.restore();
  });

  describe('GET /v1/templates', async () => {
    let backup;
    before(() => {
      backup = config.templates;
      config.templates = {
        flyby: {
          id: 'flyby',
          visibility: 'public',
        },
        foo: {
          id: 'foo',
          visibility: 'hidden',
        },
        bar: {
          id: 'bar',
          visibility: 'hidden',
        },
      };
    });

    after(() => {
      config.templates = backup;
    });

    beforeEach(() => {
      sinon.stub(tasks, 'countTasksByTemplate').resolves({});
      sinon.stub(tasks, 'countTasksByTemplateAndUser').resolves({});
    });
    it('should return user tasks count', async () => {
      config.templates.flyby.visibility = 'public';
      await getTemplates({ email: 'asd@asd.asd', admin: false });
      tasks.countTasksByTemplateAndUser.should.have.been.calledOnceWith(USER_ID);
    });
    it('should return all tasks count for admin', async () => {
      config.templates.flyby.visibility = 'public';
      await getTemplates({ email: 'asd@asd.asd', admin: true });
      tasks.countTasksByTemplate.should.have.been.calledOnce;
    });
    it('should return public for user', async () => {
      config.templates.flyby.visibility = 'public';
      const res = await getTemplates({ email: 'asd@asd.asd', admin: false });
      res.body.should.be.an('array').of.length(1);
      res.body[0].should.have.property('id', 'flyby');
    });
    it('should return all for admin', async () => {
      config.templates.flyby.visibility = 'public';
      const res = await getTemplates({ email: 'asd@asd.asd', admin: true });
      res.body.should.be.an('array').of.length(Object.keys(config.templates).length);
    });
    it('should return user specific templates', async () => {
      config.templates.flyby.visibility = ['asd@asd.asd'];
      const res = await getTemplates({ email: 'asd@asd.asd', admin: false });
      res.body.should.be.an('array').of.length(1);
      res.body[0].should.have.property('id', 'flyby');
    });
    it('should return domain specific templates', async () => {
      config.templates.flyby.visibility = ['asd.asd'];
      const res = await getTemplates({ email: 'asd@asd.asd', admin: false });
      tasks.countTasksByTemplateAndUser.should.have.been.calledOnceWith(USER_ID);
      res.body.should.be.an('array').of.length(1);
      res.body[0].should.have.property('id', 'flyby');
    });
    it('should match user case insensitive', async () => {
      config.templates.flyby.visibility = ['asd@asd.asd'];
      const res = await getTemplates({ email: 'ASD@asd.asd', admin: false });
      res.body.should.be.an('array').of.length(1);
      res.body[0].should.have.property('id', 'flyby');
    });
    it('should match user case insensitive 2', async () => {
      config.templates.flyby.visibility = ['ASD@asd.asd'];
      const res = await getTemplates({ email: 'asd@asd.asd', admin: false });
      res.body.should.be.an('array').of.length(1);
      res.body[0].should.have.property('id', 'flyby');
    });

    async function getTemplates(user) {
      return agent.get('/v1/templates')
        .set('authorization', await generateUser({ ...user, id: USER_ID }));
    }
  });

  describe('GET /v1/templates/:templateId/fields', () => {
    it('should deny access for hidden template', async () => {
      config.templates.flyby.visibility = 'hidden';
      const res = await getFields({ email: 'asd@asd.asd', admin: false });
      res.should.have.status(404);
    });
    it('should allow access for public template', async () => {
      config.templates.flyby.visibility = 'public';
      const res = await getFields({ email: 'asd@asd.asd', admin: false });
      res.should.have.status(200);
    });
    it('should allow access for selected uesrs', async () => {
      config.templates.flyby.visibility = ['asd@asd.asd'];
      const res = await getFields({ email: 'asd@asd.asd', admin: false });
      res.should.have.status(200);
    });

    async function getFields(user) {
      return agent.get('/v1/templates/flyby/fields')
        .set('authorization', await generateUser({ ...user, id: USER_ID }));
    }
  });
});

