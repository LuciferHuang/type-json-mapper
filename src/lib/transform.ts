import { TYPE_NAME } from '../types';
import { formatDate, getRandomFloat, getRandomInt, getRandomString, isNotBasicType } from './utils';

/**
 * 类型转换
 * @param oriData  目标数据
 * @param {TYPE_NAME} typeName  转换类型
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

/**
 * 根据类型获取随机数据
 * @param {TYPE_NAME} typeName 转换类型
 * @param {number} length  字符长度
 * @return
 */
export function mockByType<T>(typeName: TYPE_NAME, length: number) {
  let value: any = '';
  switch (typeName) {
    case 'string':
      value = getRandomString(length);
      break;
    case 'int':
      value = getRandomInt(1, length);
      break;
    case 'float':
      value = getRandomFloat(length);
      break;
    case 'boolean':
      value = Math.random() <= 0.5;
      break;
    case 'date':
      value = formatDate(new Date(), 'Y-M-D');
      break;
    case 'time':
      value = formatDate(new Date(), 'h:m:s');
      break;
    case 'datetime':
      value = formatDate(new Date());
      break;
    default:
      value = '';
      break;
  }
  return value as T;
}
