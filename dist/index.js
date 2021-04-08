"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeArr = exports.deserialize = exports.serializeArr = exports.serialize = exports.filterMapperProperty = exports.deepMapperProperty = exports.mapperProperty = void 0;
require("reflect-metadata");
var transform_1 = require("./src/transform");
var utils_1 = require("./src/utils");
/**
 * 属性装饰器
 * @param {string} value - 键名
 * @param {TYPE_NAME} typeName - 转换类型
 * @return {(target:Object, targetKey:string | symbol)=> void} decorator function
*/
function mapperProperty(value, typeName) {
    var metadata = {
        typeName: typeName,
        localKey: value
    };
    return utils_1.setProperty(metadata);
}
exports.mapperProperty = mapperProperty;
/**
 * 深层属性装饰器
 * @param {string} value - 键名
 * @param {any} Clazz
 * @return {(target:Object, targetKey:string | symbol)=> void} decorator function
*/
function deepMapperProperty(value, Clazz) {
    var metadata = {
        localKey: value,
        Clazz: Clazz
    };
    return utils_1.setProperty(metadata);
}
exports.deepMapperProperty = deepMapperProperty;
/**
 * 自定义属性装饰器
 * @param {string} value - 键名
 * @param {Function} filter
 * @return {(target:Object, targetKey:string | symbol)=> void} decorator function
*/
function filterMapperProperty(value, filter) {
    var metadata = {
        localKey: value,
        filter: filter
    };
    return utils_1.setProperty(metadata);
}
exports.filterMapperProperty = filterMapperProperty;
/**
 * 序列化
*/
function serialize(Clazz, json, ignore) {
    if (ignore === void 0) { ignore = true; }
    if (utils_1.hasAnyNullOrUndefined(Clazz, json)) {
        throw new Error('(type-json-mapper)serialize：missing Clazz or json');
    }
    if (!utils_1.isObject(json)) {
        throw new Error('(type-json-mapper)serialize：json is not a object');
    }
    var result = {};
    var instance = new Clazz();
    var keys = Object.keys(instance);
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        var value = json[key];
        // ignore
        if (ignore && typeof value === 'undefined') {
            continue;
        }
        var localKey = key;
        var metaObj = utils_1.getJsonProperty(instance, key);
        if (!metaObj) {
            continue;
        }
        var typeName = metaObj.typeName, interfaceKey = metaObj.localKey;
        if (typeof interfaceKey !== 'undefined') {
            localKey = interfaceKey;
        }
        if (typeof value !== 'undefined') {
            value = transform_1.transType(value, typeName);
        }
        var filter = metaObj.filter;
        if (typeof filter === 'function') {
            var tempVal = filter(value);
            if (typeof tempVal !== 'undefined') {
                value = tempVal;
            }
        }
        var childClazz = metaObj.Clazz;
        if (typeof childClazz !== 'undefined') {
            if (utils_1.isObject(value)) {
                value = serialize(childClazz, value);
            }
            if (utils_1.isArray(value)) {
                value = serializeArr(childClazz, value);
            }
        }
        result[localKey] = value;
    }
    return result;
}
exports.serialize = serialize;
/**
 * 数组序列化
*/
function serializeArr(Clazz, list, ignore) {
    if (ignore === void 0) { ignore = true; }
    if (utils_1.hasAnyNullOrUndefined(Clazz, list)) {
        throw new Error('(type-json-mapper)serializeArr：missing Clazz or list');
    }
    if (!utils_1.isArray(list)) {
        throw new Error('(type-json-mapper)serializeArr：list is not a array');
    }
    return list.map(function (ele) { return serialize(Clazz, ele, ignore); });
}
exports.serializeArr = serializeArr;
/**
 * 反序列化
*/
function deserialize(Clazz, json, ignore) {
    if (ignore === void 0) { ignore = true; }
    if (utils_1.hasAnyNullOrUndefined(Clazz, json)) {
        throw new Error('(type-json-mapper)deserialize：missing Clazz or json');
    }
    if (!utils_1.isObject(json)) {
        throw new Error('(type-json-mapper)deserialize：json is not a object');
    }
    var result = {};
    var instance = new Clazz();
    var keys = Object.keys(instance);
    result = instance;
    for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
        var key = keys_2[_i];
        var metaObj = utils_1.getJsonProperty(instance, key);
        if (!metaObj) {
            continue;
        }
        var typeName = metaObj.typeName, localKey = metaObj.localKey;
        var value = json[localKey];
        // ignore
        if (ignore && typeof value === 'undefined') {
            continue;
        }
        if (typeof value !== 'undefined') {
            value = transform_1.transType(value, typeName);
        }
        var filter = metaObj.filter;
        if (typeof filter === 'function') {
            var tempVal = filter(value);
            if (typeof tempVal !== 'undefined') {
                value = tempVal;
            }
        }
        var childClazz = metaObj.Clazz;
        if (typeof childClazz !== 'undefined') {
            if (utils_1.isObject(value)) {
                value = deserialize(childClazz, value);
            }
            if (utils_1.isArray(value)) {
                value = deserializeArr(childClazz, value);
            }
        }
        result[key] = value;
    }
    return result;
}
exports.deserialize = deserialize;
/**
 * 数组反序列化
*/
function deserializeArr(Clazz, list, ignore) {
    if (ignore === void 0) { ignore = true; }
    if (utils_1.hasAnyNullOrUndefined(Clazz, list)) {
        throw new Error('(type-json-mapper)deserializeArr：missing Clazz or list');
    }
    if (!utils_1.isArray(list)) {
        throw new Error('(type-json-mapper)deserializeArr：list is not a array');
    }
    return list.map(function (ele) { return deserialize(Clazz, ele, ignore); });
}
exports.deserializeArr = deserializeArr;
