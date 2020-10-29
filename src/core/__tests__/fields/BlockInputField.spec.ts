import { BlockInputField } from '../../fields/BlockInputField'
import { FieldTypes } from '../../fields/const'
import { Block } from '../../../core'

describe('BlockInputField', () => {
  let field: BlockInputField

  beforeEach(() => {
    field = new BlockInputField('test', 'xxx')
  })

  it('new', () => {
    expect(field.value()).toEqual('xxx')
    expect(field.type).toEqual(FieldTypes.input)
  })

  it('inputType', () => {
    field = new BlockInputField('test', 'xxx', { inputType: 'number' })

    expect(field.value()).toEqual('')

    field.value('123')

    expect(field.value()).toEqual('123')

    field.value('22x')

    expect(field.value()).toEqual('22')

    field.value('.22x')

    expect(field.value()).toEqual('0.22')
  })

  it('clone', () => {
    const newField = field.clone()

    expect(newField).not.toBe(field)
    expect(newField.getOptions()).toEqual(field.getOptions())

    const b = new Block({ previous: false, next: false, output: ['boolean'] })
    newField.block.update(b)

    const newField2 = newField.clone()

    expect(newField2).not.toBe(newField)
    expect(newField2.getOptions()).toEqual(newField.getOptions())
    expect(newField2.block.value).not.toBe(newField.block.value)
  })
})
