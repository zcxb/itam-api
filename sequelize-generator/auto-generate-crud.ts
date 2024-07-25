import * as Inquirer from 'inquirer';
import * as Chalk from 'chalk';
import * as fs from 'fs';
import { ensureFile, pathExists } from 'fs-extra';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import { Op, FindAndCountOptions, QueryTypes } from 'sequelize';
import * as lint from 'eslint';
import { DTOTemplate } from './template';

dotenv.config({ path: path.resolve(__dirname, '../src/.env') });

const eslintDefaultConfig: any = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  plugins: [],
  extends: [],
  rules: {
    'padded-blocks': [
      'error',
      { blocks: 'always', classes: 'always', switches: 'always' },
    ],
    'lines-between-class-members': ['error', 'always'],
    'object-curly-newline': [
      'error',
      {
        ObjectExpression: 'always',
        ObjectPattern: { multiline: true },
        ImportDeclaration: { multiline: true, minProperties: 3 },
        ExportDeclaration: { multiline: true, minProperties: 3 },
      },
    ],
    'object-property-newline': ['error'],
    indent: ['error', 'tab'],
  },
};

const DTODataTypesMap = {
  bigint: 'int',
  int: 'int',
  smallint: 'int',
  mediumint: 'int',
  tinyint: 'int',
  decimal: 'decimal',
  float: 'float',
  double: 'double',
  bit: 'int',
  varchar: 'string',
  char: 'string',
  text: 'string',
  tinytext: 'string',
  mediumtext: 'string',
  longtext: 'string',
  date: 'string',
  datetime: 'string',
  time: 'string',
  timestamp: 'int',
  year: 'int',
  set: 'string',
  json: 'object',
};

const lowerCaseFirstLetter = (str: string): string => {
  return str.replace(/^[A-Z]/, (match) => match.toLowerCase());
};

const convertToSnakeCase = (str: string, separator = '_'): string => {
  // 将字符串中的大写字母前面加上下划线，然后转换为小写
  const snakeCase = str.replace(/([A-Z])/g, `${separator}$1`).toLowerCase();
  // 如果字符串以下划线开头，则去除开头的下划线
  return snakeCase.startsWith(separator) ? snakeCase.slice(1) : snakeCase;
};

const getDefaultValue = (columnDefault) => {
  if (!columnDefault) {
    return null;
  }
  // Check if it is MySQL binary representation (e.g. b'100')
  const regex = new RegExp(/b\'([01]+)\'/g);
  const binaryStringCheck = regex.exec(columnDefault);
  if (binaryStringCheck) {
    const parsed = parseInt(binaryStringCheck[1], 2);
    if (parsed !== null) {
      return parsed;
    }
  }
  return columnDefault;
};

const readDbModels = async (
  dirPath: string,
): Promise<Record<string, any>[]> => {
  return new Promise((resolve, reject) => {
    const absolutePath = path.resolve(__dirname, dirPath);
    fs.readdir(absolutePath, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      const dbModels: Record<string, any>[] = [];

      files.forEach((fileName) => {
        if (fileName.endsWith('.js') || fileName.endsWith('.ts')) {
          const fullPath = `${absolutePath}/${fileName}`;
          const dbModelName = fileName.replace('.js', '').replace('.ts', '');
          dbModels.push({
            dbModelFullPath: fullPath,
            dbModelName,
          });
        }
      });

      resolve(dbModels);
    });
  });
};

const readController = async (
  dirPath: string,
): Promise<Record<string, any>[]> => {
  return new Promise((resolve, reject) => {
    const absolutePath = path.resolve(__dirname, dirPath);
    fs.readdir(absolutePath, async (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      let controllers: Record<string, any>[] = [];

      for (const fileName of files) {
        const fullPath = `${absolutePath}/${fileName}`;
        const isDirectory = fs.lstatSync(fullPath).isDirectory();
        if (isDirectory) {
          // 如果是文件夹，则递归调用 readDirectory 函数
          const names = await readController(fullPath);
          controllers = controllers.concat(names);
        } else {
          if (fileName.endsWith('.controller.ts')) {
            controllers.push({
              controllerFullPath: fullPath,
              controllerName: `${fullPath.substring(
                fullPath.indexOf(`/src/modules/`),
              )}`.replace('.ts', ''),
            });
          }
        }
      }

      resolve(controllers);
    });
  });
};

