import { toBeTheSameIds } from '@/__tests__/jest.utils'
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

  it('connect block', () => {
    const a = new Block()
    const b = new Block()
    const c = new Block()

    $w.addBlock(a)
    $w.addBlock(b)
    $w.addBlock(c)

    $w.connectBlock(b, a)
    $w.connectBlock(c, b)

    toBeTheSameIds($w.blockDB, [a, b, c])

    expect(a.next.value).toBe(b)
    expect(b.next.value).toBe(c)
    expect(c.next.value).toBeNull()

    expect(a.previous.value).toBeNull()
    expect(b.previous.value).toBe(a)
    expect(c.previous.value).toBe(b)

    toBeTheSameIds($w.blockRoots, [a])
  })

  it('add connected block', () => {
    const a = new Block()
    const b = new Block()
    const c = new Block()

    $w.connectBlock(b, a)

    $w.addBlock(a)
    $w.addBlock(c)

    toBeTheSameIds($w.blockDB, [a, b, c])

    toBeTheSameIds($w.blockRoots, [a, c])
  })

  it('remove connect block', () => {
    const a = new Block()
    const b = new Block()
    const c = new Block()
    const d = new Block()

    $w.connectBlock(d, c)

    $w.addBlock(a)
    $w.addBlock(b)
    $w.addBlock(c)

    $w.connectBlock(b, a)

    $w.removeBlock(b)
    toBeTheSameIds($w.blockDB, [a, c, d])
    toBeTheSameIds($w.blockRoots, [a, c])

    $w.removeBlock(c)
    toBeTheSameIds($w.blockDB, [a])
    toBeTheSameIds($w.blockRoots, [a])
  })

  it('defined block', () => {
    const a = new Block({}, 'test')

    $w.definedBlocks.add(a)
    let block = $w.definedBlocks.blocks.find((b) => b.id === a.id)

    expect(block).toBe(a)

    $w.definedBlocks.remove(a)
    block = $w.definedBlocks.blocks.find((b) => b.id === a.id)
    expect(block).toBeFalsy()

    $w.definedBlocks.add(new Block())
    $w.definedBlocks.add(new Block())
    $w.definedBlocks.add(new Block())
    $w.definedBlocks.add(new Block())
    $w.definedBlocks.clear()

    expect($w.definedBlocks.blocks.length).toBe(0)

    const b = new Block({}, 'test1234')
    $w.definedBlocks.add(b)
    const expectB = $w.definedBlocks.get('test1234')

    expect(expectB).toBe(b)
  })
})
