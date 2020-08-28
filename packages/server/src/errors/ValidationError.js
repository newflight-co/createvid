import ApiError from './ApiError';

class ValidationError extends ApiError {
  constructor(validationResult) {
    super(400, 'VALIDATION_ERROR', 'Request validation failed', validationResult);
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      validationResult: this.previousError,
    };
  }
}

export default ValidationError;
