export function parseNumber(numerical: string): number {
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

let uuid = 0
export function uid() {
  return `blockly-` + uuid++
}
