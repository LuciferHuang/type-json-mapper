"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = exports.isNotBasicType = exports.hasAnyNullOrUndefined = exports.isArray = exports.isObject = exports.setProperty = exports.getJsonProperty = void 0;
var config_1 = require("../libs/config");
var types_1 = require("../libs/types");
/**
 * @param {any} target object
 * @param {string} propertyKey
 * @return {any}
 */
function getJsonProperty(target, propertyKey) {
    return Reflect.getMetadata(config_1.META_KEY, target, propertyKey);
}
exports.getJsonProperty = getJsonProperty;
/**
 * @param {any} value
 * @return {(target:Object, targetKey:string | symbol)=> void} decorator function
 */
function setProperty(value) {
    return Reflect.metadata(config_1.META_KEY, value);
}
exports.setProperty = setProperty;
/**
 * @param {any} target object
 * @return {Boolean}
 */
function isObject(target) {
    return Object.prototype.toString.call(target) === '[object Object]';
}
exports.isObject = isObject;
/**
 * @param {any} target
 * @return {Boolean}
 */
function isArray(target) {
    return Object.prototype.toString.call(target) === '[object Array]';
}
exports.isArray = isArray;
/**
 * @param {...args:any[]} any arguments
 * @return {Boolean}
 */
function hasAnyNullOrUndefined() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return args.some(function (arg) { return arg === null || arg === undefined; });
}
exports.hasAnyNullOrUndefined = hasAnyNullOrUndefined;
/**
 * @param {any} target
 * @return {Boolean}
 */
function isNotBasicType(target) {
    return types_1.BASIC_TYPE.every(function (type) { return type !== typeof target; });
}
exports.isNotBasicType = isNotBasicType;
/**
 * @param {any} timestamp
 * @param {string} format
 * @return {string}
 */
function formatDate(timestamp, format) {
    if (format === void 0) { format = 'Y-M-D h:m:s'; }
    var date = new Date(timestamp);
    if (isInvalidDate(date)) {
        return timestamp;
    }
    var dateInfo = {
        Y: "" + date.getFullYear(),
        M: "" + (date.getMonth() + 1),
        D: "" + date.getDate(),
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds(),
    };
    var formatNumber = function (n) { return n >= 10 ? "" + n : "0" + n; };
    var res = format
        .replace('Y', dateInfo.Y)
        .replace('M', dateInfo.M)
        .replace('D', dateInfo.D)
        .replace('h', formatNumber(dateInfo.h))
        .replace('m', formatNumber(dateInfo.m))
        .replace('s', formatNumber(dateInfo.s));
    return res;
}
exports.formatDate = formatDate;
/**
 * @param {any} date
 * @return {boolean}
 */
function isInvalidDate(date) {
    return date instanceof Date && isNaN(date.getTime());
}
