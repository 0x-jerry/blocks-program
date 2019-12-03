export function uid(len = 8) {
  return Math.random().toString(16).substr(0, len)
}
