import Joi from '@hapi/joi';
import { createValidator } from 'express-joi-validation';

import usersRepository from '../repositories/UsersRepository';
import mailingService from '../services/MailingService';

import RouterController from './details/RouterController';

const validator = createValidator();
const userSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  admin: Joi.boolean().default(false),
});


class TemplatesController extends RouterController {
  async install(router) {
    router.get('/', this.forwardError(this.getAll));
    router.post('/', validator.body(userSchema), this.forwardError(this.create));
    router.delete('/:userId', this.forwardError(this.remove));
    router.patch('/:userId', validator.body(userSchema), this.forwardError(this.patch));
    router.post('/:userId/welcome', this.forwardError(this.welcome));
  }

  getAll = async (req, res) => {
    await res.json(await usersRepository.getAll());
  };

  welcome = async (req, res) => {
    const user = await usersRepository.getByID(req.params.userId);
    if (user) {
      mailingService.sendWelcome(user.email);
    }
    res.json({ status: 'ok' });
  };

  create = async (req, res) => {
    await res.json(await usersRepository.create(req.body.email));
  };

  remove = async (req, res) => {
    await res.json(await usersRepository.remove(Number(req.params.userId)));
  };

  patch = async (req, res) => {
    await res.json(
      await usersRepository
        .update(Number(req.params.userId), req.body.email, req.body.admin)
    );
  };
}

export default async () => (new TemplatesController()).createRouter();
