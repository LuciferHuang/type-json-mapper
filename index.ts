import 'reflect-metadata';
import { transType } from './libs/transform';
import { GenericObject, MetadataObject, MetadataDeepObject } from './libs/config';
import { TYPE_NAME } from './libs/types';
import { getJsonProperty, hasAnyNullOrUndefined, isArray, isObject, setProperty } from './libs/utils';

/**
 * 属性装饰器
 * @param {string} value - 键名
 * @param {TYPE_NAME} typeName - 转换类型
 * @return {(target:Object, targetKey:string | symbol)=> void} decorator function
*/
export function mapperProperty(value: string, typeName?: TYPE_NAME): (target: Object, targetKey: string | symbol)=> void {
  const metadata: MetadataObject = {
    typeName,
    localKey: value
  };
  return setProperty(metadata);
}
/**
 * 深层属性装饰器
 * @param {string} value - 键名
 * @param {any} Clazz
 * @return {(target:Object, targetKey:string | symbol)=> void} decorator function
*/
export function deepMapperProperty(value: string, Clazz: any): (target: Object, targetKey: string | symbol)=> void  {
  const metadata: MetadataDeepObject = {
    localKey: value,
    Clazz
  };
  return setProperty(metadata);
}

/**
 * 序列化
*/
export function serialize<T extends GenericObject>(Clazz: { new(): T }, json: GenericObject, ignore: boolean = true) {
  if (hasAnyNullOrUndefined(Clazz, json)) {
    throw new Error('(type-json-mapper)serialize：missing Clazz or json');
  }
  
  if (!isObject(json)) {
    throw new Error('(type-json-mapper)serialize：json is not a object');
  }

  const result = {};

  let instance: GenericObject = new Clazz();

  const keys = Object.keys(instance);

  for (const key of keys) {
    let value = json[key];
    // ignore
    if (ignore && typeof value === 'undefined') {
      continue;
    }
    let localKey = key;
    const metaObj = getJsonProperty(instance, key);
    if (!metaObj) {
      continue
    }
    const {typeName, localKey: interfaceKey} = metaObj;
    if (interfaceKey !== undefined) {
      localKey = interfaceKey;
    }
    if (typeof value !== 'undefined') {
      value = transType(value, typeName);
    }

    if (isObject(value)) {
      const {Clazz: childClazz} = metaObj;
      value = serialize(childClazz, value);
    }
    if (isArray(value)) {
      const {Clazz: childClazz} = metaObj;
      value = serializeArr(childClazz, value);
    }
    result[localKey] = value;
  }
  return result as T;
}

/**
 * 数组序列化
*/
export function serializeArr(Clazz: { new(): GenericObject }, list: GenericObject[], ignore: boolean = true) {

  if (hasAnyNullOrUndefined(Clazz, list)) {
    throw new Error('(type-json-mapper)serializeArr：missing Clazz or list');
  }
  
  if (!isArray(list)) {
    throw new Error('(type-json-mapper)serializeArr：list is not a array');
  }

  return list.map((ele: GenericObject) => serialize(Clazz, ele, ignore));
}

/**
 * 反序列化
*/
export function deserialize<T extends GenericObject>(Clazz: { new(): T }, json: GenericObject, ignore: boolean = true) {

  if (hasAnyNullOrUndefined(Clazz, json)) {
    throw new Error('(type-json-mapper)deserialize：missing Clazz or json');
  }
  
  if (!isObject(json)) {
    throw new Error('(type-json-mapper)deserialize：json is not a object');
  }

  let result = {};

  let instance: GenericObject = new Clazz();

  const keys = Object.keys(instance);

  result = instance;

  for (const key of keys) {
    const metaObj = getJsonProperty(instance, key);
    if (!metaObj) {
      continue;
    }
    const {typeName, localKey} = metaObj;
    let value = json[localKey];
    // ignore
    if (ignore && typeof value === 'undefined') {
      continue;
    }

    if (typeof value !== 'undefined') {
      value = transType(value, typeName);
    }

    if (isObject(value)) {
      const {Clazz: childClazz} = metaObj;
      value = deserialize(childClazz, value);
    }

    if (isArray(value)) {
      const {Clazz: childClazz} = metaObj;
      value = deserializeArr(childClazz, value);
    }
    result[key] = value;
  }
  return result as T;
}

/**
 * 数组反序列化
*/
export function deserializeArr(Clazz: { new(): GenericObject }, list: GenericObject[], ignore: boolean = true) {

  if (hasAnyNullOrUndefined(Clazz, list)) {
    throw new Error('(type-json-mapper)deserializeArr：missing Clazz or list');
  }
  
  if (!isArray(list)) {
    throw new Error('(type-json-mapper)deserializeArr：list is not a array');
  }

  return list.map((ele: GenericObject) => deserialize(Clazz, ele, ignore));
}
