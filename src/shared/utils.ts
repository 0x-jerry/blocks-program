/**
 *
 * @param len Max is 13, default is 8
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
