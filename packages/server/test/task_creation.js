import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiHttp from 'chai-http';
import { config, tasks, channel, constants } from '@createvid/common';

import UploadService from '../src/services/UploadService';
import createApp from '../src/app';
import TaskService from '../src/services/TaskService';

import generateUser from './utils/generateUser';

chai.use(chaiHttp);
chai.use(sinonChai);
chai.should();


describe('Task creation', () => {
  let uploadFolderStub;
  let agent;

  before(() => {
    config.debug = true;
    config.templates.test = {
      id: 'test',
      title: 'Template title',
      visibility: 'public',
      assets: [
        { type: 'text', layerName: 'clientName', titleField: true, required: true },
      ],
    };
  });

  after(() => {
    delete config.templates.test;
  });

  beforeEach(async () => {
    agent = chai.request.agent(await createApp());
    uploadFolderStub = sinon.stub();
    sinon.stub(tasks, 'addTask');
    sinon.stub(tasks, 'updateTaskStatus');
    sinon.stub(channel, 'push');
    sinon.stub(UploadService, 'uploadFolder').returns(uploadFolderStub);
    sinon.stub(TaskService, 'generateNewTaskId').returns('test_task');
    sinon.stub(TaskService, 'uploadTask');
    sinon.stub(TaskService, 'pushTaskToQueue');
  });

  afterEach(async () => {
    await agent.close();
  });

  describe('POST /v1/templates/:templateId/tasks', () => {
    it('should create task database entry with correct title', async () => {
      const res = await agent.post('/v1/templates/test/tasks')
        .send({ clientName: 'Task title' })
        .set('authorization', await generateUser());
      res.should.have.status(200);
      tasks.addTask.should.have.been.calledOnceWith({
        id: 'test_task',
        title: 'Task title',
        templateid: 'test',
        status: constants.task.status.NEW,
        url: null,
        poster: '',
        error: null,
        categories: null,
        user_id: 1,
        domain: null,
        config: null,
      });
    });
  });
});


