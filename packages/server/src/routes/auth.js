import { config, logger } from '@createvid/common';
import jwt from 'jsonwebtoken';

import ApiResponseFactory from '../factories/ApiResponses';
import auth from '../services/AuthService';
import AuthError from '../errors/AuthError';

import RouterController from './details/RouterController';

class AuthController extends RouterController {
  async install(router) {
    router.post('/code/send', this.forwardError(this.sendCode.bind(this)));
    router.post('/code/validate', this.forwardError(this.validateCode.bind(this)));
    router.post('/refresh', this.forwardError(this.refresh.bind(this)));
  }

  async sendCode(req, res) {
    await auth.sendCode(req.body.email);
    await res.json(ApiResponseFactory.createSuccess({ message: 'Code sent' }));
  }

  async validateCode(req, res) {
    const ret = await auth.validateCode(req.body.code);
    await res.json(ret);
  }

  async refresh(req, res) {
    const ret = await auth.refreshToken(req.body.idToken);
    await res.json(ret);
  }
}

export const accessCheck = (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      req.user = auth.verifyToken(token);
      if (req.user) {
        return next();
      }
    }
  } catch (err) {
    logger.error(err);
  }
  return next(new AuthError('Access denied'));
};


export default async () => (new AuthController()).createRouter();

