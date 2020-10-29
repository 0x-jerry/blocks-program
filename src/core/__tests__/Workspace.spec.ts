import { toBeTheSameIds } from '../../__tests__/jest.utils'
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

    toBeTheSameIds([...$w.blockDB.values()], [a, b])
    toBeTheSameIds([...$w.blockRoots.values()], [a, b])
    expect(a.workspace).toBe($w)
    expect(b.workspace).toBe($w)
  })

  it('remove block', () => {
    const a = new Block()
    const b = new Block()
    const c = new Block()

    $w.addBlock(a)
    $w.addBlock(b)
    $w.addBlock(c)

    $w.removeBlock(b)

    toBeTheSameIds([...$w.blockDB.values()], [a, c])
    toBeTheSameIds([...$w.blockRoots.values()], [c, a])
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

    toBeTheSameIds([...$w.blockDB.values()], [a, b, c])

    expect(a.next.value).toBe(b)
    expect(b.next.value).toBe(c)
    expect(c.next.value).toBeNull()

    expect(a.previous.value).toBeNull()
    expect(b.previous.value).toBe(a)
    expect(c.previous.value).toBe(b)

    toBeTheSameIds([...$w.blockRoots.values()], [a])
  })

  it('add connected block', () => {
    const a = new Block()
    const b = new Block()
    const c = new Block()

    $w.connectBlock(b, a)

    $w.addBlock(a)
    $w.addBlock(c)

    toBeTheSameIds([...$w.blockDB.values()], [a, b, c])

    toBeTheSameIds([...$w.blockRoots.values()], [a, c])
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
    toBeTheSameIds([...$w.blockDB.values()], [a, c, d])
    toBeTheSameIds([...$w.blockRoots.values()], [a, c])

    $w.removeBlock(c.id)
    toBeTheSameIds([...$w.blockDB.values()], [a])
    toBeTheSameIds([...$w.blockRoots.values()], [a])

    $w.removeBlock(b)
    toBeTheSameIds([...$w.blockDB.values()], [a])
    toBeTheSameIds([...$w.blockRoots.values()], [a])
  })

  it('defined block', () => {
    const a = new Block({}, 'test')

    $w.definedBlocks.add(a)
    expect($w.definedBlocks.get(a.id)).toBe(a)
    $w.definedBlocks.remove(a)
    expect($w.definedBlocks.get(a.id)).toBeNull()
    expect($w.definedBlocks.blocks.size).toBe(0)

    $w.definedBlocks.add(new Block({}, 'test1'))
    expect($w.definedBlocks.get('test1')).not.toBeNull()
    $w.definedBlocks.remove('test1')
    expect($w.definedBlocks.get('test1')).toBeNull()
    expect($w.definedBlocks.blocks.size).toBe(0)

    $w.definedBlocks.add(new Block())
    $w.definedBlocks.add(new Block())
    $w.definedBlocks.add(new Block())
    $w.definedBlocks.clear()

    expect($w.definedBlocks.blocks.size).toBe(0)

    const b = new Block({}, 'test1234')
    $w.definedBlocks.add(b)
    const expectB = $w.definedBlocks.get('test1234')

    expect(expectB).toBe(b)
  })
})
