export const REG_DEFAULT = /^.*$/;
export const REG_USER_NAME = /^[\u4E00-\u9FA5a-zA-Z0-9_-]{4,16}$/;

/** Phone reg */
export const REG_PHONE = /^(0|\+84)([35789]|[12][0-9]|[3][2-9]|[5][2689]|[7][06-9]|[8][1-9]|[9][0-9])[0-9]{8}$/;

/**
 * Password reg
 *
 * At least 6 characters
 */
export const REG_PWD = /^.{6,}$/;

/** Email reg */
export const REG_EMAIL = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

/** Six digit code reg */
export const REG_CODE_SIX = /^\d{6}$/;

/** Four digit code reg */
export const REG_CODE_FOUR = /^\d{4}$/;

/** Url reg */
export const REG_URL =
  /(((^https?:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??[-+=&;%@.\w_]*#?\w*)?)$/;