const getColumnValidator = (
  columnName: string,
  columnComment: string,
  columnType: string,
  columnRequired: boolean,
): string => {
  const dtoColumnType = DTODataTypesMap[columnType] ?? 'string';

  if (dtoColumnType === 'string') {
    return `${columnRequired ? '@ApiProperty' : '@ApiPropertyOptional'}({
              description: '${columnComment}',
              type: String,
            })
            ${columnRequired ? '' : '@IsOptional()'}
            @IsString({ message: '${columnName}必须为字符串' })
            ${
              columnRequired
                ? ''
                : "@IsNotEmpty({ message: '" +
                  columnName +
                  "必须不能为空字符串' })"
            }`;
  } else if (dtoColumnType === 'int') {
    return `${columnRequired ? '@ApiProperty' : '@ApiPropertyOptional'}({
              description: '${columnComment}',
              type: Number,
            })
            ${columnRequired ? '' : '@IsOptional()'}
            @IsInt({ message: '${columnName}必须为有效整数' })`;
  } else if (
    dtoColumnType === 'decimal' ||
    dtoColumnType === 'float' ||
    dtoColumnType === 'double'
  ) {
    return `${columnRequired ? '@ApiProperty' : '@ApiPropertyOptional'}({
              description: '${columnComment}',
              type: Number,
            })
            ${columnRequired ? '' : '@IsOptional()'}
            @IsNumber({
              allowNaN: false,
              allowInfinity: false,
              maxDecimalPlaces: 2,
            }, { message: '${columnName}必须是数字，最多2位小数' })`;
  }
  return '';
};

