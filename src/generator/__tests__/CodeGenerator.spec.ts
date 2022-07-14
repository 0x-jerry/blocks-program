import { CodeGenerator } from '../CodeGenerator'
import { Block } from '../../core'
import { BlockTextField, BlockSlotField } from '../../core/fields'

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
    block.pushField(field)

    const sField = new BlockSlotField('sfield')
    block.pushField(sField)

    let code = generator.getFieldCode(block, 'test')

    expect(code).toBe(`this is a text`)

    const spyWarn = vi.spyOn(global.console, 'warn')
    spyWarn.mockReset()
    code = generator.getFieldCode(block, 'sfield')
    expect(spyWarn).toBeCalledTimes(1)

    spyWarn.mockReset()
    code = generator.getFieldCode(block, 'nothing')
    expect(spyWarn).toBeCalledTimes(1)
    spyWarn.mockRestore()
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
    slotBlock.pushField(slotField)
    block.connectToField(slotField)

    let code = generator.getBlockCode(slotBlock)
    expect(code).toBe(['if () {', '  new Time()', '}'].join('\n'))

    const field = new BlockTextField('field')
    block.pushField(field)

    const spyWarn = vi.spyOn(global.console, 'warn')
    spyWarn.mockReset()
    code = generator.getSlotFieldCode(block, 'field')
    expect(spyWarn).toBeCalledTimes(1)

    spyWarn.mockReset()
    code = generator.getSlotFieldCode(block, 'nothing')
    expect(spyWarn).toBeCalledTimes(1)
    spyWarn.mockRestore()
  })

  it('getBlockCode', () => {
    generator.registerBlock(blockName, () => {
      return 'new Time()'
    })

    const code = generator.getBlockCode(block)

    expect(code).toBe(`new Time()`)

    const b = new Block({ name: 'nothing' })

    const spyWarn = vi.spyOn(global.console, 'warn')
    spyWarn.mockReset()
    const bCode = generator.getBlockCode(b)
    expect(bCode).toBe('')

    expect(spyWarn).toBeCalledTimes(1)
    spyWarn.mockRestore()
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

    b.previous.update(a)

    expect(generator.getTopBlockCode(a)).toBe(['hello', 'world'].join('\n'))
  })
})
