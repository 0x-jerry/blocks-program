/**
 * 
 * @param len Max is 13, default is 8
 */
export function uid(len = 8) {
  return Math.random().toString(16).substr(2, len)
}
