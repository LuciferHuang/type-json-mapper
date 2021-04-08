"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transType = void 0;
var utils_1 = require("./utils");
/**
 * @param {any} oriData - 目标数据
 * @param {TYPE_NAME} typeName - 转换类型
 * @return {any}
*/
function transType(oriData, typeName) {
    if (utils_1.isNotBasicType(oriData)) {
        return oriData;
    }
    var value = null;
    try {
        switch (typeName) {
            case 'string':
                value = "" + oriData;
                break;
            case 'int':
                value = parseInt(oriData, 10);
                if (value !== value) {
                    // NaN
                    throw new Error('int类型转换失败');
                }
                break;
            case 'float':
                value = parseFloat(oriData);
                if (value !== value) {
                    // NaN
                    throw new Error('float类型转换失败');
                }
                break;
            case 'boolean':
                value = Boolean(oriData);
                break;
            case 'date':
                value = utils_1.formatDate(oriData, 'Y-M-D');
                break;
            case 'time':
                value = utils_1.formatDate(oriData, 'h:m:s');
                break;
            case 'datetime':
                value = utils_1.formatDate(oriData);
                break;
            default:
                value = oriData;
                break;
        }
    }
    catch (error) {
        value = oriData;
    }
    return value;
}
exports.transType = transType;
