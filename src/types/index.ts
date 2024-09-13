/**
 * 支持转换的类型
 */
export type TYPE_NAME = 'string' | 'int' | 'float' | 'boolean' | 'date' | 'time' | 'datetime';

export interface GenericObject {
  [key: string]: any;
}

export interface MetadataObject {
  key: string;
  type: TYPE_NAME | undefined;
}

export interface MetadataDeepObject {
  key: string;
  Clazz: any;
}
export interface MetadataFilterObject<T = any> {
  key: string;
  filter: TFilterFunc<T>;
}

export interface FieldLengthOption {
  [field: string]: number
}

export interface MockOptions {
  fieldLength?: FieldLengthOption
  arrayFields?: string[]
}

export type TFilterFunc<T> = (val: any, row: T) => any;
