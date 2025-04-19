import JSEncrypt from 'jsencrypt';
import { STATIC_BASE_URL } from '@/constants/common';
import { $t } from '@/locales';
import { createServiceConfig } from '~/env.config';
import { rsaPublicKey } from '~/rsa.js';

export function typeOf(obj: any): any {
  const toString: any = Object.prototype.toString;
  const map: any = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  };
  return map[toString.call(obj)];
}
/**
 * get static source url
 *
 * @param url source url
 * @param showError is show error message
 * @returns static source url
 */
export const getStaticUrl = (url: string, showError: boolean = true): string => {
  if (!url) {
    if (showError) window.NMessage.error($t('card.resourceNotExist'));
    return '';
  }
  return url.replace('.', STATIC_BASE_URL);
};

export const getBaseServerUrl = (): string => {
  const { baseURL } = createServiceConfig(import.meta.env);
  return baseURL || `${window.location.origin}/api/v1`;
};

export const getDemoServerUrl = (): string => {
  const { otherBaseURL } = createServiceConfig(import.meta.env);
  return otherBaseURL.demo ? otherBaseURL.demo : `${window.location.origin}/api/v1`;
};

/**
 * get web socket server url
 *
 * @returns web socket server url
 */
export const getWebsocketServerUrl = (): string => {
  const demoUrl = getDemoServerUrl();
  if (window.location.protocol === 'https:') {
    return demoUrl.replace(window.location.protocol, 'wss:');
  }
  return demoUrl.replace(window.location.protocol, 'ws:');
};

export function deepClone(data: any): any {
  const type = typeOf(data);
  let reData: any;
  if (type === 'array') {
    reData = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < data.length; i++) {
      reData.push(deepClone(data[i]));
    }
  } else if (type === 'object') {
    reData = {};
    // eslint-disable-next-line guard-for-in
    for (const i in data) {
      reData[i] = deepClone(data[i]);
    }
  } else {
    return data;
  }
  return reData;
}

export function generateUUID(): string {
  let d = new Date().getTime();
  const uuidFormat: string = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  return uuidFormat.replace(/[xy]/g, c => {
    const r = (d + Math.random() * 16) % 16 || 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r && 0x3) || 0x8).toString(16);
  });
}

export function getFileName(url: string): string {
  const regex = /[^/]*$/;
  const matches = url.match(regex);
  return matches ? matches[0] : 'unknown.file';
}

