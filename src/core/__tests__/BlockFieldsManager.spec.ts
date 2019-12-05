import { BlockFieldManager } from '../BlockFieldsManager'
import { BlockTextField } from '@/fields'
import { toBeTheSameIds } from '@/jest.setup'

describe('BlockFieldsManager', () => {
  let manager: BlockFieldManager

  beforeEach(() => {
    manager = new BlockFieldManager()
  })

  it('add', () => {
    const a = new BlockTextField('')
    const b = new BlockTextField('')

    manager.add(a)
    manager.add(b)

    toBeTheSameIds(manager.fields, [a, b])

    expect(manager.count).toBe(2)
  })

  it('remove', () => {
    const a = new BlockTextField('name')
    const b = new BlockTextField('name')

    manager.add(a)
    manager.add(b)
    manager.remove(b)

    toBeTheSameIds(manager.fields, [a])

    expect(manager.count).toBe(1)
  })

})
