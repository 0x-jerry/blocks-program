import { BlockFieldManager } from '../BlockFieldsManager'
import { BlockTextField } from '@/fields'
import { toBeTheSameIds } from '@/jest.setup'

describe('BlockFieldsManager', () => {
  let manager: BlockFieldManager

  beforeEach(() => {
    manager = new BlockFieldManager()
  })

  it('get row', () => {
    const a = new BlockTextField()
    const b = new BlockTextField()

    manager.add(a)
    manager.add(b)

    toBeTheSameIds(manager.getRow(0), [a, b])
  })

  it('get row count', () => {
    const a = new BlockTextField()
    const b = new BlockTextField()

    manager.add(a)
    manager.add(b, 1)

    expect(manager.getRowCount(0)).toBe(1)
    expect(manager.getRowCount(1)).toBe(1)
  })

  it('add', () => {
    const a = new BlockTextField()
    const b = new BlockTextField()

    manager.add(a)
    manager.add(b)

    toBeTheSameIds(manager.fields, [a, b])
    toBeTheSameIds(manager.getRow(0), [a, b])

    expect(manager.getRowCount(0)).toBe(2)
  })

  it('add row', () => {
    const a = new BlockTextField()
    const b = new BlockTextField()

    manager.add(a)
    manager.add(b, 1)

    toBeTheSameIds(manager.fields, [a, b])
    toBeTheSameIds(manager.getRow(0), [a])
    toBeTheSameIds(manager.getRow(1), [b])

    expect(manager.getRowCount(0)).toBe(1)
    expect(manager.getRowCount(1)).toBe(1)
  })

  it('remove', () => {
    const a = new BlockTextField()
    const b = new BlockTextField()

    manager.add(a)
    manager.add(b)
    manager.remove(b)

    toBeTheSameIds(manager.fields, [a])
    toBeTheSameIds(manager.getRow(0), [a])

    expect(manager.getRowCount(0)).toBe(1)
  })

  it('remove row', () => {
    const a = new BlockTextField()
    const b = new BlockTextField()
    const c = new BlockTextField()

    manager.add(a)
    manager.add(b, 1)
    manager.add(c, 1)

    manager.remove(c)

    toBeTheSameIds(manager.fields, [a, b])
    toBeTheSameIds(manager.getRow(0), [a])
    toBeTheSameIds(manager.getRow(1), [b])

    expect(manager.getRowCount(0)).toBe(1)
    expect(manager.getRowCount(1)).toBe(1)
  })
})
