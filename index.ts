import 'reflect-metadata';
import { GenericObject, MetadataObject, MetadataDeepObject } from './libs/config';
import { transType } from './libs/transform';
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
 * 反序列化
*/
export function deserialize<T extends GenericObject>(Clazz: { new(): T }, json: GenericObject) {

  if (hasAnyNullOrUndefined(Clazz, json)) {
    throw new Error('(type-json-mapper)deserialize：missing Clazz or json');
  }
  
  if (!isObject(json)) {
    throw new Error('(type-json-mapper)deserialize：json is not a object');
  }

  let instance: GenericObject = new Clazz();

  Object.keys(instance).forEach(key => {

    let value = json[key];
    const metaObj = getJsonProperty(instance, key);
    if (metaObj) {
      const {typeName, localKey} = metaObj;
      const jsonVal = json[localKey];
      if (typeof jsonVal !== 'undefined') {
        value = transType(jsonVal, typeName);
      }

      if (isObject(value)) {
        const {Clazz: childClazz} = metaObj;
        value = deserialize(childClazz, value);
      }

      if (isArray(value)) {
        const {Clazz: childClazz} = metaObj;
        value = deserializeArr(childClazz, value);
      }
    }
    instance[key] = value;
  });
  return instance as T;
}

/**
 * 数组反序列化
*/
export function deserializeArr(Clazz: { new(): GenericObject }, list: GenericObject[]) {

  if (hasAnyNullOrUndefined(Clazz, list)) {
    throw new Error('(type-json-mapper)deserializeArr：missing Clazz or list');
  }
  
  if (!isArray(list)) {
    throw new Error('(type-json-mapper)deserializeArr：list is not a array');
  }

  return list.map((ele: GenericObject) => deserialize(Clazz, ele));
}
