import { toBeTheSameIds } from '@/jest.setup'
import { Workspace } from '../Workspace'
import { Block } from '../Block'

describe('Workspace', () => {
  let $w: Workspace

  beforeEach(() => {
    $w = new Workspace()
  })

  it('add block', () => {
    const a = new Block()
    const b = new Block()

    $w.addBlock(a)
    $w.addBlock(b)

    toBeTheSameIds($w.blockDB, [a, b])
    toBeTheSameIds($w.blockRoots, [a, b])
  })

  it('remove block', () => {
    const a = new Block()
    const b = new Block()
    const c = new Block()

    $w.addBlock(a)
    $w.addBlock(b)
    $w.addBlock(c)

    $w.removeBlock(b)

    toBeTheSameIds($w.blockDB, [a, c])
    toBeTheSameIds($w.blockRoots, [c, a])
  })
})
