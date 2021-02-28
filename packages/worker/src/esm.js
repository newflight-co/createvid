const path = require('path')
const dotenv = require('dotenv')
const envpath = path.normalize(path.join(__dirname, '../../..', '.env'))
console.log(' > > > > ENVPATH = ', envpath)
const dotenvError = dotenv.config({ path: envpath })
console.log('DEE ', dotenvError)
process.env.CONFIG = process.env.CONFIG || 'worker';
// eslint-disable-next-line no-global-assign
require = require('esm')(module);
module.exports = require('./index.js');

