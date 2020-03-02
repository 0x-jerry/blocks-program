import { FieldTypes } from '../../fields/const'
import { fieldUtils } from '../../fields/FieldUtils'
import { BlockField } from '@/core'

describe('fieldUtils', () => {
  it('default constructors', () => {
    for (const type of Object.values(FieldTypes)) {
      expect(fieldUtils.get(type)).toBeTruthy()
    }
  })

  it('set', () => {
    const newType = 'new-type'
    class newField extends BlockField {
      constructor(name: string, value: string, opt: any) {
        super(name, value, newType, opt)
      }
    }

    fieldUtils.set(newType, newField)
    expect(fieldUtils.ctors[newType]).toBe(newField)
  })
})
