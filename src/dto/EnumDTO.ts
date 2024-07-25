/**
 * 登录类型：1-账号名密码 2-手机号 3-微信公众号授权 4-小程序授权 5-微信unionid登录
 */
export enum LOGIN_TYPE {
  账号名密码登录 = 1,
  手机号验证码 = 2,
  微信公众号授权 = 3,
  小程序授权 = 4,
  微信unionid登录 = 5,
}

/**
 * 角色类型 1-平台端 2-商家端 3-小程序端
 */
export enum ROLE_TYPE {
  平台端 = 1,
  商家端 = 2,
  小程序端 = 3,
}

/**
 * 权限类型 1-菜单 2-按钮
 */
export enum RIGHT_TYPE {
  菜单 = 1,
  按钮 = 2,
}

/**
 * 账户状态 1-正常 11-注销 12-冻结
 */
export enum USER_STATUS {
  正常 = 1,
  注销 = 11,
  冻结 = 12,
}

export enum LOGIN_CLIENT {
  平台端 = 1,
  企业端 = 2,
  小程序端 = 3,
}

/**
 * 日志目标模块
 */
export enum TARGET_TYPE {
  用户 = 'user',
  角色 = 'user_role',
  权限 = 'user_right',
  其他 = 'other',
}

/**
 * 日志操作类型
 */
export enum ACTION_TYPE {
  登录 = 1,
  退出登录 = 2,
  创建登录用户 = 3,
  创建角色 = 4,
  修改角色 = 5,
  分配角色 = 6,
  分配权限 = 7,
  小程序用户注册 = 8,
  修改用户信息 = 9,
  修改密码 = 10,
  创建权限 = 11,
  修改权限 = 12,
  删除权限 = 13,
  删除角色 = 14,
  设置用户状态 = 15,
  其他 = 255,
}

export enum PLATFORM_CODE {
  淘系 = 'tb',
  京东 = 'jd',
  拼多多 = 'pdd',
  抖音 = 'dy',
  小红书 = 'xhs',
  快手 = 'ks',
  微信视频号 = 'wx',
}

export enum WAYBILL_PLATFORM_CODE {
  菜鸟 = 'cainiao',
  抖音 = 'douyin',
  快手 = 'kuaishou',
}

export enum ORDER_STATUS {
  待发货 = 10,
  已发货 = 30,
  已完成 = 40,
  已关闭 = 50,
}

/**
 * 活动交付状态 1-待交付 10-已交付
 */
export enum ACT_SUBMIT_STATUS {
  待报名 = 0,
  待交付 = 1,
  已交付 = 10,
}

/**
 * 上架状态 1-上架 0-下架
 */
export enum ITEM_PUBLISH_STATUS {
  上架 = 1,
  下架 = 0,
}

/**
 * 活动状态  待报名 = 20,待交付 = 30,推广中 = 50,已交付 = 40,待新建商品 = 10, 已结束 = 110
 */
export enum ACTIVITY_STATUS {
  待报名 = 20,
  待交付 = 30,
  推广中 = 50,
  已交付 = 40,
  待新建商品 = 10,
  已结束 = 110,
}

/**
 * 是否已经同步小红书: 0-未同步 10-同步成功 11-同步失败 99-忽略
 */
export enum SYNC_REDBOOK_STATUS {
  未同步 = 0,
  同步成功 = 10,
  同步失败 = 11,
  忽略 = 99,
}

/**
 * 笔记审核状态
 */
export enum NOTES_AUDIT_STATUS {
  待审核 = 0,
  审核中 = 1,
  审核通过 = 2,
  审核驳回 = 3,
  忽略 = 100,
}

/**
 * 任务状态
 */
export enum TASK_ITEM_STATUS {
  未开始 = 0,
  处理中 = 1,
  已完成 = 10,
  异常 = 11,
}
