"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.run = void 0;
var Inquirer = require("inquirer");
var fs = require("fs");
var fs_extra_1 = require("fs-extra");
var path = require("path");
var dotenv = require("dotenv");
var sequelize_typescript_1 = require("sequelize-typescript");
var sequelize_1 = require("sequelize");
var lint = require("eslint");
var template_1 = require("./template");
dotenv.config({ path: path.resolve(__dirname, '../src/.env') });
var eslintDefaultConfig = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2019,
        sourceType: 'module'
    },
    plugins: [],
    "extends": [],
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
                ExportDeclaration: { multiline: true, minProperties: 3 }
            },
        ],
        'object-property-newline': ['error'],
        indent: ['error', 'tab']
    }
};
var DTODataTypesMap = {
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
    json: 'object'
};
var lowerCaseFirstLetter = function (str) {
    return str.replace(/^[A-Z]/, function (match) { return match.toLowerCase(); });
};
var convertToSnakeCase = function (str, separator) {
    if (separator === void 0) { separator = '_'; }
    // 将字符串中的大写字母前面加上下划线，然后转换为小写
    var snakeCase = str.replace(/([A-Z])/g, "".concat(separator, "$1")).toLowerCase();
    // 如果字符串以下划线开头，则去除开头的下划线
    return snakeCase.startsWith(separator) ? snakeCase.slice(1) : snakeCase;
};
var getDefaultValue = function (columnDefault) {
    if (!columnDefault) {
        return null;
    }
    // Check if it is MySQL binary representation (e.g. b'100')
    var regex = new RegExp(/b\'([01]+)\'/g);
    var binaryStringCheck = regex.exec(columnDefault);
    if (binaryStringCheck) {
        var parsed = parseInt(binaryStringCheck[1], 2);
        if (parsed !== null) {
            return parsed;
        }
    }
    return columnDefault;
};
var readDbModels = function (dirPath) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                var absolutePath = path.resolve(__dirname, dirPath);
                fs.readdir(absolutePath, function (err, files) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    var dbModels = [];
                    files.forEach(function (fileName) {
                        if (fileName.endsWith('.js') || fileName.endsWith('.ts')) {
                            var fullPath = "".concat(absolutePath, "/").concat(fileName);
                            var dbModelName = fileName.replace('.js', '').replace('.ts', '');
                            dbModels.push({
                                dbModelFullPath: fullPath,
                                dbModelName: dbModelName
                            });
                        }
                    });
                    resolve(dbModels);
                });
            })];
    });
}); };
var readController = function (dirPath) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                var absolutePath = path.resolve(__dirname, dirPath);
                fs.readdir(absolutePath, function (err, files) { return __awaiter(void 0, void 0, void 0, function () {
                    var controllers, _i, files_1, fileName, fullPath, isDirectory, names;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (err) {
                                    reject(err);
                                    return [2 /*return*/];
                                }
                                controllers = [];
                                _i = 0, files_1 = files;
                                _a.label = 1;
                            case 1:
                                if (!(_i < files_1.length)) return [3 /*break*/, 5];
                                fileName = files_1[_i];
                                fullPath = "".concat(absolutePath, "/").concat(fileName);
                                isDirectory = fs.lstatSync(fullPath).isDirectory();
                                if (!isDirectory) return [3 /*break*/, 3];
                                return [4 /*yield*/, readController(fullPath)];
                            case 2:
                                names = _a.sent();
                                controllers = controllers.concat(names);
                                return [3 /*break*/, 4];
                            case 3:
                                if (fileName.endsWith('.controller.ts')) {
                                    controllers.push({
                                        controllerFullPath: fullPath,
                                        controllerName: "".concat(fullPath.substring(fullPath.indexOf("/src/modules/"))).replace('.ts', '')
                                    });
                                }
                                _a.label = 4;
                            case 4:
                                _i++;
                                return [3 /*break*/, 1];
                            case 5:
                                resolve(controllers);
                                return [2 /*return*/];
                        }
                    });
                }); });
            })];
    });
}); };
var getColumnValidator = function (columnName, columnComment, columnType, columnRequired) {
    var _a;
    var dtoColumnType = (_a = DTODataTypesMap[columnType]) !== null && _a !== void 0 ? _a : 'string';
    if (dtoColumnType === 'string') {
        return "".concat(columnRequired ? '@ApiProperty' : '@ApiPropertyOptional', "({\n              description: '").concat(columnComment, "',\n              type: String,\n            })\n            ").concat(columnRequired ? '' : '@IsOptional()', "\n            @IsString({ message: '").concat(columnName, "\u5FC5\u987B\u4E3A\u5B57\u7B26\u4E32' })\n            ").concat(columnRequired
            ? ''
            : "@IsNotEmpty({ message: '" +
                columnName +
                "必须不能为空字符串' })");
    }
    else if (dtoColumnType === 'int') {
        return "".concat(columnRequired ? '@ApiProperty' : '@ApiPropertyOptional', "({\n              description: '").concat(columnComment, "',\n              type: Number,\n            })\n            ").concat(columnRequired ? '' : '@IsOptional()', "\n            @IsInt({ message: '").concat(columnName, "\u5FC5\u987B\u4E3A\u6709\u6548\u6574\u6570' })");
    }
    else if (dtoColumnType === 'decimal' ||
        dtoColumnType === 'float' ||
        dtoColumnType === 'double') {
        return "".concat(columnRequired ? '@ApiProperty' : '@ApiPropertyOptional', "({\n              description: '").concat(columnComment, "',\n              type: Number,\n            })\n            ").concat(columnRequired ? '' : '@IsOptional()', "\n            @IsNumber({\n              allowNaN: false,\n              allowInfinity: false,\n              maxDecimalPlaces: 2,\n            }, { message: '").concat(columnName, "\u5FC5\u987B\u662F\u6570\u5B57\uFF0C\u6700\u591A2\u4F4D\u5C0F\u6570' })");
    }
    return '';
};
var createDTO = function (dbModelName, dtoFullPath) { return __awaiter(void 0, void 0, void 0, function () {
    var realTableName, immutableColumnsDTO, sequelize, query, columns, columnsMetadata, _i, columns_1, column, columnMetadata, addDTOName, updateDTOName, getDTOName, delDTOName, addDTOContent, updateDTOContent, getDTOContent, delDTOContent, _a, columnsMetadata_1, columnMetadata, name_1, type, allowNull, primaryKey, comment, defaultValue, dtoColumnType, columnRequired, columnDTOContent, dtoFileContent;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                realTableName = convertToSnakeCase(dbModelName);
                immutableColumnsDTO = [
                    'created_at',
                    'updated_at',
                    'deleted_at',
                    'created_by',
                    'updated_by',
                ];
                sequelize = new sequelize_typescript_1.Sequelize({
                    database: process.env.DB_NAME,
                    dialect: 'mysql',
                    username: process.env.DB_USERNAME,
                    password: process.env.DB_PASSWORD,
                    host: process.env.DB_HOST,
                    port: parseInt(process.env.DB_PORT)
                });
                query = "\n        SELECT \n          c.ORDINAL_POSITION,\n          c.TABLE_SCHEMA,\n          c.TABLE_NAME,\n          c.COLUMN_NAME,\n          c.DATA_TYPE,\n          c.COLUMN_TYPE,\n          c.CHARACTER_MAXIMUM_LENGTH,\n          c.NUMERIC_PRECISION,\n          c.NUMERIC_SCALE,\n          c.DATETIME_PRECISION,                                             \n          c.IS_NULLABLE,\n          c.COLUMN_KEY,\n          c.EXTRA,\n          c.COLUMN_DEFAULT,\n          c.COLUMN_COMMENT,\n          t.TABLE_COMMENT                        \n        FROM information_schema.columns c\n        INNER JOIN information_schema.tables t\n        ON c.TABLE_SCHEMA = t.TABLE_SCHEMA AND c.TABLE_NAME = t.TABLE_NAME\n        WHERE c.TABLE_SCHEMA = '".concat(process.env.DB_NAME, "' AND c.TABLE_NAME = '").concat(realTableName, "' ORDER BY c.ORDINAL_POSITION;\n  ");
                return [4 /*yield*/, sequelize.query(query, {
                        type: sequelize_1.QueryTypes.SELECT,
                        raw: true
                    })];
            case 1:
                columns = _c.sent();
                columnsMetadata = [];
                for (_i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
                    column = columns_1[_i];
                    if (column.COLUMN_NAME === 'deleted_at') {
                        continue;
                    }
                    columnMetadata = {
                        name: column.COLUMN_NAME,
                        type: column.DATA_TYPE,
                        allowNull: column.IS_NULLABLE === 'YES',
                        primaryKey: column.COLUMN_KEY === 'PRI',
                        comment: column.COLUMN_COMMENT,
                        defaultValue: getDefaultValue(column.COLUMN_DEFAULT)
                    };
                    columnsMetadata.push(columnMetadata);
                }
                addDTOName = "Add".concat(dbModelName.slice(1), "DTO");
                updateDTOName = "Update".concat(dbModelName.slice(1), "DTO");
                getDTOName = "Get".concat(dbModelName.slice(1), "DTO");
                delDTOName = "Delete".concat(dbModelName.slice(1), "DTO");
                addDTOContent = "export class ".concat(addDTOName, " extends BaseDTO {}");
                updateDTOContent = "export class ".concat(updateDTOName, " extends BaseDTO {}");
                getDTOContent = "export class ".concat(getDTOName, " extends QueryDTO {}");
                delDTOContent = "export class ".concat(delDTOName, " extends BaseDTO {}");
                for (_a = 0, columnsMetadata_1 = columnsMetadata; _a < columnsMetadata_1.length; _a++) {
                    columnMetadata = columnsMetadata_1[_a];
                    name_1 = columnMetadata.name, type = columnMetadata.type, allowNull = columnMetadata.allowNull, primaryKey = columnMetadata.primaryKey, comment = columnMetadata.comment, defaultValue = columnMetadata.defaultValue;
                    dtoColumnType = (_b = DTODataTypesMap[type]) !== null && _b !== void 0 ? _b : 'string';
                    columnRequired = !allowNull && !defaultValue;
                    columnDTOContent = "\n      ".concat(getColumnValidator(name_1, comment, type, columnRequired), "\n      readonly ").concat(name_1).concat(columnRequired ? '' : '?').concat(defaultValue
                        ? "=".concat(defaultValue)
                        : ": ".concat(['int', 'decimal', 'float', 'double'].includes(dtoColumnType)
                            ? 'number'
                            : dtoColumnType), ";");
                    if (!primaryKey && !immutableColumnsDTO.includes(name_1)) {
                        addDTOContent = addDTOContent.replace(/}$/, "  ".concat(columnDTOContent, "\n}"));
                    }
                    updateDTOContent = updateDTOContent.replace(/}$/, "  ".concat(columnDTOContent, "\n}"));
                    getDTOContent = getDTOContent.replace(/}$/, "  ".concat(columnDTOContent, "\n}"));
                    if (primaryKey) {
                        delDTOContent = delDTOContent.replace(/}$/, "  ".concat(columnDTOContent, "\n}"));
                    }
                }
                return [4 /*yield*/, (0, fs_extra_1.ensureFile)(dtoFullPath)];
            case 2: return [4 /*yield*/, _c.sent()];
            case 3:
                _c.sent();
                dtoFileContent = fs.readFileSync(dtoFullPath, 'utf8');
                if (!dtoFileContent) {
                    dtoFileContent = "".concat(template_1.DTOTemplate);
                }
                dtoFileContent = "".concat(dtoFileContent, "\n                    ").concat(addDTOContent, " \n                    ").concat(updateDTOContent, "\n                    ").concat(getDTOContent, "\n                    ").concat(delDTOContent);
                fs.writeFileSync(dtoFullPath, dtoFileContent, 'utf8');
                return [2 /*return*/, { addDTOName: addDTOName, updateDTOName: updateDTOName, getDTOName: getDTOName, delDTOName: delDTOName }];
        }
    });
}); };
var createControlFun = function (_a) {
    var addDTOName = _a.addDTOName, updateDTOName = _a.updateDTOName, getDTOName = _a.getDTOName, delDTOName = _a.delDTOName, controllerFullPath = _a.controllerFullPath;
    return __awaiter(void 0, void 0, void 0, function () {
        var controllerFileContent, moduleName, regex_1, regex, addFun, updateFun, getFun, delFun;
        return __generator(this, function (_b) {
            if (!(0, fs_extra_1.pathExists)(controllerFullPath)) {
                throw new Error('controller file not exists');
            }
            controllerFileContent = fs.readFileSync(controllerFullPath, 'utf8');
            if (!controllerFileContent) {
                throw new Error('controller file is empty');
            }
            if (!controllerFileContent.includes('constructor')) {
                throw new Error('controller file is invalid');
            }
            moduleName = "".concat(controllerFullPath.split('/').pop().split('.')[0]);
            if (controllerFileContent.includes("".concat(moduleName, ".dto"))) {
                regex_1 = new RegExp("}(\\s*)from\\s*['\"].*".concat(moduleName, "\\.dto['\"]"));
                if (!controllerFileContent.includes(addDTOName)) {
                    controllerFileContent = controllerFileContent.replace(regex_1, ",".concat(addDTOName, " $&"));
                }
                if (!controllerFileContent.includes(updateDTOName)) {
                    controllerFileContent = controllerFileContent.replace(regex_1, ",".concat(updateDTOName, " $&"));
                }
                if (!controllerFileContent.includes(getDTOName)) {
                    controllerFileContent = controllerFileContent.replace(regex_1, ",".concat(getDTOName, " $&"));
                }
                if (!controllerFileContent.includes(delDTOName)) {
                    controllerFileContent = controllerFileContent.replace(regex_1, ",".concat(delDTOName, " $&"));
                }
            }
            else {
                controllerFileContent = "import {\n        ".concat(addDTOName, ", ").concat(updateDTOName, ", ").concat(getDTOName, ", ").concat(delDTOName, "\n      } from './").concat(moduleName, ".dto';\n\n").concat(controllerFileContent);
            }
            regex = /(\s*})(\s*)$/;
            if (!controllerFileContent.includes("async ".concat(addDTOName.replace('DTO', ''), "("))) {
                addFun = "\n    @ApiOperation({\n      summary: '".concat(addDTOName.replace('DTO', ''), "',\n      description: '").concat(addDTOName.replace('DTO', ''), "',\n    })\n    @ApiBody({\n      description: '\u8BF7\u6C42\u53C2\u6570',\n      type: ").concat(addDTOName, ",\n    })\n    @UsePipes(new ValidationPipe({ transform: true }))\n    @Post('").concat(convertToSnakeCase(addDTOName.replace('DTO', ''), '-'), "')\n    async ").concat(lowerCaseFirstLetter(addDTOName.replace('DTO', '')), "(\n      @Session() session,\n      @Body() body: ").concat(addDTOName, ",\n    ): Promise<any> {\n      const { user } = session;\n      const response = await this.").concat(moduleName, "Service.").concat(lowerCaseFirstLetter(addDTOName.replace('DTO', '')), "(body, user);\n      return response;\n    }");
                controllerFileContent = controllerFileContent.replace(regex, "\n\n".concat(addFun, "\n$1$2"));
            }
            if (!controllerFileContent.includes("async ".concat(updateDTOName.replace('DTO', ''), "("))) {
                updateFun = "\n    @ApiOperation({\n      summary: '".concat(updateDTOName.replace('DTO', ''), "',\n      description: '").concat(updateDTOName.replace('DTO', ''), "',\n    })\n    @ApiBody({\n      description: '\u8BF7\u6C42\u53C2\u6570',\n      type: ").concat(updateDTOName, ",\n    })\n    @UsePipes(new ValidationPipe({ transform: true }))\n    @Post('").concat(convertToSnakeCase(updateDTOName.replace('DTO', ''), '-'), "')\n    async ").concat(lowerCaseFirstLetter(updateDTOName.replace('DTO', '')), "(\n      @Session() session,\n      @Body() body: ").concat(updateDTOName, ",\n    ): Promise<any> {\n      const { user } = session;\n      const response = await this.").concat(moduleName, "Service.").concat(lowerCaseFirstLetter(updateDTOName.replace('DTO', '')), "(body, user);\n      return response;\n    }");
                controllerFileContent = controllerFileContent.replace(regex, "\n\n".concat(updateFun, "\n$1$2"));
            }
            if (!controllerFileContent.includes("async ".concat(getDTOName.replace('DTO', ''), "("))) {
                getFun = "\n    @ApiOperation({\n      summary: '".concat(getDTOName.replace('DTO', ''), "',\n      description: '").concat(getDTOName.replace('DTO', ''), "',\n    })\n    @ApiBody({\n      description: '\u8BF7\u6C42\u53C2\u6570',\n      type: ").concat(getDTOName, ",\n    })\n    @UsePipes(new ValidationPipe({ transform: true }))\n    @Post('").concat(convertToSnakeCase(getDTOName.replace('DTO', ''), '-'), "')\n    async ").concat(lowerCaseFirstLetter(getDTOName.replace('DTO', '')), "(\n      @Session() session,\n      @Body() body: ").concat(getDTOName, ",\n    ): Promise<any> {\n      const { user } = session;\n      const response = await this.").concat(moduleName, "Service.").concat(lowerCaseFirstLetter(getDTOName.replace('DTO', '')), "(body, user);\n      return response;\n    }");
                controllerFileContent = controllerFileContent.replace(regex, "\n\n".concat(getFun, "\n$1$2"));
            }
            if (!controllerFileContent.includes("async ".concat(delDTOName.replace('DTO', ''), "("))) {
                delFun = "\n    @ApiOperation({\n      summary: '".concat(delDTOName.replace('DTO', ''), "',\n      description: '").concat(delDTOName.replace('DTO', ''), "',\n    })\n    @ApiBody({\n      description: '\u8BF7\u6C42\u53C2\u6570',\n      type: ").concat(delDTOName, ",\n    })\n    @UsePipes(new ValidationPipe({ transform: true }))\n    @Post('").concat(convertToSnakeCase(delDTOName.replace('DTO', ''), '-'), "')\n    async ").concat(lowerCaseFirstLetter(delDTOName.replace('DTO', '')), "(\n      @Session() session,\n      @Body() body: ").concat(delDTOName, ",\n    ): Promise<any> {\n      const { user } = session;\n      const response = await this.").concat(moduleName, "Service.").concat(lowerCaseFirstLetter(delDTOName.replace('DTO', '')), "(body, user);\n      return response;\n    }");
                controllerFileContent = controllerFileContent.replace(regex, "\n\n".concat(delFun, "\n$1$2"));
            }
            fs.writeFileSync(controllerFullPath, controllerFileContent, 'utf8');
            return [2 /*return*/];
        });
    });
};
var createServiceFun = function (_a) {
    var dbModelName = _a.dbModelName, addDTOName = _a.addDTOName, updateDTOName = _a.updateDTOName, getDTOName = _a.getDTOName, delDTOName = _a.delDTOName, serviceFullPath = _a.serviceFullPath;
    return __awaiter(void 0, void 0, void 0, function () {
        var serivceFileContent, moduleName, regex_2, regex_3, regex, newArg, addFun, updateFun, getFun, getFun;
        return __generator(this, function (_b) {
            if (!(0, fs_extra_1.pathExists)(serviceFullPath)) {
                throw new Error('controller file not exists');
            }
            serivceFileContent = fs.readFileSync(serviceFullPath, 'utf8');
            if (!serivceFileContent) {
                throw new Error('serivce file is empty');
            }
            if (!serivceFileContent.includes('constructor')) {
                throw new Error('service file is invalid');
            }
            moduleName = "".concat(serviceFullPath.split('/').pop().split('.')[0]);
            if (serivceFileContent.includes("".concat(moduleName, ".dto"))) {
                regex_2 = new RegExp("}(\\s*)from\\s*['\"].*".concat(moduleName, "\\.dto['\"]"));
                if (!serivceFileContent.includes(addDTOName)) {
                    serivceFileContent = serivceFileContent.replace(regex_2, ",".concat(addDTOName, " $&"));
                }
                if (!serivceFileContent.includes(updateDTOName)) {
                    serivceFileContent = serivceFileContent.replace(regex_2, ",".concat(updateDTOName, " $&"));
                }
                if (!serivceFileContent.includes(getDTOName)) {
                    serivceFileContent = serivceFileContent.replace(regex_2, ",".concat(getDTOName, " $&"));
                }
                if (!serivceFileContent.includes(delDTOName)) {
                    serivceFileContent = serivceFileContent.replace(regex_2, ",".concat(delDTOName, " $&"));
                }
            }
            else {
                serivceFileContent = "import {\n        ".concat(addDTOName, ", ").concat(updateDTOName, ", ").concat(getDTOName, ", ").concat(delDTOName, "\n      } from './").concat(moduleName, ".dto';\n\n").concat(serivceFileContent);
            }
            if (serivceFileContent.includes("} from '@models/index")) {
                regex_3 = new RegExp("}(\\s*)from\\s*['\"].*@models/index['\"]");
                if (!serivceFileContent.includes(dbModelName)) {
                    serivceFileContent = serivceFileContent.replace(regex_3, ",".concat(dbModelName, " $&"));
                }
            }
            else {
                serivceFileContent = "import { ".concat(dbModelName, " } from '@models/index';\n\n").concat(serivceFileContent);
            }
            regex = /(constructor\s*\([\s\S]*?)\)(\s*{)/;
            if (!serivceFileContent.includes("@InjectModel(".concat(dbModelName, ")"))) {
                newArg = "@InjectModel(".concat(dbModelName, ")\n    private readonly ").concat(lowerCaseFirstLetter(dbModelName), ": typeof ").concat(dbModelName);
                serivceFileContent = serivceFileContent.replace(regex, "$1 ".concat(newArg, ")$2"));
            }
            regex = /(\s*})(\s*)$/;
            if (!serivceFileContent.includes("async ".concat(lowerCaseFirstLetter(addDTOName.replace('DTO', '')), "("))) {
                addFun = "\n    async ".concat(lowerCaseFirstLetter(addDTOName.replace('DTO', '')), "(requestBody: ").concat(addDTOName, ", user:any): Promise<any> {\n      const add_data = {...requestBody, created_by: user.customer_id ?? 1};\n      const attribute = await this.").concat(lowerCaseFirstLetter(dbModelName), ".create(add_data);\n        return { id: attribute.id };\n    }\n    ");
                serivceFileContent = serivceFileContent.replace(regex, "\n\n".concat(addFun, "\n$1$2"));
            }
            if (!serivceFileContent.includes("async ".concat(lowerCaseFirstLetter(updateDTOName.replace('DTO', '')), "("))) {
                updateFun = "\n    async ".concat(lowerCaseFirstLetter(updateDTOName.replace('DTO', '')), "(requestBody: ").concat(updateDTOName, ", user:any): Promise<any> {\n      const {id, ...otherRequestBody} = requestBody\n      const update_data = {...otherRequestBody, updated_by: user.customer_id ?? 1};\n      await this.").concat(lowerCaseFirstLetter(dbModelName), ".update(\n        update_data,\n        {\n          where: {\n            id,\n          },\n        });\n        return { id };\n      }\n    ");
                serivceFileContent = serivceFileContent.replace(regex, "\n\n".concat(updateFun, "\n$1$2"));
            }
            if (!serivceFileContent.includes("async ".concat(lowerCaseFirstLetter(getDTOName.replace('DTO', '')), "("))) {
                getFun = "\n    async ".concat(lowerCaseFirstLetter(getDTOName.replace('DTO', '')), "(requestBody: ").concat(getDTOName, ", user:any): Promise<any> {\n      const {attributes, ...otherRequestBody} = requestBody\n      const row = await this.").concat(lowerCaseFirstLetter(dbModelName), ".findOne({\n        attributes,\n        where: otherRequestBody,\n        raw: true,        \n      });\n      return row;  \n    }\n    ");
                serivceFileContent = serivceFileContent.replace(regex, "\n\n".concat(getFun, "\n$1$2"));
            }
            if (!serivceFileContent.includes("async ".concat(lowerCaseFirstLetter(delDTOName.replace('DTO', '')), "("))) {
                getFun = "\n    async ".concat(lowerCaseFirstLetter(delDTOName.replace('DTO', '')), "(requestBody: ").concat(delDTOName, ", user:any): Promise<any> {\n      const { id } = requestBody\n      const row = await this.").concat(lowerCaseFirstLetter(dbModelName), ".destroy({\n        where: { id },\n        deleted_by: user.customer_id ?? 1,\n      } as any);\n      return row;  \n    }\n    ");
                serivceFileContent = serivceFileContent.replace(regex, "\n\n".concat(getFun, "\n$1$2"));
            }
            fs.writeFileSync(serviceFullPath, serivceFileContent, 'utf8');
            return [2 /*return*/];
        });
    });
};
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var dbModels, dbModelNames, db_model_name, dbModel, dbModelName, dbModelFullPath, controllers, controllerNames, controller_name, module, controllerName, controllerFullPath, dtoFullPath, serviceFullPath, _a, addDTOName, updateDTOName, getDTOName, delDTOName, lnitEngine, report;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, readDbModels('../src/models')];
                case 1:
                    dbModels = _b.sent();
                    dbModelNames = dbModels.map(function (item) { return item.dbModelName; });
                    return [4 /*yield*/, Inquirer.prompt({
                            name: 'db_model_name',
                            type: 'list',
                            choices: dbModelNames,
                            message: 'Please choose a model'
                        })];
                case 2:
                    db_model_name = (_b.sent()).db_model_name;
                    dbModel = dbModels.find(function (item) { return item.dbModelName === db_model_name; });
                    dbModelName = dbModel.dbModelName, dbModelFullPath = dbModel.dbModelFullPath;
                    return [4 /*yield*/, readController('../src/modules')];
                case 3:
                    controllers = _b.sent();
                    controllerNames = controllers.map(function (item) { return item.controllerName; });
                    return [4 /*yield*/, Inquirer.prompt({
                            name: 'controller_name',
                            type: 'list',
                            choices: controllerNames,
                            message: 'Please choose a controller, create an interface in the controller of your choiced '
                        })];
                case 4:
                    controller_name = (_b.sent()).controller_name;
                    module = controllers.find(function (item) { return item.controllerName === controller_name; });
                    controllerName = module.controllerName, controllerFullPath = module.controllerFullPath;
                    dtoFullPath = controllerFullPath.replace('.controller.ts', '.dto.ts');
                    serviceFullPath = controllerFullPath.replace('.controller.ts', '.service.ts');
                    return [4 /*yield*/, createDTO(dbModelName, dtoFullPath)];
                case 5:
                    _a = _b.sent(), addDTOName = _a.addDTOName, updateDTOName = _a.updateDTOName, getDTOName = _a.getDTOName, delDTOName = _a.delDTOName;
                    return [4 /*yield*/, createControlFun({
                            addDTOName: addDTOName,
                            updateDTOName: updateDTOName,
                            getDTOName: getDTOName,
                            delDTOName: delDTOName,
                            controllerFullPath: controllerFullPath
                        })];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, createServiceFun({
                            dbModelName: dbModelName,
                            addDTOName: addDTOName,
                            updateDTOName: updateDTOName,
                            getDTOName: getDTOName,
                            delDTOName: delDTOName,
                            serviceFullPath: serviceFullPath
                        })];
                case 7:
                    _b.sent();
                    lnitEngine = new lint.ESLint({
                        baseConfig: eslintDefaultConfig,
                        fix: true
                    });
                    return [4 /*yield*/, lnitEngine.lintFiles([
                            dtoFullPath,
                            controllerFullPath,
                            serviceFullPath,
                        ])];
                case 8:
                    report = _b.sent();
                    return [4 /*yield*/, lint.ESLint.outputFixes(report)];
                case 9:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.run = run;
