//import { serialize, deserialize, Value } from './';
import { Buffer } from 'buffer';

export type Value =
  | null
  | string
  | number
  | boolean
  | undefined
  | Date
  | Buffer
  | Set<unknown>
  | Map<unknown, unknown>
  | Value[]
  | { [key: string]: Value };

function isPlainObject(value: any): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    value.constructor === Object
  );
}

export function serialize(value: any): any {
  if (value === undefined) return undefined;
  if (value === null || typeof value !== 'object') return value;

  if (value instanceof Date) {
    return { __t: 'Date', __v: value.getTime() };
  }

  if (Buffer.isBuffer(value)) {
    return { __t: 'Buffer', __v: Array.from(value) };
  }

  if (value instanceof Set) {
    return { __t: 'Set', __v: Array.from(value).map(serialize) };
  }

  if (value instanceof Map) {
    return {
      __t: 'Map',
      __v: Array.from(value.entries()).map(([k, v]) => [serialize(k), serialize(v)]),
    };
  }

  if (Array.isArray(value)) {
    return value.map(serialize);
  }

  if (isPlainObject(value)) {
    const result: Record<string, any> = {};
    for (const key in value) {
      result[key] = serialize(value[key]);
    }
    return result;
  }

  return value; 
}

export function deserialize(value: any): any {
  if (value === undefined || value === null || typeof value !== 'object') {
    return value;
  }

  if ('__t' in value && '__v' in value) {
    switch (value.__t) {
      case 'Date':
        return new Date(value.__v);
      case 'Buffer':
        return Buffer.from(value.__v);
      case 'Set':
        return new Set(value.__v.map(deserialize));
      case 'Map':
        return new Map(value.__v.map(([k, v]: [any, any]) => [deserialize(k), deserialize(v)]));
      default:
        return value; 
    }
  }

  if (Array.isArray(value)) {
    return value.map(deserialize);
  }

  if (isPlainObject(value)) {
    const result: Record<string, any> = {};
    for (const key in value) {
      result[key] = deserialize(value[key]);
    }
    return result;
  }

  return value;
}
