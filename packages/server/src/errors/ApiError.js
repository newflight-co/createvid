class ApiError extends Error {
  constructor(statusCode, code, message, prevError) {
    super(message);
    this.createvid = true;
    this.code = code;
    this.previousError = prevError;
    this.statusCode = statusCode;
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
    };
  }
}

export default ApiError;
