import { resolve } from 'path';
const baseLogPath = resolve(__dirname, '../../logs');

const log4jsConfig = {
  appenders: {
    console: {
      type: 'console',
    },
    app: {
      type: 'dateFile',
      filename: `${baseLogPath}/app-out/app.log`,
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern: '{"date":"%d","level":"%p","category":"%c","host":"%h","pid":"%z","data":\'%m\'}',
      },
      // 日志文件按日期（天）切割
      pattern: 'yyyyMMdd',
      daysToKeep: 60,
      // maxLogSize: 10485760,
      numBackups: 15,
      keepFileExt: true,
    },
    deliverysn: {
      type: 'dateFile',
      filename: `${baseLogPath}/biz/deliverysn.log`,
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern: '{"date":"%d","level":"%p","category":"%c","host":"%h","pid":"%z","data":\'%m\'}',
      },
      // 日志文件按日期（天）切割
      pattern: 'yyyyMMdd',
      daysToKeep: 60,
      // maxLogSize: 10485760,
      numBackups: 15,
      keepFileExt: true,
    },
    errorFile: {
      type: 'dateFile',
      filename: `${baseLogPath}/errors/error.log`,
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern: '{"date":"%d","level":"%p","category":"%c","host":"%h","pid":"%z","data":\'%m\'}',
      },
      // 日志文件按日期（天）切割
      pattern: 'yyyyMMdd',
      daysToKeep: 60,
      // maxLogSize: 10485760,
      numBackups: 15,
      keepFileExt: true,
    },
    errors: {
      type: 'logLevelFilter',
      level: 'ERROR',
      appender: 'errorFile',
    },
    // cloud_access: {
    //   type: 'dateFile',
    //   filename: `${baseLogPath}/myun-cloud-out/cloud.log`,
    //   alwaysIncludePattern: true,
    //   layout: {
    //     type: 'pattern',
    //     pattern: '{"date":"%d","level":"%p","category":"%c","host":"%h","pid":"%z","data":\'%m\'}',
    //   },
    //   // 日志文件按日期（天）切割
    //   pattern: 'yyyyMMdd',
    //   daysToKeep: 60,
    //   // maxLogSize: 10485760,
    //   numBackups: 3,
    //   keepFileExt: true,
    // },
    // cloudErrorFile: {
    //   type: 'dateFile',
    //   filename: `${baseLogPath}/myun-cloud-error/error.log`,
    //   alwaysIncludePattern: true,
    //   layout: {
    //     type: 'pattern',
    //     pattern: '{"date":"%d","level":"%p","category":"%c","host":"%h","pid":"%z","data":\'%m\'}',
    //   },
    //   // 日志文件按日期（天）切割
    //   pattern: 'yyyyMMdd',
    //   daysToKeep: 60,
    //   // maxLogSize: 10485760,
    //   numBackups: 3,
    //   keepFileExt: true,
    // },
    // cloud_errors: {
    //   type: 'logLevelFilter',
    //   level: 'ERROR',
    //   appender: 'cloudErrorFile',
    // },
  },
  categories: {
    default: {
      appenders: ['console'],
      level: 'DEBUG',
    },
    info: { appenders: ['console', 'app'], level: 'info' },
    deliverysn: { appenders: ['deliverysn'], level: 'info' },
    error: { appenders: ['console', 'errors'], level: 'error' },
    // cloud: {
    //   appenders: ['console', 'cloud_access', 'cloud_errors'],
    //   level: 'DEBUG',
    // },
    // net_core_cloud: {
    //   appenders: ['console'],
    //   level: 'DEBUG',
    // },
  },
  pm2: true, // 使用 pm2 来管理项目时，打开
  pm2InstanceVar: 'INSTANCE_ID', // 会根据 pm2 分配的 id 进行区分，以免各进程在写日志时造成冲突
};

export default log4jsConfig;
