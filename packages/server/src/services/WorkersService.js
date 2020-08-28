import { constants, channel } from '@createvid/common';

class WorkersService {
  install() {
    this.state = {};
    channel.listen(constants.queue.WORKER_INFO, this.dispatch);
    setInterval(this.check, 5000);
  }

  jobs = {
    connected: ({ id }, state) => ({ ...state, [id]: { status: 'connected' } }),
    timeout: ({ id }, state) => ({ ...state, [id]: { status: 'timeout' } }),
    disconnected: ({ id }, state) => ({ ...state, [id]: undefined }),
    working: ({ id }, state) => ({ ...state, [id]: { status: 'working' } }),
    idle: ({ id }, state) => ({ state, [id]: { status: 'idle' } }),
  };

  updateState = (event, state) => this.jobs[event.type](event, state);

  dispatch = (evt) => {
    this.state = this.updateState(evt, this.state);
  };

  check = () => {
    Object.keys(this.state)
      .filter((id) => !!this.state[id])
      .filter((id) => Date.now() - this.state[id].updated > 10000)
      .forEach((id) => this.dispatch({ type: 'disconnected', id }));
  };
}

export default new WorkersService();
