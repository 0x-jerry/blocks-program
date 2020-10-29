import { WorkspaceSVG } from '../WorkspaceSVG'
import { Workspace, Block } from '../../core'
import { Renderer } from '../Renderer'
import './jest.setup'

describe('WorkspaceSVG', () => {
  let $w: WorkspaceSVG

  beforeEach(() => {
    const w = new Workspace()
    $w = new WorkspaceSVG(w, new Renderer(w), 100, 100)
  })

  it('addBlock', () => {
    let b = $w.addBlock('test')

    expect(b).toBeUndefined()

    const block = new Block({}, 'testId')

    $w.$w.definedBlocks.add(block)

    b = $w.addBlock('testId')

    expect(b?.options.type).toBe('testId')
    expect(b).not.toBe(block)
    expect($w.blocks.length).toBe(1)
  })

  it('removeBlock', () => {
    const block = new Block({}, 'testId')

    $w.$w.definedBlocks.add(block)

    let b = $w.addBlock('testId')!

    $w.removeBlock('id')
    expect($w.blocks.length).toBe(1)

    $w.removeBlock(b)
    expect($w.blocks.length).toBe(0)
  })
})
