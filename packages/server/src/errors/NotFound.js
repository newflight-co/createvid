import ApiError from './ApiError';

class NotFound extends ApiError {
  constructor(message, error) {
    super(404, 'NOT_FOUND', message, error);
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
    };
  }
}

export default NotFound;
