/*
 * @Author: zcxb
 * @Date: 2023-05-09 10:27:28
 * @LastEditors: zcxb
 * @LastEditTime: 2023-06-13 09:53:45
 * @FilePath: /itam-api/src/service/cron-task.service.ts
 * @Description:
 *
 * Copyright (c) 2023 by Myun, All Rights Reserved.
 */
// import { ActivityService } from '@modules/activity/activity.service';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronTaskService {
  private main_instance = process.env.INSTANCE_ID === '0' || process.env.INSTANCE_ID == null;
  private updateActivitiesLatestStatus_flag = false;
  private clearActivitiesTodaySummary_flag = false;
  private updateActivitiesTodaySummary_flag = false;

  constructor( ) {
    if (this.main_instance) {
      // this.updateActivitiesTodaySummary();
    }
  }

  // cron job: 更新活动最新状态
  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  // async updateActivitiesLatestStatus() {
  //   if (this.main_instance) {
  //     if (this.updateActivitiesLatestStatus_flag) {
  //       return;
  //     } else {
  //       try {
  //         this.updateActivitiesLatestStatus_flag = true;
  //         await this.activityService.updateActivitiesLatestStatus();
  //       } finally {
  //         this.updateActivitiesLatestStatus_flag = false;
  //       }
  //     }
  //   }
  // }

  // // cron job: 清空每天的活动数据统计
  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  // async clearActivitiesTodaySummary() {
  //   if (this.main_instance) {
  //     if (this.updateActivitiesTodaySummary_flag) {
  //       return;
  //     } else {
  //       try {
  //         this.updateActivitiesTodaySummary_flag = true;
  //         await this.activityService.clearActivitiesTodaySummary();
  //       } finally {
  //         this.updateActivitiesTodaySummary_flag = false;
  //       }
  //     }
  //   }
  // }

  // // cron job: 更新推广中活动的当日数据统计
  // @Cron(CronExpression.EVERY_MINUTE)
  // async updateActivitiesTodaySummary() {
  //   if (this.main_instance) {
  //     if (this.updateActivitiesTodaySummary_flag) {
  //       return;
  //     } else {
  //       try {
  //         this.updateActivitiesTodaySummary_flag = true;
  //         await this.activityService.updateActivitiesTodaySummary();
  //       } finally {
  //         this.updateActivitiesTodaySummary_flag = false;
  //       }
  //     }
  //   }
  // }
}
