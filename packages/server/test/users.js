import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiHttp from 'chai-http';

import usersRepository from '../src/repositories/UsersRepository';
import mailingService from '../src/services/MailingService';
import createApp from '../src/app';

import generateUser from './utils/generateUser';

chai.use(chaiHttp);
chai.use(sinonChai);
chai.should();

describe('Users API', () => {
  let agent;
  beforeEach(async () => {
    sinon.stub(usersRepository);
    sinon.stub(mailingService);
    agent = chai.request.agent(await createApp());
  });

  afterEach(() => {
    sinon.restore();
    agent.close();
  });

  describe('GET /v1/users/', () => {
    beforeEach(() => {
      usersRepository.getAll.resolves([]);
    });
    it('should onlu admin access', async () => {
      const ret = await agent.get('/v1/users/')
        .set('authorization', await generateUser({ admin: false }));
      ret.should.have.status(401);
    });
    it('should return status code 200', async () => {
      const data = await agent.get('/v1/users/')
        .set('authorization', await generateUser({ admin: true }));
      data.should.have.status(200);
    });
    it('should return empty array', async () => {
      const data = await agent.get('/v1/users/')
        .set('authorization', await generateUser({ admin: true }));
    });
    it('should call users repository getAll function', async () => {
      await agent.get('/v1/users/')
        .set('authorization', await generateUser({ admin: true }));
      usersRepository.getAll.should.have.been.calledOnce;
    });
    it('should return empty list of users', async () => {
      const data = await agent.get('/v1/users/')
        .set('authorization', await generateUser({ admin: true }));
      data.body.should.be.eql([]);
    });
  });
  describe('POST /v1/users/', () => {
    beforeEach(() => {
      usersRepository.create.resolves();
    });
    it('should onlu admin access', async () => {
      const ret = await agent.post('/v1/users/')
        .send()
        .set('authorization', await generateUser({ admin: false }));
      ret.should.have.status(401);
    });

    it('should pass email to create function', async () => {
      const USER_DATA = { email: 'userEmail@example.com' };
      await agent.post('/v1/users/')
        .send(USER_DATA)
        .set('authorization', await generateUser({ admin: true }));
      usersRepository.create.should.have.been.calledOnceWithExactly(USER_DATA.email);
    });

    it('should catch errors from create', async () => {
      const ERROR = new Error('Test Error');
      usersRepository.create.rejects(ERROR);
      const ret = await agent.post('/v1/users/')
        .send({ email: 'test@example.com' })
        .set('authorization', await generateUser({ admin: true }));
      ret.should.have.status(500);
      ret.body.should.have.property('message', ERROR.message);
    });
    it('should invalidate email that is not an email', async () => {
      const ret = await agent.post('/v1/users/')
        .send({ email: 'fake' })
        .set('authorization', await generateUser({ admin: true }));
      ret.should.have.status(400);
    });
  });

  describe('DELETE /v1/users/:userId', () => {
    it('should unlu admin access', async () => {
      const ret = await agent.delete('/v1/users/1')
        .set('authorization', await generateUser({ admin: false }));
      ret.should.have.status(401);
    });
    it('should call remove in repository', async () => {
      await agent.delete('/v1/users/1')
        .set('authorization', await generateUser({ admin: true }));
      usersRepository.remove.should.have.been.calledOnceWithExactly(1);
    });
  });

  describe('PATCH /v1/users/:userId', () => {
    const PATCH = { email: 'test@example.com', admin: true };
    it('should onlu admin access', async () => {
      const ret = await agent.patch('/v1/users/1')
        .send(PATCH)
        .set('authorization', await generateUser({ admin: false }));
      ret.should.have.status(401);
    });
    it('should update user email and admin', async () => {
      await agent.patch('/v1/users/1')
        .send(PATCH)
        .set('authorization', await generateUser({ admin: true }));
      usersRepository.update
        .should.have.been.calledOnceWithExactly(1, PATCH.email, PATCH.admin);
    });
    it('should invalidate change if email is invalid', async () => {
      await agent.patch('/v1/users/1')
        .send({ email: 'xxx' })
        .set('authorization', await generateUser({ admin: true }));
      usersRepository.update.should.not.be.called;
    });
  });

  describe('POST /v1/users/:userId/welcome', () => {
    it('should only admin access', async () => {
      const ret = await agent.patch('/v1/users/1/welcome')
        .set('authorization', await generateUser({ admin: false }));
      ret.should.have.status(401);
    });
    it('should get user email and send welcome', async () => {
      const USER = { id: 1, email: 'john@doe.com', admin: false };
      usersRepository.getByID.resolves(USER);
      await agent.post('/v1/users/1/welcome')
        .set('authorization', await generateUser({ admin: true }));
      mailingService.sendWelcome
        .should.be.calledOnceWithExactly(USER.email);
    });
  });
});
