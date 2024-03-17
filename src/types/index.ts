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
export interface MetadataFilterObject {
  key: string;
  filter: Function;
}

export interface FieldLengthOption {
  [field: string]: number
}

export interface MockOptions {
  fieldLength?: FieldLengthOption
  arrayFields?: string[]
}
