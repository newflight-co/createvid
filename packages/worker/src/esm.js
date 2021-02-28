const path = require('path')
const dotenv = require('dotenv')
const envpath = path.join(__dirname, '../../..', '.env')
const dotenvError = dotenv.config({ path: envpath })
const showDotEnvError = false
if (showDotEnvError) {
    console.log('Dot Env Error ', dotenvError)
}
process.env.CONFIG = process.env.CONFIG || 'worker';
// eslint-disable-next-line no-global-assign
require = require('esm')(module);
module.exports = require('./index.js');

