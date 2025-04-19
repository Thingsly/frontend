import dayjs from 'dayjs';

/**
 * Formats the timestamp into a string in the format of YYYY-MM-DD HH:mm:ss (24-hour format)
 *
 * @param {string | null | undefined} ts - Timestamp
 * @returns {string | null} - Formatted time string
 */
export function formatDateTime(ts: string | null | undefined): string | null {
  return ts ? dayjs(ts).format('YYYY-MM-DD HH:mm:ss') : null;
}
