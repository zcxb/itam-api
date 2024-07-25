/*
 * @Author: zcxb
 * @Date: 2023-06-16 21:18:56
 * @LastEditors: zcxb
 * @LastEditTime: 2023-06-16 21:19:09
 * @FilePath: /itam-api/src/config/vtools.ts
 * @Description:
 *
 * Copyright (c) 2023 by Myun, All Rights Reserved.
 */
import { env } from '@libs/env-unit';
import { registerAs } from '@nestjs/config';

export default registerAs('vtools', () => ({
  client_id: env('VTOOL_CLIENT_ID', ''),
  client_secret: env('VTOOL_CLIENT_SECRET', ''),
  base_url: env('VTOOL_BASE_URL', ''),
}));
