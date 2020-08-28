class ApiResponseFactory {
  static createSuccess(payload) {
    return { status: 'success', ...payload };
  }
}

export default ApiResponseFactory;
