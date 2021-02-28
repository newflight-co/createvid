const path = require('path')
const envpath = path.join(__dirname, '../../..', '.env')
console.log(' > > > > ENVPATH = ', envpath)
require('dotenv').config({ path: envpath })
process.env.CONFIG = process.env.CONFIG || 'worker';
// eslint-disable-next-line no-global-assign
require = require('esm')(module);
module.exports = require('./index.js');

