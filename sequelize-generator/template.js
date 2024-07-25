"use strict";
exports.__esModule = true;
exports.DTOTemplate = void 0;
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
exports.DTOTemplate = "import {\n  IsNotEmpty,\n  IsString,\n  IsNumber,\n  IsInt,\n  IsDateString,\n  Min,\n  Max,\n  IsArray,\n  ArrayNotEmpty,\n  IsOptional,\n  IsEnum,\n  Length,\n  ValidateNested,\n  MaxLength,\n  MinLength,\n  ArrayMaxSize,\n  ArrayMinSize,\n  IsEmpty,\n  IsDecimal,\n} from 'class-validator';\n// import { Type } from 'class-transformer';\nimport { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';\nimport { QueryDTO, BaseDTO, UpdateStatusDTO } from '@dto/BaseDTO';\n\n";
