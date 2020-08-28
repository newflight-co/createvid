import * as Sentry from '@sentry/node';
import { config } from '@createvid/common';

if (config.logs.sentry) {
  Sentry.init({ dsn: config.logs.sentry });
}
export default Sentry;
