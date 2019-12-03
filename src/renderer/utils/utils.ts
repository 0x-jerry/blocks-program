export function parsePixelOrNumber(numerical: any): number {
  if (typeof numerical !== 'string') {
    console.warn(numerical, 'may not a numerical')
    return NaN
  }

  const numberReg = /^[\d\.]+(px)?$/

  if (numerical.match(numberReg)) {
    return parseFloat(numerical)
  }

  console.warn(numerical, 'may not a numerical')
  return NaN
}

export const uuid = {
  _prefix: 'blockly-',
  _uid: 0,
  next() {
    return uuid._prefix + uuid._uid++
  }
}
