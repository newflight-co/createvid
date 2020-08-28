import ApiError from './ApiError';

class AccessDenied extends ApiError {
  constructor(message, error) {
    super(401, 'ACCESS_DENIED', message, error);
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
    };
  }
}

export default AccessDenied;
