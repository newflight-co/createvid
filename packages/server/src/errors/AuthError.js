class AuthError extends Error {
  constructor(message, error) {
    super(message);
    this.createvid = true;
    this.scope = 'AUTH';
    this.statusCode = 401;
    this.previousError = error;
  }

  toJSON() {
    return {
      status: 'access_denied',
      message: this.message,
    };
  }
}

export default AuthError;
