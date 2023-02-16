/**
 * 支持转换的类型
 */
export type TYPE_NAME = 'string' | 'int' | 'float' | 'boolean' | 'date' | 'time' | 'datetime';

export interface GenericObject {
  [key: string]: any;
}

export interface MetadataObject {
  localKey: string;
  typeName: TYPE_NAME | undefined;
}

export interface MetadataDeepObject {
  localKey: string;
  Clazz: any;
}
export interface MetadataFilterObject {
  localKey: string;
  filter: Function;
}

export interface FieldLengthOption {
  [field: string]: number
}

export interface MockOptions {
  fieldLength?: FieldLengthOption
  arrayFields?: string[]
}