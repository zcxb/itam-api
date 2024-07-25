/*
 * @Author: zcxb
 * @Date: 2023-05-09 10:27:28
 * @LastEditors: zcxb
 * @LastEditTime: 2023-06-16 21:43:24
 * @FilePath: /itam-api/src/init.module.ts
 * @Description:
 *
 * Copyright (c) 2023 by Myun, All Rights Reserved.
 */
import { CacheKey } from '@config/global';
import { env } from '@libs/env-unit';
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheService } from '@service/cache.service';

@Module({
  imports: [ConfigModule],
  providers: [CacheService],
})
export class InitModule implements OnModuleInit {
  constructor(private readonly cacheService: CacheService, private readonly configService: ConfigService) {}
  async onModuleInit(): Promise<void> {}
}
