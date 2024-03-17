import { TYPE_NAME } from '../types';
import { formatDate, getRandomFloat, getRandomInt, getRandomString, isNotBasicType } from './utils';

/**
 * 类型转换
 * @param oriData  目标数据
 * @param type  转换类型
 * @return
 */
export const transType = (oriData: any, type?: TYPE_NAME) => {
  if (Array.isArray(oriData) && oriData.every((val) => !isNotBasicType(val))) {
    return transArrayType(oriData, type);
  }
  if (isNotBasicType(oriData)) {
    return oriData;
  }
  let value = null;
  try {
    switch (type) {
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
  return value;
}

/**
 * 转换数组元素类型
 * @param oriData 
 * @param type 
 */
export const transArrayType = (oriData: Array<string | number>, type?: TYPE_NAME) => oriData.map(val => transType(val, type))

/**
 * 根据类型获取随机数据
 * @param type 转换类型
 * @param length  字符长度
 */
export const mockByType = (type: TYPE_NAME, length: number) => {
  let value: any = '';
  switch (type) {
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
  return value;
}