const createDTO = async (
  dbModelName: string,
  dtoFullPath: string,
): Promise<Record<string, any>> => {
  const realTableName = convertToSnakeCase(dbModelName);
  const immutableColumnsDTO = [
    'created_at',
    'updated_at',
    'deleted_at',
    'created_by',
    'updated_by',
  ];
  const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    dialect: 'mysql',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string),
  });

  const query = `
        SELECT 
          c.ORDINAL_POSITION,
          c.TABLE_SCHEMA,
          c.TABLE_NAME,
          c.COLUMN_NAME,
          c.DATA_TYPE,
          c.COLUMN_TYPE,
          c.CHARACTER_MAXIMUM_LENGTH,
          c.NUMERIC_PRECISION,
          c.NUMERIC_SCALE,
          c.DATETIME_PRECISION,                                             
          c.IS_NULLABLE,
          c.COLUMN_KEY,
          c.EXTRA,
          c.COLUMN_DEFAULT,
          c.COLUMN_COMMENT,
          t.TABLE_COMMENT                        
        FROM information_schema.columns c
        INNER JOIN information_schema.tables t
        ON c.TABLE_SCHEMA = t.TABLE_SCHEMA AND c.TABLE_NAME = t.TABLE_NAME
        WHERE c.TABLE_SCHEMA = '${process.env.DB_NAME}' AND c.TABLE_NAME = '${realTableName}' ORDER BY c.ORDINAL_POSITION;
  `;
  const columns: any = await sequelize.query(query, {
    type: QueryTypes.SELECT,
    raw: true,
  });
  const columnsMetadata: any[] = [];
  for (const column of columns) {
    if (column.COLUMN_NAME === 'deleted_at') {
      continue;
    }
    const columnMetadata = {
      name: column.COLUMN_NAME,
      type: column.DATA_TYPE,
      allowNull: column.IS_NULLABLE === 'YES',
      primaryKey: column.COLUMN_KEY === 'PRI',
      comment: column.COLUMN_COMMENT,
      defaultValue: getDefaultValue(column.COLUMN_DEFAULT),
    };
    columnsMetadata.push(columnMetadata);
  }
  const addDTOName = `Add${dbModelName.slice(1)}DTO`;
  const updateDTOName = `Update${dbModelName.slice(1)}DTO`;
  const getDTOName = `Get${dbModelName.slice(1)}DTO`;
  const delDTOName = `Delete${dbModelName.slice(1)}DTO`;

  let addDTOContent = `export class ${addDTOName} extends BaseDTO {}`;
  let updateDTOContent = `export class ${updateDTOName} extends BaseDTO {}`;
  let getDTOContent = `export class ${getDTOName} extends QueryDTO {}`;
  let delDTOContent = `export class ${delDTOName} extends BaseDTO {}`;

  for (const columnMetadata of columnsMetadata) {
    const { name, type, allowNull, primaryKey, comment, defaultValue } =
      columnMetadata;

    const dtoColumnType = DTODataTypesMap[type] ?? 'string';
    const columnRequired = !allowNull && !defaultValue;
    const columnDTOContent = `
      ${getColumnValidator(name, comment, type, columnRequired)}
      readonly ${name}${columnRequired ? '' : '?'}${
      defaultValue
        ? `=${defaultValue}`
        : `: ${
            ['int', 'decimal', 'float', 'double'].includes(dtoColumnType)
              ? 'number'
              : dtoColumnType
          }`
    };`;

    if (!primaryKey && !immutableColumnsDTO.includes(name)) {
      addDTOContent = addDTOContent.replace(/}$/, `  ${columnDTOContent}\n}`);
    }

    updateDTOContent = updateDTOContent.replace(
      /}$/,
      `  ${columnDTOContent}\n}`,
    );

    getDTOContent = getDTOContent.replace(/}$/, `  ${columnDTOContent}\n}`);

    if (primaryKey) {
      delDTOContent = delDTOContent.replace(/}$/, `  ${columnDTOContent}\n}`);
    }
  }

  await await ensureFile(dtoFullPath);
  let dtoFileContent = fs.readFileSync(dtoFullPath, 'utf8');
  if (!dtoFileContent) {
    dtoFileContent = `${DTOTemplate}`;
  }

  dtoFileContent = `${dtoFileContent}
                    ${addDTOContent} 
                    ${updateDTOContent}
                    ${getDTOContent}
                    ${delDTOContent}`;
  fs.writeFileSync(dtoFullPath, dtoFileContent, 'utf8');
  return { addDTOName, updateDTOName, getDTOName, delDTOName };
};

