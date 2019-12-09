import { CodeGenerator } from '../CodeGenerator'
import { Block } from '@/core'
import { BlockTextField, BlockSlotField } from '@/fields'

const spyWarn = jest.spyOn(global.console, 'warn')
const spyTrace = jest.spyOn(global.console, 'trace')

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

    const sField = new BlockSlotField('sfield')
    block.addField(sField)

    let code = generator.getFieldCode(block, 'test')

    expect(code).toBe(`this is a text`)

    spyWarn.mockReset()
    code = generator.getFieldCode(block, 'sfield')
    expect(spyWarn).toBeCalledTimes(1)

    spyWarn.mockReset()
    code = generator.getFieldCode(block, 'nothing')
    expect(spyWarn).toBeCalledTimes(1)
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

    let code = generator.getBlockCode(slotBlock)
    expect(code).toBe(['if () {', '  new Time()', '}'].join('\n'))


    const field = new BlockTextField('field')
    block.addField(field)

    spyWarn.mockReset()
    code = generator.getSlotFieldCode(block, 'field')
    expect(spyWarn).toBeCalledTimes(1)

    spyWarn.mockReset()
    code = generator.getSlotFieldCode(block, 'nothing')
    expect(spyWarn).toBeCalledTimes(1)
  })

  it('getBlockCode', () => {
    generator.registerBlock(blockName, () => {
      return 'new Time()'
    })

    const code = generator.getBlockCode(block)

    expect(code).toBe(`new Time()`)

    const b = new Block({ name: 'nothing' })

    spyWarn.mockReset()
    spyTrace.mockReset()
    const bCode = generator.getBlockCode(b)
    expect(bCode).toBe('')

    expect(spyWarn).toBeCalledTimes(1)
    expect(spyTrace).toBeCalledTimes(1)
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
