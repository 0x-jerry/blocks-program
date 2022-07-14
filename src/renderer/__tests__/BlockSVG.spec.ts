import { BlockSVG } from '../BlockSVG'
import { Block, Workspace } from '../../core'
import { Renderer } from '../Renderer'
import './vi.setup'

describe('BlockSVG', () => {
  let $b: BlockSVG
  let $r: Renderer

  beforeEach(() => {
    $r = new Renderer(new Workspace())

    const block = new Block({ previous: true, next: true })
    $b = new BlockSVG(block, $r)
  })

  it('new', () => {
    expect($b.nextConnection).not.toBeFalsy()
    expect($b.outputConnection).toBeFalsy()
    expect($b.previousConnection).not.toBeFalsy()

    const block = new Block({
      next: false,
      previous: false,
      output: ['number']
    })
    const b = new BlockSVG(block, $r)

    expect(b.previousConnection).toBeFalsy()
    expect(b.nextConnection).toBeFalsy()
    expect(b.outputConnection).not.toBeFalsy()
  })
})