const createControlFun = async ({
  addDTOName,
  updateDTOName,
  getDTOName,
  delDTOName,
  controllerFullPath,
}) => {
  if (!pathExists(controllerFullPath)) {
    throw new Error('controller file not exists');
  }

  let controllerFileContent = fs.readFileSync(controllerFullPath, 'utf8');
  if (!controllerFileContent) {
    throw new Error('controller file is empty');
  }
  if (!controllerFileContent.includes('constructor')) {
    throw new Error('controller file is invalid');
  }
  const moduleName = `${controllerFullPath.split('/').pop().split('.')[0]}`;

  if (controllerFileContent.includes(`${moduleName}.dto`)) {
    const regex = new RegExp(`}(\\s*)from\\s*['"].*${moduleName}\\.dto['"]`);
    if (!controllerFileContent.includes(addDTOName)) {
      controllerFileContent = controllerFileContent.replace(
        regex,
        `,${addDTOName} $&`,
      );
    }
    if (!controllerFileContent.includes(updateDTOName)) {
      controllerFileContent = controllerFileContent.replace(
        regex,
        `,${updateDTOName} $&`,
      );
    }
    if (!controllerFileContent.includes(getDTOName)) {
      controllerFileContent = controllerFileContent.replace(
        regex,
        `,${getDTOName} $&`,
      );
    }
    if (!controllerFileContent.includes(delDTOName)) {
      controllerFileContent = controllerFileContent.replace(
        regex,
        `,${delDTOName} $&`,
      );
    }
  } else {
    controllerFileContent = `import {
        ${addDTOName}, ${updateDTOName}, ${getDTOName}, ${delDTOName}
      } from './${moduleName}.dto';\n\n${controllerFileContent}`;
  }

  const regex = /(\s*})(\s*)$/;
  if (
    !controllerFileContent.includes(`async ${addDTOName.replace('DTO', '')}(`)
  ) {
    const addFun = `
    @ApiOperation({
      summary: '${addDTOName.replace('DTO', '')}',
      description: '${addDTOName.replace('DTO', '')}',
    })
    @ApiBody({
      description: '请求参数',
      type: ${addDTOName},
    })
    @UsePipes(new ValidationPipe({ transform: true }))
    @Post('${convertToSnakeCase(addDTOName.replace('DTO', ''), '-')}')
    async ${lowerCaseFirstLetter(addDTOName.replace('DTO', ''))}(
      @Session() session,
      @Body() body: ${addDTOName},
    ): Promise<any> {
      const { user } = session;
      const response = await this.${moduleName}Service.${lowerCaseFirstLetter(
      addDTOName.replace('DTO', ''),
    )}(body, user);
      return response;
    }`;

    controllerFileContent = controllerFileContent.replace(
      regex,
      `\n\n${addFun}\n$1$2`,
    );
  }

  if (
    !controllerFileContent.includes(
      `async ${updateDTOName.replace('DTO', '')}(`,
    )
  ) {
    const updateFun = `
    @ApiOperation({
      summary: '${updateDTOName.replace('DTO', '')}',
      description: '${updateDTOName.replace('DTO', '')}',
    })
    @ApiBody({
      description: '请求参数',
      type: ${updateDTOName},
    })
    @UsePipes(new ValidationPipe({ transform: true }))
    @Post('${convertToSnakeCase(updateDTOName.replace('DTO', ''), '-')}')
    async ${lowerCaseFirstLetter(updateDTOName.replace('DTO', ''))}(
      @Session() session,
      @Body() body: ${updateDTOName},
    ): Promise<any> {
      const { user } = session;
      const response = await this.${moduleName}Service.${lowerCaseFirstLetter(
      updateDTOName.replace('DTO', ''),
    )}(body, user);
      return response;
    }`;

    controllerFileContent = controllerFileContent.replace(
      regex,
      `\n\n${updateFun}\n$1$2`,
    );
  }

  if (
    !controllerFileContent.includes(`async ${getDTOName.replace('DTO', '')}(`)
  ) {
    const getFun = `
    @ApiOperation({
      summary: '${getDTOName.replace('DTO', '')}',
      description: '${getDTOName.replace('DTO', '')}',
    })
    @ApiBody({
      description: '请求参数',
      type: ${getDTOName},
    })
    @UsePipes(new ValidationPipe({ transform: true }))
    @Post('${convertToSnakeCase(getDTOName.replace('DTO', ''), '-')}')
    async ${lowerCaseFirstLetter(getDTOName.replace('DTO', ''))}(
      @Session() session,
      @Body() body: ${getDTOName},
    ): Promise<any> {
      const { user } = session;
      const response = await this.${moduleName}Service.${lowerCaseFirstLetter(
      getDTOName.replace('DTO', ''),
    )}(body, user);
      return response;
    }`;

    controllerFileContent = controllerFileContent.replace(
      regex,
      `\n\n${getFun}\n$1$2`,
    );
  }

  if (
    !controllerFileContent.includes(`async ${delDTOName.replace('DTO', '')}(`)
  ) {
    const delFun = `
    @ApiOperation({
      summary: '${delDTOName.replace('DTO', '')}',
      description: '${delDTOName.replace('DTO', '')}',
    })
    @ApiBody({
      description: '请求参数',
      type: ${delDTOName},
    })
    @UsePipes(new ValidationPipe({ transform: true }))
    @Post('${convertToSnakeCase(delDTOName.replace('DTO', ''), '-')}')
    async ${lowerCaseFirstLetter(delDTOName.replace('DTO', ''))}(
      @Session() session,
      @Body() body: ${delDTOName},
    ): Promise<any> {
      const { user } = session;
      const response = await this.${moduleName}Service.${lowerCaseFirstLetter(
      delDTOName.replace('DTO', ''),
    )}(body, user);
      return response;
    }`;

    controllerFileContent = controllerFileContent.replace(
      regex,
      `\n\n${delFun}\n$1$2`,
    );
  }

  fs.writeFileSync(controllerFullPath, controllerFileContent, 'utf8');
};

