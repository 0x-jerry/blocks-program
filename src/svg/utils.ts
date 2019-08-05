export function parseNumber(numerical: string): number {
  const numberReg = /^[\d\.]+(px)?$/

  if (numerical.match(numberReg)) {
    return parseFloat(numerical)
  }

  console.warn(numerical, 'may not a numerical')
  return NaN
}
