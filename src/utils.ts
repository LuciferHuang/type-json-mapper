import 'reflect-metadata';

/**
 * Reflect key
 */
export const META_KEY = 'TransKey';

/**
 * 获取对象meta值
 * @param target
 * @param {string} propertyKey
 * @return
 */
export const getJsonProperty = (target, propertyKey: string) =>
  typeof Reflect.getMetadata === 'function' ? Reflect.getMetadata(META_KEY, target, propertyKey) : undefined;

/**
 * 设置对象meta值
 * @param value
 * @return {(target:Object, targetKey:string | symbol)=> void} decorator function
 */
export const setProperty = (value: any): ((target: Object, targetKey: string | symbol) => void) =>
  typeof Reflect.metadata === 'function' && Reflect.metadata(META_KEY, value);

/**
 * 判断目标变量是否是对象
 * @param target
 * @return {Boolean}
 */
export const isObject = (target): boolean => Object.prototype.toString.call(target) === '[object Object]';

/**
 * 判断目标变量是否是数组
 * @param target
 * @return {Boolean}
 */
export const isArray = (target: any): boolean => Object.prototype.toString.call(target) === '[object Array]';

/**
 * @param {...args:any[]} any arguments
 * @return {Boolean}
 */
export const hasAnyNullOrUndefined = (...args: any[]): boolean => args.some((arg: any) => arg === null || arg === undefined);

/**
 * @param target
 * @return {Boolean}
 */
export const isNotBasicType = (target): boolean => ['string', 'number', 'boolean'].every((type) => type !== typeof target);

/**
 * 判断是否为Date对象
 * @param date
 * @return {boolean}
 */
export const isInvalidDate = (date: any): boolean => date instanceof Date && isNaN(date.getTime());

/**
 * 格式化日期时间
 * @param timestamp
 * @param {string} format
 * @return {string}
 */
export function formatDate(timestamp: string | number | Date, format = 'Y-M-D h:m:s') {
  const date = new Date(timestamp);
  if (isInvalidDate(date)) {
    return timestamp;
  }
  const dateInfo = {
    Y: `${date.getFullYear()}`,
    M: `${date.getMonth() + 1}`,
    D: `${date.getDate()}`,
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  };
  const formatNumber = (n: number) => (n >= 10 ? `${n}` : `0${n}`);
  return format
    .replace('Y', dateInfo.Y)
    .replace('M', dateInfo.M)
    .replace('D', dateInfo.D)
    .replace('h', formatNumber(dateInfo.h))
    .replace('m', formatNumber(dateInfo.m))
    .replace('s', formatNumber(dateInfo.s));
}
