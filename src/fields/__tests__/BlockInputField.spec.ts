import { BlockInputField } from '../BlockInputField'
import { FieldTypes } from '../const'

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
})
