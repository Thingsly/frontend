/**
 * Get the corresponding Chinese character for a number
 *
 * @param num - Number (0-10)
 */
export function getHanByNumber(num: number) {
  const HAN_STR = '零一二三四五六七八九十';
  return HAN_STR.charAt(num);
}

/**
 * Converts total seconds into a countdown format (MM:SS)
 *
 * @param seconds - Seconds
 */
export function transformToTimeCountDown(seconds: number) {
  const SECONDS_A_MINUTE = 60;
  function fillZero(num: number) {
    return num.toString().padStart(2, '0');
  }
  const minuteNum = Math.floor(seconds / SECONDS_A_MINUTE);
  const minute = fillZero(minuteNum);
  const second = fillZero(seconds - minuteNum * SECONDS_A_MINUTE);
  return `${minute}: ${second}`;
}

/**
 * Get a random integer within a specified range
 *
 * @param start - Start of the range
 * @param end - End of the range
 */
export function getRandomInteger(end: number, start = 0) {
  const range = end - start;
  const random = Math.floor(Math.random() * range + start);
  return random;
}
