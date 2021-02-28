import ConfigLoader from '@codecat/config';
import Joi from '@hapi/joi';
import path from 'path';

const schema = Joi.object().keys({
  logs: Joi.object().keys({
    sentry: Joi.string().uri({ scheme: ['https'] }).optional(),
    level: Joi.string()
      .allow('error', 'warn', 'info', 'verbose', 'debug', 'silly')
      .default('info'),
    format: Joi.string()
      .allow('simple', 'json')
      .default('simple'),
  }).default({ level: 'info', format: 'simple' }),
  server: Joi.object().keys({
    app_endpoint: Joi.string().uri({ scheme: ['http', 'https'] }).default("http://localhost:8080/"),
    port: Joi.number().port().default(8000)
  }).required(),
  database: Joi.alternatives().try(
    Joi.object().keys({
      connectionString: Joi.string().uri({ scheme: ['postgres'] }),
    }),
    Joi.object().keys({
      user: Joi.string(),
      host: Joi.string(),
      database: Joi.string(),
      password: Joi.string(),
      port: Joi.number().port()
    })
  ),
  queue: Joi.object().keys({
    url: Joi.string().uri({ scheme: ['amqp'] }),
    opts: Joi.any()
  }),
  auth: Joi.object().keys({
    idSecret: Joi.string().required(),
    accessSecret: Joi.string().required()
  }).required(),
  mailing: Joi.object().keys({
    sendgrid_key: Joi.string()
  }),
  render: Joi.object().keys({
    type: Joi.string().valid('nexrender', 'fakerender').default('nexrender'),
    tasksDir: Joi.string().default(path.resolve(path.join(__dirname, "../temp"))),
  }),
  cdn: Joi.string().uri({ scheme: ['http', 'https'] }),
  file_storage: Joi.string().allow('gcloud_storage').default('gcloud_storage'),
  gcloud_storage: Joi.object().keys({
    project: Joi.string(),
    bucket: Joi.string(),
    keyDir: Joi.string(),
    keyFilename: Joi.string(),
  }).required(),
  render_temp_dir: Joi.string().default(path.join(__dirname, '../temp/render')),
  render_upload_dir: Joi.string().default(path.join(__dirname, '../temp/upload')),
  templates_directory: Joi.string().default(path.join(__dirname, '../templates')),
  templates: Joi.object().pattern(/.*/, Joi.object().keys({
    id: Joi.string().required(),
    title: Joi.string(),
    visibility: Joi.alternatives().try(
      Joi.string().valid('public', 'hidden'),
      Joi.array().items(
        Joi.string().email(),
        Joi.string().hostname()
      )
    )
  }).pattern(/.*/, Joi.any())),
  rendering: Joi.any(),
});

const CONFIG = process.env.CONFIG || process.env.NODE_ENV || 'development';
console.log('Loading config for: ' + CONFIG, process.env.CONFIG, process.env.NODE_ENV);
console.log('2', path.join(`../../config/${CONFIG}.yml`), path.resolve(__dirname, `../../../config/${CONFIG}.yml`))
console.log(' S W T ', process.env.AUTH_ID_SECRET)
export default ConfigLoader(schema).load(path.resolve(__dirname, `../../../config/${CONFIG}.yml`));//path.join(`../../config/${CONFIG}.yml`)

