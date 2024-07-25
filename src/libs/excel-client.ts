/*
 * @Author: zcxb
 * @Date: 2023-02-22 15:02:15
 * @LastEditors: zcxb
 * @LastEditTime: 2023-02-28 17:09:50
 * @FilePath: /hongyun-master-service/src/libs/excel.ts
 * @Description:
 *
 * Copyright (c) 2023 by Myun, All Rights Reserved.
 */
import { Workbook, Worksheet, stream } from 'exceljs';
import { ensureDir, outputFile, remove } from 'fs-extra';
import { resolve } from 'path';

// excel 配置
interface excel_config {
  // 是否从模板里面导入，传模板相对路径
  template?: string;
  // 保存文件名称,如果不传，默认就是时间戳.xlsx
  save_file_name?: string;
  // 从第几行开始写入数据
  startRowNumber?: number;
  // [['1',{buffer:''},'3']]
  // 0:图片所在的列索引 format “jpeg”，“png”，“gif”
  // 执行导出是图片的字段 {1:{buffer:'二进制图片',format?:'图片的格式',width?:200,height?:200}}
  imgCells?: any;

  height?: number;
}

export class ExcelClient {
  private save_file_name;
  private template;
  private saveFloder;
  private startRowNumber;
  private imgCells;
  private height;
  constructor(config?: excel_config) {
    if (!config) {
      config = {};
    }
    this.save_file_name =
      config.save_file_name || `${new Date().getTime()}.xlsx`;
    this.template = config.template
      ? resolve(__dirname, '../../template/', config.template)
      : '';
    console.log('template', this.template);
    this.startRowNumber = config.startRowNumber || 1;
    this.saveFloder = resolve(__dirname, '../../xlsx-files/');
    this.imgCells = config.imgCells || {};
    this.height = config.height || 15;
  }

  // 导出excel注意数据格式[['1','2','3'],['4','5','6']]
  async export(items: Array<any>) {
    try {
      // 如果不存在此目录，创建
      await ensureDir(this.saveFloder);

      const workbook = new Workbook();
      let sheet: any;
      if (this.template) {
        const worksheet = await workbook.xlsx.readFile(this.template);
        sheet = worksheet.getWorksheet(1);
      } else {
        sheet = workbook.addWorksheet('sheet1');
      }

      // 循环遍历
      items.forEach((cells, i) => {
        if (i % 1000 === 0 || i === items.length - 1) {
          console.log(
            `[导出Excel]进度: ${((i / (items.length - 1)) * 100).toFixed(2)}%`,
          );
        }
        const row = sheet.getRow(this.startRowNumber + i);
        row.height = this.height;
        cells.forEach((cell, j) => {
          // 是否是图片列
          const imgCell = this.imgCells[j];
          if (imgCell && cell) {
            const imgId = workbook.addImage({
              buffer: cell,
              extension: imgCell.format || 'jpeg',
            });
            sheet.addImage(imgId, {
              tl: { col: j, row: this.startRowNumber + i - 1 },
              ext: {
                width: imgCell.width || 200,
                height: imgCell.height || 200,
              },
            });
          } else {
            row.getCell(j + 1).value = cell;
          }
        });
      });

      const saved = this.saveFloder + '/' + this.save_file_name;
      console.log('[导出Excel]开始写入文件');
      await workbook.xlsx.writeFile(saved, {
        useSharedStrings: true,
        useStyles: true,
      });
      console.log('[导出Excel]写入完成');
      return saved;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async exportStream(items: Array<any>) {
    try {
      // 如果不存在此目录，创建
      await ensureDir(this.saveFloder);

      const workbook = new Workbook();
      let template_ws: any;
      if (this.template) {
        const template_wb = await workbook.xlsx.readFile(this.template);
        template_ws = template_wb.getWorksheet(1);
      } else {
        template_ws = workbook.addWorksheet('sheet1');
      }

      const target_filename = this.saveFloder + '/' + this.save_file_name;
      console.log('[导出Excel]开始写入文件');
      const target_wb = new stream.xlsx.WorkbookWriter({
        filename: target_filename,
        useSharedStrings: true,
        useStyles: true,
      });
      const target_ws = target_wb.addWorksheet('sheet1');

      // 添加表头
      const header_col_cnt = items[0].length; // 表头列数
      const header_row = template_ws.getRow(1);
      const header = [];
      for (
        let header_col_idx = 0;
        header_col_idx < header_col_cnt;
        header_col_idx++
      ) {
        const value = header_row.getCell(header_col_idx + 1).value;
        header.push(value);
      }
      target_ws.addRow(header).commit();

      // 循环遍历
      items.forEach((cells, i) => {
        if (i % 10000 === 0 || i === items.length - 1) {
          console.log(
            `[导出Excel]进度: ${((i / (items.length - 1)) * 100).toFixed(2)}%`,
          );
        }
        // const row = target_ws.getRow(this.startRowNumber + i);
        // row.height = this.height;
        target_ws.addRow(cells).commit();
      });
      // await workbook.xlsx.writeFile(saved, {
      //   useSharedStrings: true,
      //   useStyles: true,
      // });
      await target_wb.commit();
      console.log('[导出Excel]写入完成');
      return target_filename;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }
}