export function isJSON(str: string): boolean {
  if (typeof str === 'string') {
    try {
      const obj = JSON.parse(str);
      if (typeof obj === 'object' && obj) {
        return obj;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  return false;
}

export function validPassword(str: string): boolean {
  if (str.length < 8) {
    return false;
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}/.test(str)) {
    return false;
  }
  return true;
}

function getRandomBytes(length) {
  return window.crypto.getRandomValues(new Uint8Array(length));
}

function randomBytesToHex(bytes) {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function generateRandomHexString(length) {
  const bytes = getRandomBytes(length);
  const hexString = randomBytesToHex(bytes);
  return hexString;
}

export function encryptDataByRsa(data): string {
  const pubKey = rsaPublicKey;
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(pubKey);
  try {
    return encrypt.encrypt(data) || '';
  } catch (e) {
    return '';
  }
}

// RSA 私钥解密
export function decryptDataByRsa(data): string {
  //   const priKey = `-----BEGIN PRIVATE KEY-----
  // MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDMVrz5Q0Cv0UFx
  // Mwu8euQm7djTt+IJorsm3arkv9F27EEhFQ4uC7kHEM9vOGxzW4eIQFxwLb3G7HYj
  // z9YIcXQILIf2cMSgmKkWmvsZ/ayS4vTfYBEhlWKUJkIn09KneUGHtXNXmnkfdFGQ
  // uL9HqYHswQMP9zUIJfrd7navdIf73OR+tG2UHlNd58LToWtqTrDYTz3rjfPRi4Yi
  // sOxELBHHjqW4HimE+C5OS1YnyflRGGh6ngegdXjeBCvwZYIa8/h4RyInyrRNKTFt
  // +kPe7p10QwNaNJJWrh3wL0ypUJiHNSDrATIBFgA7LvdA+FbQqm7S9LqVe4s9zsih
  // zDtNO8AdAgMBAAECggEABBslF87VEgNe24cL+r5ZxHoojn6Q2qKMEgidGmohVntX
  // sVy9M3SAWWbqKCu71X3sGrM3uE2u/9GOFoOiuHo2e5iQ0IVXv3tkgG6zp4Qhr4pD
  // Iz7zW9em4ApnGhTx/slbZVOigkrkGVtKwqFNFK6lt0vHQ47zNZtKb825fFFCOe/J
  // 5InWeF0t21IZlKHQ+bU5vUqRRHds1u0jSNjLLVdgPyr8kKhnChabbakuCBDo5yNz
  // bFY5Tt+vJaem2V7WeUpx4sov75Bya3ujMrGM1yMwvRVkUq1a70jUQiCbdjIUfVkR
  // a9lmOIcbc4YjzY78ypOZYMTdQ2xibGntjP3VrvsBCQKBgQD8oYEhmyuFbwVY4H8X
  // 8AjSIryLVHes0qXuYi+jZ0gksitSJyCUoopaqpfp6cvmXy1Oqhe1/2zH/6SkleL5
  // 868suWQ0B/02dFmti0ENH9loVE2j1T03cSplYhYWH0RCSPZSo2S7Gl5bKSW053Xa
  // e1PmacOoRujKIGu+RoQ3AOU2VQKBgQDPEFyvSNTTLopfcJYlwg/vnkRk7GNogkM7
  // tasn0na5gxwyq2sNMxswpzo+8wRAhVh72KkemRTea593mnYe9ibPCYDMcf034P8S
  // 8Ye3yYaH1aibGpDjUUEiAXsfFp5zzhGvwoTZJh+A64+aPeG8Ok5ks1aM/okQf7ry
  // ErKXZI1aqQKBgGb0Gn/rkKzsNa2mr6S9uZqJdXUCk1Lm9aBUez2IVao+wdDVCT4J
  // j4CrjQVStjnIB9rLDqao1VgcIqjAPKPIX1dGpkNeDh8nA3TqDzSeCieuU4W03SG/
  // CJwQgRe63kJ1IY1D8UUe1d0ow6kZurmzENoRuB7X5v6Yf9AnRLJ1tvORAoGAIOZb
  // o6oxzqAtcj6kTLmJ6Ku/+D0rClbwMdOKr1gcbxtq5o4gA0fkgRWBBrF8Mng9d+gT
  // 7v2puDFndAyByieYQPskkNdnwXIpdSwVQVlu27RSBtrwvH2TmMCdfHIOmR3b545D
  // p3EMPmKvPXWpoUuuWwe3r81dn9Z7sKzR3YYng4kCgYEA4Qr/UwxjkrUWnyRpZ1KO
  // grz4jr/x35UzEua7sq5uezw3Egaa4rUuBJiAIXBGH6/kn1PrqDLiPN+c/y3p+okL
  // WI/Mjg/HvXBo9nLQO9wgI1qXfc1VpGhotP0RStldRW8FSoePGX8IQSUKwbg0ZKWy
  // CRrvYaq09Mp+T4AIzE4hJjI=
  // -----END PRIVATE KEY-----`;
  const priKey = '';

  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(priKey);

  return encrypt.decrypt(data) || '';
}

export function validUsername(str) {
  if (!/^[a-zA-Z0-9_]+$/.test(str)) {
    return false;
  }
  return true;
}

export function validName(str) {
  if (!str || str?.length > 50) {
    return false;
  }
  return true;
}

export function validPasswordByExp(str) {
  if (!str || str.length < 6) {
    return false;
  }

  if (!/[a-z]/.test(str)) {
    return false;
  }

  return true;
}
