import './jest.setup'
import { Renderer } from '../Renderer'
import { Workspace, Block } from '@/core'
import { BlockSVG } from '..'

describe('ConnectionManager', () => {
  let $r: Renderer

  beforeEach(() => {
    $r = new Renderer(new Workspace())
    $r.mount(document.body)
  })

  it('create/destory', () => {
    const conns = $r.connectionManager.connections
    expect(conns.size).toBe(0)

    const b = new BlockSVG(new Block(), $r)
    expect(conns.size).toBe(2)

    b.destroy()
    expect(conns.size).toBe(0)
  })
})
