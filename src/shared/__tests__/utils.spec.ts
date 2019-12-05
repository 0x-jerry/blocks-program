import { uid, getId, removeArrayItem, oneOf, toArray } from '../utils'

describe('utils', () => {
  it('uid', () => {
    expect(uid(4)).toHaveLength(4)

    expect(uid()).toHaveLength(8)

    expect(uid(13)).toHaveLength(13)
  })

  it('getId', () => {
    const id = '123'
    const obj = {
      id
    }

    expect(getId(id)).toBe(id)
    expect(getId(obj)).toBe(id)
  })

  it('removeArray', () => {
    const arr = [1, 2, 3]

    let removed = removeArrayItem(arr, (n) => n === 1)
    expect(removed).toBe(1)
    expect(arr).toEqual([2, 3])

    removed = removeArrayItem(arr, 2)
    expect(arr).toEqual([3])
    expect(removed).toBe(2)

    removed = removeArrayItem(arr, (n) => n === 5)
    expect(removed).toBe(null)
    expect(arr).toEqual([3])
  })

  it('oneOf', () => {
    let arr1 = [1, 2, 3]
    let arr2 = [4, 5, 6]

    expect(oneOf(arr1, arr2)).toBe(false)

    arr1 = [1, 2, 3]
    arr2 = [5, 1, 6]

    expect(oneOf(arr1, arr2)).toBe(true)
  })

  it('toArray', () => {
    expect(toArray(1)).toEqual([1])

    expect(toArray([12, 1])).toEqual([12, 1])
  })
})
