import { TYPE_NAME } from "./types";

/**
* Reflect storage key
*/
export const META_KEY = 'TransKey';

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
