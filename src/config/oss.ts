import { envNumber, env } from '@libs/env-unit';
import { registerAs } from '@nestjs/config';

export default registerAs('oss', () => ({
  end_point: env('END_POINT', ''),
  access_key_id: env('ACCESS_KEY_ID', ''),
  access_key_secret: env('ACCESS_KEY_SECRET', ''),
  bucket_name: env('BUCKET_NAME', ''),
  region_id: env('REGION_ID', ''),
  internal: envNumber('INTERNAL', 0),
  timeout: env('TIMEOUT', '60s'),
  domain: env('DOMAIN', ''),
}));
