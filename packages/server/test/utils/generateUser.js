import { config } from '@createvid/common';
import jwt from 'jsonwebtoken';

export default (user = {}) => {
  const { accessSecret } = config.auth;
  return `Bearer ${jwt.sign({
    id: user.id || 1,
    email: user.email || 'asd@asd.asd',
    admin: user.admin || false,
  }, accessSecret, { expiresIn: '1m' })}`;
};
