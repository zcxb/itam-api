import { IsString, IsInt, Min, Max, IsArray, IsOptional, ArrayMinSize, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class BaseDTO {
  @ApiPropertyOptional({
    description: '时间戳',
    type: Number,
  })
  @IsOptional()
  @IsInt({ message: 'timestamp必须为有效整数' })
  readonly timestamp?: number;

  @ApiPropertyOptional({
    description: '签名',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'sign必须为字符串' })
  readonly sign?: string;

  @ApiPropertyOptional({
    description: '缓存key',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'cache_key必须为字符串' })
  readonly cache_key?: string;

  @ApiPropertyOptional({
    description: '删除缓存key',
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'del_cache_key必须为数组' })
  readonly del_cache_key?: string[];

  @ApiPropertyOptional({
    description: '缓存模式，EX或者PX，不传默认EX',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'cache_mode必须为字符串' })
  readonly cache_mode?: string;

  @ApiPropertyOptional({
    description: '缓存时长，不传时1~20秒随机',
    type: Number,
  })
  @IsOptional()
  @IsInt({ message: 'cache_time必须为有效整数' })
  @Min(1, { message: 'cache_time必须大于等于1' })
  readonly cache_time?: number;
}

export class QueryDTO extends BaseDTO {
  @ApiPropertyOptional({
    description: 'pageNum页面(1开始)',
    type: Number,
  })
  @IsOptional()
  @IsInt({ message: 'pageNum必须为必须为有效整数' })
  @Min(1, { message: 'pageNum应大于等于1' })
  readonly pageNum = 1;

  @ApiPropertyOptional({
    description: 'pageSize页面(1开始)',
    type: Number,
  })
  @IsOptional()
  @IsInt({ message: 'pageSize必须为必须为有效整数' })
  @Min(1, { message: 'pageSize应大于等于1' })
  @Max(1000, { message: 'pageSize应小于等于1000' })
  readonly pageSize = 10;

  @ApiPropertyOptional({
    description: '排序字段(https://www.sequelize.com.cn/core-concepts/model-querying-basics#%E6%8E%92%E5%BA%8F)',
    type: Array,
  })
  @IsOptional()
  @IsArray({ message: 'order必须为数组' })
  readonly order?: Array<any>;

  @ApiPropertyOptional({
    description:
      '查询字段名(https://www.sequelize.com.cn/core-concepts/model-querying-basics#select-%E6%9F%A5%E8%AF%A2%E7%89%B9%E5%AE%9A%E5%B1%9E%E6%80%A7)',
    type: Object,
  })
  @IsOptional()
  readonly attributes?: any;
}

export class UpdateStatusDTO extends BaseDTO {
  @ApiPropertyOptional({
    description: '是否启用 1:启用',
    type: Number,
  })
  @IsOptional()
  @IsInt({ message: 'enabled必须为有效整数' })
  @Min(0, { message: 'enabled必须大于等于0' })
  readonly enabled?: number;

  @ApiPropertyOptional({
    description: '是否逻辑删除 1:已删除',
    type: Number,
  })
  @IsOptional()
  @IsInt({ message: 'deleted必须为有效整数' })
  @Min(0, { message: 'deleted必须大于等于0' })
  readonly deleted?: number;
}

export class DeleteRowDTO extends BaseDTO {
  @ApiProperty({
    description: '删除主键',
    type: Number,
  })
  @IsInt({ message: 'id必须为有效整数' })
  readonly id: number;

  @ApiProperty({
    description: '删除原因',
    required: false,
    type: String,
  })
  readonly delete_reason?: string;
}

export class UpdateFiledsDTO {
  @ApiProperty({
    description: '字段名称',
    type: String,
  })
  readonly filed_name: string;

  @ApiProperty({
    description: '字段值',
    type: String,
  })
  readonly filed_value: any;
}

export class UpdateDTO extends BaseDTO {
  @ApiProperty({
    description: '系统编号',
    type: Number,
  })
  @IsInt({ message: 'id必须为有效整数' })
  readonly id: number;

  @ApiPropertyOptional({
    description: '更新字段名',
    type: [UpdateFiledsDTO],
  })
  @IsArray({ message: 'update_fileds必须为数组' })
  @ArrayMinSize(1, { message: 'update_fileds至少更新一个字段' })
  @ValidateNested({ each: true })
  @Type(() => UpdateFiledsDTO)
  readonly update_fileds?: Array<UpdateFiledsDTO>;
}
