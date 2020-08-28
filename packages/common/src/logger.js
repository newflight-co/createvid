import winston from 'winston';
import config from './config';
const {combine, timestamp, } = winston.format;

const logger = winston.createLogger({
  level: config.logs.level,
  format: combine(
    timestamp(),
    winston.format[config.logs.format](),
  ),
  transports: [
    new winston.transports.Console(),
  ]
});

export default logger;