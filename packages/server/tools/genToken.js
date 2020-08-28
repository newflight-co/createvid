import { config } from '@createvid/common';
import jwt from 'jsonwebtoken';

class TokenGenerator {
  async generateAccessToken() {
    const { accessSecret } = config.auth;
    return jwt.sign({
      id: 2,
      email: 'mateusz@russak.biz',
      admin: true,
      domain: null,
    }, accessSecret, { expiresIn: '365d' });
  }
}

(async () => {
  const tg = new TokenGenerator();
  // eslint-disable-next-line no-console
  console.log(await tg.generateAccessToken());
})();