const createServiceFun = async ({
  dbModelName,
  addDTOName,
  updateDTOName,
  getDTOName,
  delDTOName,
  serviceFullPath,
}) => {
  if (!pathExists(serviceFullPath)) {
    throw new Error('controller file not exists');
  }

  let serivceFileContent = fs.readFileSync(serviceFullPath, 'utf8');
  if (!serivceFileContent) {
    throw new Error('serivce file is empty');
  }
  if (!serivceFileContent.includes('constructor')) {
    throw new Error('service file is invalid');
  }
  const moduleName = `${serviceFullPath.split('/').pop().split('.')[0]}`;

  if (serivceFileContent.includes(`${moduleName}.dto`)) {
    const regex = new RegExp(`}(\\s*)from\\s*['"].*${moduleName}\\.dto['"]`);
    if (!serivceFileContent.includes(addDTOName)) {
      serivceFileContent = serivceFileContent.replace(
        regex,
        `,${addDTOName} $&`,
      );
    }
    if (!serivceFileContent.includes(updateDTOName)) {
      serivceFileContent = serivceFileContent.replace(
        regex,
        `,${updateDTOName} $&`,
      );
    }
    if (!serivceFileContent.includes(getDTOName)) {
      serivceFileContent = serivceFileContent.replace(
        regex,
        `,${getDTOName} $&`,
      );
    }
    if (!serivceFileContent.includes(delDTOName)) {
      serivceFileContent = serivceFileContent.replace(
        regex,
        `,${delDTOName} $&`,
      );
    }
  } else {
    serivceFileContent = `import {
        ${addDTOName}, ${updateDTOName}, ${getDTOName}, ${delDTOName}
      } from './${moduleName}.dto';\n\n${serivceFileContent}`;
  }

  if (serivceFileContent.includes(`} from '@models/index`)) {
    const regex = new RegExp(`}(\\s*)from\\s*['"].*@models/index['"]`);
    if (!serivceFileContent.includes(dbModelName)) {
      serivceFileContent = serivceFileContent.replace(
        regex,
        `,${dbModelName} $&`,
      );
    }
  } else {
    serivceFileContent = `import { ${dbModelName} } from '@models/index';\n\n${serivceFileContent}`;
  }

  let regex = /(constructor\s*\([\s\S]*?)\)(\s*{)/;
  if (!serivceFileContent.includes(`@InjectModel(${dbModelName})`)) {
    const newArg = `@InjectModel(${dbModelName})\n    private readonly ${lowerCaseFirstLetter(
      dbModelName,
    )}: typeof ${dbModelName}`;

    serivceFileContent = serivceFileContent.replace(regex, `$1 ${newArg})$2`);
  }

  regex = /(\s*})(\s*)$/;
  if (
    !serivceFileContent.includes(
      `async ${lowerCaseFirstLetter(addDTOName.replace('DTO', ''))}(`,
    )
  ) {
    const addFun = `
    async ${lowerCaseFirstLetter(
      addDTOName.replace('DTO', ''),
    )}(requestBody: ${addDTOName}, user:any): Promise<any> {
      const add_data = {...requestBody, created_by: user.customer_id ?? 1};
      const attribute = await this.${lowerCaseFirstLetter(
        dbModelName,
      )}.create(add_data);
        return { id: attribute.id };
    }
    `;

    serivceFileContent = serivceFileContent.replace(
      regex,
      `\n\n${addFun}\n$1$2`,
    );
  }

  if (
    !serivceFileContent.includes(
      `async ${lowerCaseFirstLetter(updateDTOName.replace('DTO', ''))}(`,
    )
  ) {
    const updateFun = `
    async ${lowerCaseFirstLetter(
      updateDTOName.replace('DTO', ''),
    )}(requestBody: ${updateDTOName}, user:any): Promise<any> {
      const {id, ...otherRequestBody} = requestBody
      const update_data = {...otherRequestBody, updated_by: user.customer_id ?? 1};
      await this.${lowerCaseFirstLetter(dbModelName)}.update(
        update_data,
        {
          where: {
            id,
          },
        });
        return { id };
      }
    `;

    serivceFileContent = serivceFileContent.replace(
      regex,
      `\n\n${updateFun}\n$1$2`,
    );
  }

  if (
    !serivceFileContent.includes(
      `async ${lowerCaseFirstLetter(getDTOName.replace('DTO', ''))}(`,
    )
  ) {
    const getFun = `
    async ${lowerCaseFirstLetter(
      getDTOName.replace('DTO', ''),
    )}(requestBody: ${getDTOName}, user:any): Promise<any> {
      const {attributes, ...otherRequestBody} = requestBody
      const row = await this.${lowerCaseFirstLetter(dbModelName)}.findOne({
        attributes,
        where: otherRequestBody,
        raw: true,        
      });
      return row;  
    }
    `;

    serivceFileContent = serivceFileContent.replace(
      regex,
      `\n\n${getFun}\n$1$2`,
    );
  }

  if (
    !serivceFileContent.includes(
      `async ${lowerCaseFirstLetter(delDTOName.replace('DTO', ''))}(`,
    )
  ) {
    const getFun = `
    async ${lowerCaseFirstLetter(
      delDTOName.replace('DTO', ''),
    )}(requestBody: ${delDTOName}, user:any): Promise<any> {
      const { id } = requestBody
      const row = await this.${lowerCaseFirstLetter(dbModelName)}.destroy({
        where: { id },
        deleted_by: user.customer_id ?? 1,
      } as any);
      return row;  
    }
    `;

    serivceFileContent = serivceFileContent.replace(
      regex,
      `\n\n${getFun}\n$1$2`,
    );
  }

  fs.writeFileSync(serviceFullPath, serivceFileContent, 'utf8');
};

