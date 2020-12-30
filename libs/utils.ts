import { META_KEY } from "./config";
import { BASIC_TYPE } from "./types";

/**
 * @param {any} target object
 * @param {string} propertyKey
 * @return {any}
 */
export function getJsonProperty(target: any, propertyKey: string): any {
  return Reflect.getMetadata(META_KEY, target, propertyKey);
}

/**
 * @param {any} value
 * @return {(target:Object, targetKey:string | symbol)=> void} decorator function
 */
export function setProperty(value: any): (target: Object, targetKey: string | symbol)=> void {
  return Reflect.metadata(META_KEY, value);
}

/**
 * @param {any} target object
 * @return {Boolean}
 */
export function isObject(target: any): boolean {
  return Object.prototype.toString.call(target) === '[object Object]';
}

/**
 * @param {any} target
 * @return {Boolean}
 */
export function isArray(target: any): boolean {
  return Object.prototype.toString.call(target) === '[object Array]';
}

/**
 * @param {...args:any[]} any arguments
 * @return {Boolean}
 */
export function hasAnyNullOrUndefined(...args: any[]): boolean {
  return args.some((arg: any) => arg === null || arg === undefined);
}

/**
 * @param {any} target
 * @return {Boolean}
 */
export function isNotBasicType(target: any): boolean {
  return BASIC_TYPE.every(type => type !== typeof target);
}

/**
 * @param {any} timestamp
 * @param {string} format
 * @return {string} 
 */
export function formatDate(timestamp: any, format: string = 'Y-M-D h:m:s'): string {
  let date = new Date(timestamp);
  if (isInvalidDate(date)) {
    return timestamp;
  }
  let dateInfo = {
    Y: `${date.getFullYear()}`,
    M: `${date.getMonth() + 1}`,
    D: `${date.getDate()}`,
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds(),
  }
  let formatNumber = (n: number) => n >= 10 ? `${n}` : `0${n}`;
  let res = format
    .replace('Y', dateInfo.Y)
    .replace('M', dateInfo.M)
    .replace('D', dateInfo.D)
    .replace('h', formatNumber(dateInfo.h))
    .replace('m', formatNumber(dateInfo.m))
    .replace('s', formatNumber(dateInfo.s))
  return res
}

/**
 * @param {any} date
 * @return {boolean} 
 */
function isInvalidDate(date: any): boolean {
  return date instanceof Date && isNaN(date.getTime());
}