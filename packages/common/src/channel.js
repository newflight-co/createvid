import amqp from 'amqplib';
import constants from './constants';
import config from './config';
import logger from './logger';


class Channel {
  listeners = {};

	async install(setup = () => null){
	  this.setup = setup;
	  this.reconnect();
	}

  reconnect = async () => {
    try {
      logger.info('Connecting to Queue...');
      await this.connect();
    }catch(err){
      logger.error(err);
      setTimeout(this.reconnect, 1000);
    }
  };

	connect = async () => {
    this.connection = await amqp.connect(config.queue.url, config.queue.opts);
    this.connection.on('error', this.onError);
    this.connection.on('close', this.onClose);
    await this.onConnected();
  };

	onConnected = async () => {
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(constants.queue.TASK_STATUS, {durable: true});
    await this.channel.assertQueue(constants.queue.TASK_RENDER, {durable: true});
    await this.channel.assertQueue(constants.queue.TASK_INFO, {durable: false});
    // await this.channel.assertQueue(constants.queue.WORKER_INFO, {durable: false});
    this.setup(this.channel, this.connection);
    this.reinitConsumers()
    logger.info('Connected to Queue.');
  };

	onClose = () => {
    this.channel = null;
	  this.reconnect();
  };

  onError = (err) => {
	  logger.error(err);
  };

	async push(name, task){
	  logger.debug('queue push', {name, task});
		await this.channel.sendToQueue(name, Buffer.from(JSON.stringify(task)));
	}

	async listen(name, cb){
	  this.listeners[name] = cb;
	  this.consume(name, cb);
	}

	async consume(name, cb){
	  if(!this.channel) return;
    await this.channel.consume(name, (msg) => {
      logger.debug('queue consume', JSON.parse(msg.content) );
      cb(JSON.parse(msg.content), () => this.channel.ack(msg), () => this.channel.nack(msg));
    });
  }

  reinitConsumers() {
    Object.entries(this.listeners)
      .forEach(([key, cb]) => this.consume(key, cb))
  }
}

export default new Channel();
