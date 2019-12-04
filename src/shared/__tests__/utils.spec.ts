import { uid, getId, removeArrayItem } from '../utils'

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
})
