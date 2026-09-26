import type { createCacheTypes } from "./uploadTypes.js";

export function createCache(): createCacheTypes {
  return {
    agent: new Map(),
    category: new Map(),
    carrier: new Map(),
  };
}

export function createDedup(value: (string | unknown)[]): string[] {
  return [...new Set(value.filter((e): e is string => Boolean(e)))];
}

export function userKey(firstName: string, dob: string | Date, email: string) {
  return `${firstName}|${new Date(dob).toISOString()}|${email}`;
}
