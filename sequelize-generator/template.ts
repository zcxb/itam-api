/*
 * @Author: leyi leyi@myun.info
 * @Date: 2023-03-04 17:18:14
 * @LastEditors: leyi leyi@myun.info
 * @LastEditTime: 2023-03-04 17:18:30
 * @FilePath: /easy-front-nest-service/sequelize-generator/template.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
export const DTOTemplate = `import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsInt,
  IsDateString,
  Min,
  Max,
  IsArray,
  ArrayNotEmpty,
  IsOptional,
  IsEnum,
  Length,
  ValidateNested,
  MaxLength,
  MinLength,
  ArrayMaxSize,
  ArrayMinSize,
  IsEmpty,
  IsDecimal,
} from 'class-validator';
// import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { QueryDTO, BaseDTO, UpdateStatusDTO } from '@dto/BaseDTO';

`;
