// import dotenv from 'dotenv/config'
import path from 'path';
const envpath = path.join(__dirname, '../../..', '.env')
console.log(' > > > > ENVPATH = ', envpath)
require('dotenv').config({ path: envpath })
import channel from './channel';
import config from './config';
import constants from './constants';
import tasks from './tasks';
import pg from './pg';
import templates from './templates';
import storage from './storage';
import logger from './logger';



// export {
// 	channel,
// 	config,
// 	constants,
// 	tasks,
// 	pg,
// 	templates,
// 	storage,
//   logger
// };

// const channel = {}
// const config = {}
// const constants = {}
// const tasks = {}
// const pg = {}
// const templates = {}
// const storage = {}
// const logger = {}

export {
	channel,
	config,
	constants,
	tasks,
	pg,
	templates,
	storage,
  logger
};