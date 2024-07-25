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
        while (_) try {
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
/*
 * @Author: leyi leyi@myun.info
 * @Date: 2022-09-07 09:17:35
 * @LastEditors: leyi leyi@myun.info
 * @LastEditTime: 2023-02-08 17:30:14
 * @FilePath: /itam-api/sequelize-generator/index.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
var easy_front_sequelize_generator_1 = require("easy-front-sequelize-generator");
var path_1 = require("path");
var dotenv = require("dotenv");
dotenv.config({ path: (0, path_1.resolve)(__dirname, '../src/.env') });
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var config, dialect, builder, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                config = {
                    connection: {
                        dialect: 'mysql',
                        host: process.env.DB_HOST,
                        port: parseInt(process.env.DB_PORT),
                        database: process.env.DB_NAME,
                        username: process.env.DB_USERNAME,
                        password: process.env.DB_PASSWORD
                    },
                    metadata: {
                        indices: true,
                        "case": {
                            model: 'PASCAL',
                            column: 'LOWER'
                        },
                        tables: ['t_welfare_card']
                    },
                    output: {
                        clean: true,
                        outDir: (0, path_1.resolve)(__dirname, '../temp/models')
                    },
                    strict: false
                };
                dialect = new easy_front_sequelize_generator_1.DialectMySQL();
                builder = new easy_front_sequelize_generator_1.ModelBuilder(config, dialect);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, builder.build()];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.error(err_1);
                process.exit(1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); })();
