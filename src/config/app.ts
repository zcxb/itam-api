import { envBoolean, envNumber, env } from '@libs/env-unit';
import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  node_env: env('NODE_ENV', 'development'),
  name: env('APP_NAME', 'itam-api'),
  desc: env('APP_DESC', 'IT Asset Management API'),
  version: env('APP_VERSION', '1.0.0'),
  port: envNumber('APP_PORT', 8000),
  use_log_queue: envBoolean('USE_LOG_QUEUE', false),
}));
