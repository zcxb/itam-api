/*
 * @Author: leyi leyi@myun.info
 * @Date: 2022-09-07 09:17:35
 * @LastEditors: leyi leyi@myun.info
 * @LastEditTime: 2023-02-08 17:30:14
 * @FilePath: /itam-api/sequelize-generator/index.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { IConfig, ModelBuilder, DialectMySQL } from 'easy-front-sequelize-generator';
import { resolve } from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: resolve(__dirname, '../src/.env') });

(async () => {
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
      tables: ['t_welfare_card'],
    },
    output: {
      clean: true,
      outDir: resolve(__dirname, '../temp/models'),
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
})();
