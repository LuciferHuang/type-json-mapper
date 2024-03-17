import 'reflect-metadata';
import { MetadataDeepObject, MetadataFilterObject, MetadataObject } from '../types';

/**
 * Reflect key
 */
export const META_KEY = '__TRANSKEY__';

/**
 * 获取对象meta值
 * @param target
 * @param propertyKey
 * @return
 */
export const getJsonProperty = (target, propertyKey: string) =>
  typeof Reflect.getMetadata === 'function' && Reflect.getMetadata(META_KEY, target, propertyKey);

/**
 * 设置对象meta值
 * @param value
 * @return
 */
export const setProperty = (value: MetadataObject | MetadataDeepObject | MetadataFilterObject) =>
  typeof Reflect.metadata === 'function' && Reflect.metadata(META_KEY, value)

/**
 * 判断目标变量是否是对象
 * @param target
 * @return
 */
export const isObject = (target: any) => Object.prototype.toString.call(target) === '[object Object]';

/**
 * 判断目标变量是否是数组
 * @param target
 * @return
 */
export const isArray = (target: any) => Object.prototype.toString.call(target) === '[object Array]';

export const hasAnyNullOrUndefined = (...args: any[]) => args.some((arg: any) => arg === null || arg === undefined);

export const isNotBasicType = (target) => ['string', 'number', 'boolean'].every((type) => type !== typeof target);

/**
 * 判断是否为Date对象
 * @param date
 * @return
 */
export const isInvalidDate = (date: any): boolean => date instanceof Date && isNaN(date.getTime());

/**
 * 格式化日期时间
 * @param timestamp
 * @param format
 * @return
 */
export const formatDate = (timestamp: string | number | Date, format = 'Y-M-D h:m:s') => {
  const date = new Date(timestamp);
  if (isInvalidDate(date)) {
    return timestamp;
  }
  const formatNumber = (n: number) => (n >= 10 ? `${n}` : `0${n}`);
  return format
    .replace('Y', `${date.getFullYear()}`)
    .replace('M', formatNumber(date.getMonth() + 1))
    .replace('D', formatNumber(date.getDate()))
    .replace('h', formatNumber(date.getHours()))
    .replace('m', formatNumber(date.getMinutes()))
    .replace('s', formatNumber(date.getSeconds()));
};

/**
 * 获取随机整数
 * @param min 最小值
 * @param max 最大值
 * @returns
 */
export const getRandomInt = (min: number, max: number) => {
  if (!min || !max) {
    return 0;
  }
  const range = max - min;
  const rand = Math.random();
  return min + Math.round(rand * range);
};

/**
 * 获取随机字符串
 * @param length 字符串长度
 * @param chars 字符集
 * @returns
 */
export const getRandomString = (length: number, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890') =>
  !length ? '' : new Array(length).fill(0).reduce((res) => `${res}${chars.charAt(Math.floor(Math.random() * chars.length))}`, '');

/**
 * 获取随机小数
 * @param length 字符长度
 * @returns
 */
export const getRandomFloat = (length: number) => {
  if (!length) {
    return 0;
  }
  const decimal = getRandomInt(1, length - 2);
  const numStr = getRandomString(length, '123456789');
  const floatStr = parseFloat(numStr.split('').reduce((res, char, index) => `${res}${length - index === decimal ? '.' : ''}${char}`, ''));
  return floatStr;
};
