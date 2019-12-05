import { CodeGenerator } from '../CodeGenerator'
import { Block } from '@/core'
import { BlockTextField, BlockSlotField } from '@/fields'

describe('CodeGenerator', () => {
  let generator: CodeGenerator
  let block: Block
  const blockName = 'getTime'

  beforeEach(() => {
    generator = new CodeGenerator()

    block = new Block({
      name: blockName
    })
  })

  it('getFieldCode', () => {
    const field = new BlockTextField('test')
    field.value('this is a text')
    block.addField(field)

    const code = generator.getFieldCode(block, 'test')

    expect(code).toBe(`this is a text`)
  })

  it('getSlotFieldCode', () => {
    generator.registerBlock({
      [blockName]: () => 'new Time()',
      slotBlock(block, generator) {
        const branchCode = generator.getSlotFieldCode(block, 'slotField')

        return ['if () {', branchCode, '}']
      }
    })

    const slotBlock = new Block({ name: 'slotBlock' })
    const slotField = new BlockSlotField('slotField')

    slotBlock.addField(slotField)

    block.connectToField(slotField)

    const code = generator.getBlockCode(slotBlock)

    expect(code).toBe(['if () {', '  new Time()', '}'].join('\n'))
  })

  it('getBlockCode', () => {
    generator.registerBlock(blockName, () => {
      return 'new Time()'
    })

    const code = generator.getBlockCode(block)

    expect(code).toBe(`new Time()`)
  })

  it('getTopBlockCode', () => {
    const a = new Block({ name: 'aBlock' })
    const b = new Block({ name: 'bBlock' })

    generator.registerBlock({
      aBlock() {
        return 'hello'
      },
      bBlock() {
        return 'world'
      }
    })

    b.connectTo(a)

    expect(generator.getTopBlockCode(a)).toBe(['hello', 'world'].join('\n'))
  })
})
