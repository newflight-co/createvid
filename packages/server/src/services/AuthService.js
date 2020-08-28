import jwt from 'jsonwebtoken';
import { pg, config, logger } from '@createvid/common';
import crypto from 'crypto';

import AuthError from '../errors/AuthError';

import mailingService from './MailingService';

class AuthService {
  async sendCode(email) {
    const [user, domain] = await Promise.all([
      this.findUserByEmail(email),
      this.findDomainByEmail(email),
    ]);

    if (user) {
      await this.generateAndSendCode(user);
      return;
    }

    if (domain) {
      logger.debug(`Domain found! creating user: ${email}`);
      const nuser = await this.createUserByEmail(email);
      await this.generateAndSendCode(nuser);
    }
  }

  async generateAndSendCode(user) {
    const code = await this.generateCode(user.email);
    mailingService.sendOneTimePassword(user.email, `${config.server.app_endpoint}login/${code}`);
    logger.info(`login ${user.email} ${config.server.app_endpoint}login/${code}`);
  }

  async refreshToken(idToken) {
    const { idSecret } = config.auth;
    try {
      const token = jwt.verify(idToken, idSecret);

      if (token) {
        const user = await this.findUserByEmail(token.email);
        const accessToken = await this.generateAccessToken(user);
        return { accessToken, expiresIn: 60 };
      }
    } catch (err) {
      throw new AuthError('Token expired');
    }
  }

  async validateCode(code) {
    const user = await this.findUserByCode(code);
    const domain = await this.findDomainByEmail(user.email);

    if (user && new Date(user.codeexpires).getTime() > new Date().getTime()) {
      const accessToken = await this.generateAccessToken(user, domain);
      const idToken = await this.generateIdToken(user, domain);
      return { accessToken, idToken, expiresIn: 60 };
    }
    throw new AuthError('Wrong code');
  }


  async generateIdToken(user, domain) {
    const { idSecret } = config.auth;
    return jwt.sign({ email: user.email, domain: domain ? domain.id : null }, idSecret, { expiresIn: '24h' });
  }

  async generateAccessToken(user, domain) {
    const { accessSecret } = config.auth;
    return jwt.sign({
      id: user.id,
      email: user.email,
      admin: user.admin,
      domain: domain ? domain.id : null,
    }, accessSecret, { expiresIn: '1h' });
  }

  async createUserByEmail(email) {
    const ret = await pg.query('insert into users (email) values ($1) returning id, email, admin', [this.normalizeEmail(email)]);
    return ret.rows[0] || null;
  }

  async findUserByCode(code) {
    const ret = await pg.query('select * from users where code = $1', [code]);
    return ret.rows[0] || null;
  }

  async findUserByEmail(email = '') {
    const ret = await pg.query('select * from users where email = $1', [this.normalizeEmail(email)]);
    return ret.rows[0] || null;
  }

  async findDomainByEmail(email = '') {
    const parts = this.normalizeEmail(email).split('@');
    const ret = await pg.query('select * from domains where domain = $1', [parts[1]]);
    return ret.rows[0] || null;
  }

  async generateCode(email) {
    const code = this.generateOTP();
    const codeexpires = new Date(new Date().getTime() + 3600000);
    await pg.query('update users set code = $1, codeexpires = $2 where email = $3', [code, codeexpires, this.normalizeEmail(email)]);
    return code;
  }

  generateOTP() {
    return crypto.randomBytes(36).toString('hex');
  }

  verifyToken(token) {
    const { accessSecret } = config.auth;
    return jwt.verify(token, accessSecret);
  }

  normalizeEmail(email) {
    return String(email).toLowerCase();
  }
}

export default new AuthService();

