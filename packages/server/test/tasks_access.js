import chai from 'chai';
import sinon from 'sinon';
import chaiHttp from 'chai-http';
import { tasks } from '@createvid/common';

import createApp from '../src/app';

import generateUser from './utils/generateUser';


chai.use(chaiHttp);
chai.should();


describe('Tasks access', () => {
  let agent;
  beforeEach(async () => {
    agent = chai.request.agent(await createApp());
  });
  afterEach(() => {
    agent.close();
    sinon.restore();
  });

  describe('GET /v1/templates/:templateId/tasks', () => {
    const TASKS = [
      { id: 't1', user_id: 2 },
      { id: 't2', user_id: 1 },
    ];
    beforeEach(() => {
      sinon.stub(tasks, 'deleteTask').resolves();
      sinon.stub(tasks, 'getAllByTemplateId').resolves(TASKS);
    });
    it('should deny access to anonymous', async () => {
      const res = await agent.get('/v1/templates/flyby/tasks');
      res.should.have.status(401);
    });
    it('should return all for admin', async () => {
      const res = await agent.get('/v1/templates/flyby/tasks')
        .set('authorization', await generateUser({ admin: true }));
      res.should.have.status(200);
      res.body.should.deep.eql(TASKS);
    });
    it('should return only owned tasks', async () => {
      const res = await agent.get('/v1/templates/flyby/tasks')
        .set('authorization', await generateUser({ id: 1 }));
      res.should.have.status(200);
      res.body.should.be.an('array').of.length(1);
      res.body.should.deep.include({ id: 't2', user_id: 1 });
    });
  });
  describe('DELETE /v1/tasks/:taskId', () => {
    beforeEach(() => {
      sinon.stub(tasks, 'deleteTask').resolves();
      sinon.stub(tasks, 'getTaskById').resolves({ id: '', user_id: 2 });
    });
    it('should deny access to anonymous', async () => {
      const res = await agent.delete('/v1/tasks/123');
      res.should.have.status(401);
    });
    it('should not allow delete to user - not owner', async () => {
      const res = await agent.delete('/v1/tasks/kPHOFfD6M')
        .set('authorization', await generateUser());
      res.should.have.status(401);
    });
    it('should allow delete to user - owner', async () => {
      const res = await agent.delete('/v1/tasks/kPHOFfD6M')
        .set('authorization', await generateUser({ id: 2 }));
      res.should.have.status(200);
    });
    it('should allow delete to admin', async () => {
      const res = await agent.delete('/v1/tasks/kPHOFfD6M')
        .set('authorization', await generateUser({ admin: true }));
      res.should.have.status(200);
    });
  });
});

