import { TYPE_NAME } from "../libs/types";
import { formatDate, isNotBasicType } from "./utils";

/**
 * @param {any} oriData - 目标数据
 * @param {TYPE_NAME} typeName - 转换类型
 * @return {any}
*/
export function transType<T>(oriData: any, typeName?: TYPE_NAME): any {
  if (isNotBasicType(oriData)) {
    return oriData;
  }
  let value: any = null;
  try {
    switch (typeName) {
      case 'string':
        value = `${oriData}`;
        break;
      case 'int':
        value = parseInt(oriData, 10);
        if (value !== value) {
          // NaN
          throw new Error('int类型转换失败');
        }
        break;
      case 'flot':
        value = parseFloat(oriData);
        if (value !== value) {
          // NaN
          throw new Error('flot类型转换失败');
        }
        break;
      case 'boolean':
        value = Boolean(oriData);
        break;
      case 'date':
        value = formatDate(oriData, 'Y-M-D');
        break;
      case 'time':
        value = formatDate(oriData, 'h:m:s');
        break;
      case 'datetime':
        value = formatDate(oriData);
        break;
      default:
        value = oriData;
        break;
    }
  } catch (error) {
    value = oriData;
    console.error(`${oriData}类型转换失败：${error}`);
  }
  return value as T;
}