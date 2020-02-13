import { Block } from '../Block'
import { BlockTextField, BlockSlotField } from '@/fields'
import { BlockField } from '../BlockField'

describe('Block', () => {
  it('connectTo', () => {
    const a = new Block()
    const b = new Block()

    a.previous.update(b)

    expect(b.next.value).toBe(a)
    expect(b.previous.value).toBeNull()
    expect(b.isRoot).toBe(true)

    expect(a.next.value).toBeNull()
    expect(a.previous.value).toBe(b)
    expect(a.isRoot).toBe(false)

    a.previous.update(null)

    expect(b.next.value).toBeNull()
    expect(b.previous.value).toBeNull()
    expect(b.isRoot).toBe(true)

    expect(a.next.value).toBeNull()
    expect(a.previous.value).toBeNull()
    expect(a.isRoot).toBe(true)
  })

  it('connectToField', () => {
    const a = new Block()
    const f1 = new BlockTextField('')

    a.connectToField(f1)
    expect(a.parent.value).toBe(null)
    expect(f1.block.value).toBe(null)

    const f2 = new BlockSlotField('')
    a.connectToField(f2)
    expect(a.parent.value).toBe(f2)
    expect(f2.block.value).toBe(a)

    a.connectToField(null)
    expect(a.parent.value).toBe(null)
    expect(f2.block.value).toBe(null)
  })

  it('getField', () => {
    const a = new Block()
    const b = new BlockField('arg', '')

    a.pushField(b)

    expect(a.getField('arg')).toBe(b)

    expect(a.getField(b.id)).toBe(b)

    expect(a.getField('')).toBeNull()
  })

  it('pushField', () => {
    const block = new Block()
    const field = new BlockField('test', '')
    block.pushField(field)

    expect(field.$b).toBe(block)
    expect(block.fields).toEqual([field])


    const field1 = new BlockField('test', '')

    const spyWarn = jest.spyOn(global.console, 'warn')
    spyWarn.mockReset()

    block.pushField(field1)
    expect(field1.$b).toBe(block)
    expect(block.getFieldsByRow(0)).toEqual([field, field1])

    expect(spyWarn).toBeCalledTimes(1)
    spyWarn.mockRestore()
  })

  it('destroy', () => {
    const a = new Block()
    const b = new Block()

    a.previous.update(b)

    a.destroy()

    expect(b.previous.value).toBeNull()
    expect(b.next.value).toBeNull()
    expect(b.isRoot).toBe(true)

    expect(a.previous.value).toBeNull()
    expect(a.next.value).toBeNull()
    expect(a.isRoot).toBe(true)
  })

  it('clone', () => {
    const b = new Block({ previous: false })
    const field = new BlockField('test', 123)
    b.pushField(field)

    const clone = b.clone()

    expect(clone).not.toBe(b)
    expect(clone.options).toEqual(b.options)
    expect(clone.fields.length).toEqual(b.fields.length)

    clone.fields.forEach((field, idx) => {
      const bField = b.fields[idx]
      expect(field.name).toEqual(bField.name)
      expect(field.value()).toEqual(bField.value())
      expect(field.type).toEqual(bField.type)
    })
  })
})
