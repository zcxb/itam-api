/*
 * @Author: zcxb
 * @Date: 2023-05-09 10:27:28
 * @LastEditors: zcxb
 * @LastEditTime: 2023-06-16 21:42:47
 * @FilePath: /itam-api/src/config/global.ts
 * @Description:
 *
 * Copyright (c) 2023 by Myun, All Rights Reserved.
 */
export enum ResponseCode {
  OK = 0,
  PARM_ERROR = 1000,
  SIGN_ERROR = 1001,
  SYS_ERROR = 9999,
  UNKOWN_ERROR = 10000,
}
export enum LockKey {
  GET_DELIVERY_SN = 'GET_DELIVERY_SN',
}

export enum CacheKey {
  SESSION_USER = 'SESSION_USER',
  WX_PAY_NOTIFY_URL = 'WX_PAY_NOTIFY_URL',
  WX_OPEN_APPID = 'WX_OPEN_APPID',
  QG_NOTE_REPORT_STATUS = 'QG_NOTE_REPORT_STATUS',
  VTOOL_TOKEN = 'VTOOL_TOKEN',
  XTS_APP_KEY = 'XTS_APP_KEY',
}

export const ex_attributes = {
  exclude: ['deleted_at', 'created_at', 'updated_at', 'created_by', 'updated_by'],
};

export const ex_attributes2 = {
  exclude: ['deleted_at', 'created_by', 'updated_by'],
};
