
class FakeRender {
  constructor() {
    this.settings = undefined;
  }

  async getSettings() {
    return Promise.resolve();
  }

  async render() {
    return Promise.resolve();
  }

  async upload(output) {
    return Promise.resolve(output);
  }
}

export default FakeRender;
