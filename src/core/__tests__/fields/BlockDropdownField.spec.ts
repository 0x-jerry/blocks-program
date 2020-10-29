import { BlockDropdownField } from '../../fields/BlockDropdownField'
import { FieldTypes } from '../../fields/const'
import { Block } from '../../../core'

describe('BlockDropdownField', () => {
  let field: BlockDropdownField
  const options = [['1'], ['2', '21']]

  beforeEach(() => {
    field = new BlockDropdownField('test', '', { options })
  })

  it('new', () => {
    expect(field.type).toEqual(FieldTypes.dropdown)
    expect(field.options).toEqual([
      { key: '1', value: '1' },
      { key: '2', value: '21' }
    ])

    field = new BlockDropdownField('test', '', { options: [['x', 'y'], ['z']] })

    expect(field.options).toEqual([
      { key: 'x', value: 'y' },
      { key: 'z', value: 'z' }
    ])
  })

  it('selected', () => {
    expect(field.selected).toEqual({ key: '1', value: '1' })

    field = new BlockDropdownField('test', '')

    expect(field.selected).toEqual({ key: '', value: '' })
  })

  it('value', () => {
    expect(field.value()).toEqual('')

    field.value('2')
    expect(field.selected).toEqual({ key: '2', value: '21' })
    expect(field.value()).toEqual('2')

    field.value('xxx')
    expect(field.value()).toEqual('xxx')
    expect(field.selected).toEqual({ key: '1', value: '1' })
  })

  it('clone', () => {
    const newField = field.clone()

    expect(newField).not.toBe(field)
    expect(newField.options).toEqual(field.options)

    const b = new Block({ previous: false, next: false, output: ['boolean'] })
    newField.block.update(b)

    const newField2 = newField.clone()

    expect(newField2).not.toBe(newField)
    expect(newField2.options).toEqual(newField.options)
    expect(newField2.block.value).not.toBe(newField.block.value)
  })
})
