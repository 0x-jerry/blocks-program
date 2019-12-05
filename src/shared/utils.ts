/**
 *
 * @param len Max is 12, default is 8
 */
export function uid(len = 8) {
  return Math.random()
    .toString(16)
    .substr(2, len)
}

export function getId<T extends { id: string }>(instanceOrId: T | string) {
  return typeof instanceOrId === 'string' ? instanceOrId : instanceOrId.id
}

export function removeArrayItem<T = any>(arr: T[], predicate: ((o: T) => boolean) | T): T | null {
  const idx = typeof predicate === 'function' ? arr.findIndex(predicate as (o: T) => boolean) : arr.indexOf(predicate)

  return idx >= 0 ? arr.splice(idx, 1)[0] : null
}

export function warn(...args: any[]) {
  console.warn(...args)
  console.trace()
}

/**
 * Check whether have at least one item of intersection
 * @param arr1
 * @param arr2
 */
export function oneOf<T>(arr1: T[], arr2: T[]): boolean {
  for (const item of arr1) {
    if (arr2.indexOf(item) >= 0) {
      return true
    }
  }

  return false
}

export function toArray<T>(t: T | T[]): T[] {
  return Array.isArray(t) ? t : [t]
}
