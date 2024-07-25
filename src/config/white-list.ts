/*
 * @Author: leyi leyi@myun.info
 * @Date: 2023-06-05 15:30:21
 * @LastEditors: leyi leyi@myun.info
 * @LastEditTime: 2023-06-06 13:21:50
 * @FilePath: /itam-api/src/config/white-list.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { registerAs } from '@nestjs/config';

export default registerAs('while_list', () => ({
  token: [
    '/api/oss/upload-oss',
    '/api/access/reg-mp-user',
    '/api/access/login-by-mp',
    '/api/mp/basic/code-2-session',
    '/api/access/get-session',
    '/api/access/login-by-account',
    '/api/basic/boluo-test',
    '/api/notes/get-wait-sync-red-notes',
    '/api/notes/update-red-notes-detail',
    '/api/notes/add-qg-notes-detail',
    '/api/notes/set-qg-note-report-status',
    '/api/notes/get-qg-note-report-status',
  ],
  sign: ['/api/oss/upload-oss', '/api/basic/boluo-test'],
}));