export async function run() {
  const dbModels = await readDbModels('../src/models');
  const dbModelNames = dbModels.map((item) => item.dbModelName);
  const { db_model_name } = await Inquirer.prompt({
    name: 'db_model_name',
    type: 'list',
    choices: dbModelNames,
    message: 'Please choose a model',
  });

  const dbModel: any = dbModels.find(
    (item) => item.dbModelName === db_model_name,
  );
  const { dbModelName, dbModelFullPath } = dbModel;

  const controllers = await readController('../src/modules');
  const controllerNames = controllers.map((item) => item.controllerName);

  const { controller_name } = await Inquirer.prompt({
    name: 'controller_name',
    type: 'list',
    choices: controllerNames,
    message:
      'Please choose a controller, create an interface in the controller of your choiced ',
  });
  const module: any = controllers.find(
    (item) => item.controllerName === controller_name,
  );
  const { controllerName, controllerFullPath } = module;
  const dtoFullPath = controllerFullPath.replace('.controller.ts', '.dto.ts');

  const serviceFullPath = controllerFullPath.replace(
    '.controller.ts',
    '.service.ts',
  );
  // console.log(`dbModelName:`, dbModelName);
  // console.log(`dbModelFullPath:`, dbModelFullPath);
  // console.log(`controllerName:`, controllerName);
  // console.log(`controllerFullPath:`, controllerFullPath);
  // console.log(`dtoFullPath:`, dtoFullPath);
  // console.log(`serviceFullPath:`, serviceFullPath);

  const { addDTOName, updateDTOName, getDTOName, delDTOName } = await createDTO(
    dbModelName,
    dtoFullPath,
  );
  await createControlFun({
    addDTOName,
    updateDTOName,
    getDTOName,
    delDTOName,
    controllerFullPath,
  });

  await createServiceFun({
    dbModelName,
    addDTOName,
    updateDTOName,
    getDTOName,
    delDTOName,
    serviceFullPath,
  });
  const lnitEngine = new lint.ESLint({
    baseConfig: eslintDefaultConfig,
    fix: true,
  });

  const report = await lnitEngine.lintFiles([
    dtoFullPath,
    controllerFullPath,
    serviceFullPath,
  ]);
  await lint.ESLint.outputFixes(report);
}
