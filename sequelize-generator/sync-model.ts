/*
 * @Author: leyi leyi@myun.info
 * @Date: 2022-09-07 09:17:35
 * @LastEditors: zcxb
 * @LastEditTime: 2023-05-24 15:26:44
 * @FilePath: /itam-api/sequelize-generator/sync-model.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import {
  IConfig,
  ModelBuilder,
  DialectMySQL,
} from 'easy-front-sequelize-generator';
import { resolve } from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: resolve(__dirname, '../src/.env') });

export async function run() {
  const config: IConfig = {
    connection: {
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT as string),
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    },
    metadata: {
      indices: true,
      case: {
        model: 'PASCAL',
        column: 'LOWER',
      },
      timestamps: true,
      paranoid: true,
      aliasFields: {
        deletedAt: 'deleted_at',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      },
    },
    output: {
      clean: true,
      outDir: resolve(__dirname, '../src/models'),
    },
    strict: false,
  };

  const dialect = new DialectMySQL();

  const builder = new ModelBuilder(config, dialect);

  try {
    await builder.build();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
