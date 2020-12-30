"use strict";
exports.__esModule = true;
exports.deserializeArr = exports.deserialize = exports.deepMapperProperty = exports.mapperProperty = void 0;
require("reflect-metadata");
var transform_1 = require("./libs/transform");
var utils_1 = require("./libs/utils");
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
 * 反序列化
*/
function deserialize(Clazz, json) {
    if (utils_1.hasAnyNullOrUndefined(Clazz, json)) {
        throw new Error('(type-json-mapper)deserialize：missing Clazz or json');
    }
    if (!utils_1.isObject(json)) {
        throw new Error('(type-json-mapper)deserialize：json is not a object');
    }
    var instance = new Clazz();
    Object.keys(instance).forEach(function (key) {
        var value = json[key];
        var metaObj = utils_1.getJsonProperty(instance, key);
        if (metaObj) {
            var typeName = metaObj.typeName, localKey = metaObj.localKey;
            var jsonVal = json[localKey];
            if (typeof jsonVal !== 'undefined') {
                value = transform_1.transType(jsonVal, typeName);
            }
            if (utils_1.isObject(value)) {
                var childClazz = metaObj.Clazz;
                value = deserialize(childClazz, value);
            }
            if (utils_1.isArray(value)) {
                var childClazz = metaObj.Clazz;
                value = deserializeArr(childClazz, value);
            }
        }
        instance[key] = value;
    });
    return instance;
}
exports.deserialize = deserialize;
/**
 * 数组反序列化
*/
function deserializeArr(Clazz, list) {
    if (utils_1.hasAnyNullOrUndefined(Clazz, list)) {
        throw new Error('(type-json-mapper)deserializeArr：missing Clazz or list');
    }
    if (!utils_1.isArray(list)) {
        throw new Error('(type-json-mapper)deserializeArr：list is not a array');
    }
    return list.map(function (ele) { return deserialize(Clazz, ele); });
}
exports.deserializeArr = deserializeArr;
