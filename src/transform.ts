import { TYPE_NAME } from './types';
import { formatDate, isNotBasicType } from './utils';

/**
 * 类型转换
 * @param oriData - 目标数据
 * @param {TYPE_NAME} typeName - 转换类型
 * @return
 */
export function transType<T>(oriData, typeName?: TYPE_NAME) {
  if (isNotBasicType(oriData)) {
    return oriData;
  }
  let value = null;
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
  }
  return value as T;
}
