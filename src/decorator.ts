import { TYPE_NAME, TFilterFunc } from './types';
import { setProperty } from './lib/utils';

/**
 * 属性装饰器
 * @param {string} key - 键名
 * @param {TYPE_NAME} type - 转换类型
 */
export const mapperProperty = (key: string, type?: TYPE_NAME) =>
  setProperty({
    key,
    type
  });
/**
 * 深层属性装饰器
 * @param {string} key - 键名
 * @param Clazz
 */
export const deepMapperProperty = (key: string, Clazz) =>
  setProperty({
    key,
    Clazz
  });

/**
 * 自定义属性装饰器
 * @param {string} key - 键名
 * @param {TFilterFunc} filter
 */
export const filterMapperProperty = <T = any>(key: string, filter: TFilterFunc<T>) =>
  setProperty({
    key,
    filter
  });
