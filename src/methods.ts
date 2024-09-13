import { mockByType, transType } from './lib/transform';
import { GenericObject, MetadataObject, MetadataDeepObject, MetadataFilterObject, MockOptions } from './types';
import { getJsonProperty, getRandomInt, hasAnyNullOrUndefined, isArray, isObject } from './lib/utils';

const TAG = '[type-json-mapper';

/**
 * 反序列化
 */
export const deserialize = <T extends GenericObject>(Clazz: { new (): T }, json: GenericObject) => {
  if (hasAnyNullOrUndefined(Clazz, json)) {
    throw new Error(`${TAG}/deserialize]: missing Clazz or json`);
  }

  if (!isObject(json)) {
    throw new Error(`${TAG}/deserialize]: json is not a object`);
  }

  const instance: GenericObject = new Clazz();
  const result = instance;

  for (const localKey of Object.keys(instance)) {
    let value = json[localKey];
    const metaObj = getJsonProperty(instance, localKey) || {};

    const { type, key } = metaObj as MetadataObject;
    if (!['', 0, undefined].includes(key)) {
      value = json[key];
      if (typeof value !== 'undefined') {
        value = transType(value, type);
      }
    }

    const { filter } = metaObj as MetadataFilterObject;
    if (typeof filter === 'function') {
      const tempVal = filter(value, json);
      if (typeof tempVal !== 'undefined') {
        value = tempVal;
      }
    }

    const { Clazz: childClazz } = metaObj as MetadataDeepObject;
    if (typeof childClazz !== 'undefined') {
      if (isObject(value)) {
        value = deserialize(childClazz, value);
      }

      if (isArray(value)) {
        value = deserializeArr(childClazz, value);
      }
    }

    if (typeof value !== 'undefined') {
      result[localKey] = value;
    }
  }
  return result as T;
};

/**
 * 数组反序列化
 */
export const deserializeArr = <T extends GenericObject>(Clazz: { new (): T }, list: GenericObject[]) => {
  if (hasAnyNullOrUndefined(Clazz, list)) {
    throw new Error(`${TAG}/deserializeArr]: missing Clazz or list`);
  }

  return list.map((ele: GenericObject) => deserialize<T>(Clazz, ele));
}

/**
 * 序列化
 */
export const serialize = (Clazz: { new (): GenericObject }, json: GenericObject) => {
  if (hasAnyNullOrUndefined(Clazz, json)) {
    throw new Error(`${TAG}/serialize]: missing Clazz or json`);
  }

  if (!isObject(json)) {
    throw new Error(`${TAG}/serialize]: json is not a object`);
  }

  const result = {};

  const instance: GenericObject = new Clazz();

  for (const localKey of Object.keys(instance)) {
    let value = json[localKey];

    if (typeof value === 'undefined') {
      continue;
    }

    const metaObj = getJsonProperty(instance, localKey) || {}

    const { Clazz: childClazz } = metaObj as MetadataDeepObject;
    if (typeof childClazz !== 'undefined') {
      if (isObject(value)) {
        value = serialize(childClazz, value);
      }

      if (isArray(value)) {
        value = serializeArr(childClazz, value);
      }
    }

    const { key } = metaObj as MetadataObject;
    result[key ? key : localKey] = value;
  }

  return result;
}

/**
 * 数组序列化
 */
export const serializeArr = (Clazz: { new (): GenericObject }, list: GenericObject[]) => {
  if (hasAnyNullOrUndefined(Clazz, list)) {
    throw new Error(`${TAG}/serializeArr]: missing Clazz or list`);
  }

  return list.map((ele: GenericObject) => serialize(Clazz, ele));
}

export function mock<T extends GenericObject>(Clazz: { new (): T }, options?: MockOptions) {
  if (hasAnyNullOrUndefined(Clazz)) {
    throw new Error(`${TAG}/mock]: missing Clazz`);
  }

  if(!options || typeof options !== 'object') {
    options = {};
  }

  const instance: GenericObject = new Clazz();

  const result = instance;

  for (const key of Object.keys(instance)) {
    const { fieldLength = {}, arrayFields = [] } = options;

    let value: any = '';
    const metaObj = getJsonProperty(instance, key) || {};

    const { type } = metaObj;

    if (type) {
      const length = fieldLength[key] || 6;
      value = mockByType(type, length);
    }

    const { filter } = metaObj;
    if (typeof filter === 'function') {
      const tempVal = filter();
      if (typeof tempVal !== 'undefined') {
        value = tempVal;
      }
    }

    const { Clazz: childClazz } = metaObj;
    if (typeof childClazz !== 'undefined') {
      if (arrayFields.includes(key)) {
        value = new Array(getRandomInt(1, 18)).fill(0).map(() => mock(childClazz, options));
      } else {
        value = mock(childClazz, options);
      }
    }

    result[key] = value;
  }
  return result as T;
}
