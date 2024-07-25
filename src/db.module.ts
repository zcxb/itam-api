/*
 * @Author: zcxb
 * @Date: 2023-05-09 10:27:28
 * @LastEditors: zcxb
 * @LastEditTime: 2023-06-13 09:31:45
 * @FilePath: /itam-api/src/db.module.ts
 * @Description:
 *
 * Copyright (c) 2023 by Myun, All Rights Reserved.
 */
import { Module, Global } from '@nestjs/common';
import { InjectModel, SequelizeModule } from '@nestjs/sequelize';
import {
  // TActivity,
  // TArea,
  // TDictionary,
  // TItem,
  // TMaterial,
  // TOrder,
  // TOrderItem,
  // TQgNotes,
  // TSeller,
  // TShop,
  // TShopGroup,
  // TTaskItem,
  // TUser,
  // TUserLogin,
  // TUserOplog,
  // TUserRight,
  // TUserRightRelation,
  // TUserRole,
  // TUserRoleRelation,
  // TWaybillConfig,
  // TWaybillDelivery,
} from '@models/index';

@Global()
@Module({
  imports: [
    SequelizeModule.forFeature([
      // TActivity,
      // TArea,
      // TDictionary,
      // TItem,
      // TMaterial,
      // TOrder,
      // TOrderItem,
      // TQgNotes,
      // TSeller,
      // TShop,
      // TShopGroup,
      // TTaskItem,
      // TUser,
      // TUserLogin,
      // TUserOplog,
      // TUserRight,
      // TUserRightRelation,
      // TUserRole,
      // TUserRoleRelation,
      // TWaybillConfig,
      // TWaybillDelivery,
    ]),
  ],
  exports: [SequelizeModule],
  controllers: [],
  providers: [],
})
export class DBModule {
  constructor(
    // @InjectModel(TItem)
    // private readonly tItem: typeof TItem,
    // @InjectModel(TOrder)
    // private readonly tOrder: typeof TOrder,
    // @InjectModel(TOrderItem)
    // private readonly tOrderItem: typeof TOrderItem,
    // @InjectModel(TShop)
    // private readonly tShop: typeof TShop,
    // @InjectModel(TUser)
    // private readonly tUser: typeof TUser,
    // @InjectModel(TUserLogin)
    // private readonly tUserLogin: typeof TUserLogin,
    // @InjectModel(TUserRole)
    // private readonly tUserRole: typeof TUserRole,
    // @InjectModel(TUserRoleRelation)
    // private readonly tUserRoleRelation: typeof TUserRoleRelation,
  ) {
    // this.tItem.hasOne(this.tShop, {
    //   foreignKey: 'shop_id',
    //   sourceKey: 'shop_id',
    //   as: 'shop',
    // });

    // this.tOrder.hasOne(this.tShop, {
    //   foreignKey: 'shop_id',
    //   sourceKey: 'shop_id',
    //   as: 'shop',
    // });

    // this.tOrderItem.hasOne(this.tOrder, {
    //   foreignKey: 'id',
    //   sourceKey: 'order_id',
    //   as: 'order',
    // });

    // // 用户和登录账号 一对多关系
    // this.tUser.hasOne(this.tUserLogin, {
    //   foreignKey: 'user_id',
    //   sourceKey: 'id',
    //   as: 'account',
    // });

    // this.tUserRoleRelation.hasOne(this.tUserRole, {
    //   foreignKey: 'id',
    //   sourceKey: 'role_id',
    //   as: 'role',
    // });
  }
}
