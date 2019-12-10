import { uid, getId, oneOf, toArray, SArray } from '../utils'

describe('utils', () => {
  it('uid', () => {
    expect(uid(4)).toHaveLength(4)

    expect(uid()).toHaveLength(8)

    expect(uid(12)).toHaveLength(12)
  })

  it('getId', () => {
    const id = '123'
    const obj = {
      id
    }

    expect(getId(id)).toBe(id)
    expect(getId(obj)).toBe(id)
  })

  it('SArray', () => {
    const arr = new SArray(1, 2, 3)

    let removed = arr.remove((n) => n === 1)
    expect(removed).toBe(1)
    expect(arr).toEqual([2, 3])

    removed = arr.remove(2)
    expect(arr).toEqual([3])
    expect(removed).toBe(2)

    removed = arr.remove((n) => n === 5)
    expect(removed).toBe(null)
    expect(arr).toEqual([3])

    let has = arr.pushDistinct(3)
    expect(has).toBe(true)
    expect(arr).toEqual([3])

    has = arr.pushDistinct(2)
    expect(has).toBe(false)
    expect(arr).toEqual([3, 2])
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
