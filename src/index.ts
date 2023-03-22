import { mockByType, transType } from './lib/transform';
import { GenericObject, MetadataObject, MetadataDeepObject, MetadataFilterObject, MockOptions } from './types';
import { TYPE_NAME } from './types';
import { getJsonProperty, getRandomInt, hasAnyNullOrUndefined, isArray, isObject, setProperty } from './lib/utils';

const TAG = '[type-json-mapper';

/**
 * 属性装饰器
 * @param {string} value - 键名
 * @param {TYPE_NAME} typeName - 转换类型
 * @return {(target:Object, targetKey:string | symbol)=> void} decorator function
 */
export function mapperProperty(value: string, typeName?: TYPE_NAME): (target: Object, targetKey: string | symbol) => void {
  const metadata: MetadataObject = {
    typeName,
    localKey: value
  };
  return setProperty(metadata);
}
/**
 * 深层属性装饰器
 * @param {string} value - 键名
 * @param Clazz
 * @return {(target:Object, targetKey:string | symbol)=> void} decorator function
 */
export function deepMapperProperty(value: string, Clazz): (target: Object, targetKey: string | symbol) => void {
  const metadata: MetadataDeepObject = {
    localKey: value,
    Clazz
  };
  return setProperty(metadata);
}

/**
 * 自定义属性装饰器
 * @param {string} value - 键名
 * @param {Function} filter
 * @return {(target:Object, targetKey:string | symbol)=> void} decorator function
 */
export function filterMapperProperty(value: string, filter: Function): (target: Object, targetKey: string | symbol) => void {
  const metadata: MetadataFilterObject = {
    localKey: value,
    filter
  };
  return setProperty(metadata);
}

/**
 * 反序列化
 */
export function deserialize<T extends GenericObject>(Clazz: { new (): T }, json: GenericObject) {
  if (hasAnyNullOrUndefined(Clazz, json)) {
    throw new Error(`${TAG}/deserialize]: missing Clazz or json`);
  }

  if (!isObject(json)) {
    throw new Error(`${TAG}/deserialize]: json is not a object`);
  }

  let result = {};

  const instance: GenericObject = new Clazz();

  const keys = Object.keys(instance);

  result = instance;

  for (const key of keys) {
    let value = json[key];
    let metaObj: GenericObject = {};

    metaObj = getJsonProperty(instance, key);
    if (typeof metaObj === 'undefined') {
      metaObj = {};
    }

    const { typeName, localKey } = metaObj;
    if (!['', 0, undefined].includes(localKey)) {
      value = json[localKey];
      if (typeof value !== 'undefined') {
        value = transType(value, typeName);
      }
    }

    const { filter } = metaObj;
    if (typeof filter === 'function') {
      const tempVal = filter(value);
      if (typeof tempVal !== 'undefined') {
        value = tempVal;
      }
    }

    const { Clazz: childClazz } = metaObj;
    if (typeof childClazz !== 'undefined') {
      if (isObject(value)) {
        value = deserialize(childClazz, value);
      }

      if (isArray(value)) {
        value = deserializeArr(childClazz, value);
      }
    }

    result[key] = value;
  }
  return result as T;
}

/**
 * 数组反序列化
 */
export function deserializeArr(Clazz: { new (): GenericObject }, list: GenericObject[]) {
  if (hasAnyNullOrUndefined(Clazz, list)) {
    throw new Error(`${TAG}/deserializeArr]: missing Clazz or list`);
  }

  return list.map((ele: GenericObject) => deserialize(Clazz, ele));
}

export function mock<T extends GenericObject>(Clazz: { new (): T }, options?: MockOptions) {
  let result = {};

  const instance: GenericObject = new Clazz();

  const keys = Object.keys(instance);

  result = instance;

  for (const key of keys) {
    const { fieldLength = {}, arrayFields = [] } = options;

    let value: any = '';
    let metaObj: GenericObject = {};

    metaObj = getJsonProperty(instance, key);
    if (typeof metaObj === 'undefined') {
      metaObj = {};
    }

    const { typeName } = metaObj;

    if (typeName) {
      const length = fieldLength[key] || 6;
      value = mockByType(typeName, length);
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
