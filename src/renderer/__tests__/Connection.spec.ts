import { Connection, ConnectionType } from '../Connection'
import { BlockSVG } from '../BlockSVG'
import { Block, Workspace } from '@/core'
import { Renderer } from '../Renderer'
import './jest.setup'

describe('Connection', () => {
  let conn: Connection
  let $r: Renderer

  beforeEach(() => {
    const block = new Block({ next: true, previous: true })
    const w = new Workspace()
    $r = new Renderer(w)

    const b = new BlockSVG(block, $r)

    conn = b.previousConnection!
  })

  it('setActive', () => {
    conn.setActive(true)
    expect(conn.sourceBlock.dom.classList.contains('s_conn_active')).toBe(true)
    conn.setActive(false)
    expect(conn.sourceBlock.dom.classList.contains('s_conn_active')).toBe(false)
  })

  it('checkDestConn', () => {
    const b = new BlockSVG(new Block(), $r)

    const bConn = new Connection(b, {
      type: ConnectionType.blockNext,
      acceptTypes: [ConnectionType.blockPrevious],
      connectAction() {}
    })
    expect(conn.checkDestConn(bConn)).toBe(true)

    const cConn = new Connection(b, {
      type: ConnectionType.blockPrevious,
      acceptTypes: [ConnectionType.blockNext],
      connectAction() {}
    })
    expect(conn.checkDestConn(cConn)).toBe(false)
  })

  it('connectTo', () => {
    const b = new BlockSVG(new Block({ next: true }), $r)

    const action1 = jest.spyOn(conn, 'connectAction')
    const action2 = jest.spyOn(b.nextConnection!, 'connectAction')

    conn.connectTo(b.nextConnection!)

    expect(action1).toBeCalledTimes(1)
    expect(action2).toBeCalledTimes(1)
    expect(conn.targetConnection).toBe(b.nextConnection)
    expect(b.nextConnection?.targetConnection).toBe(conn)

    action1.mockReset()
    action2.mockReset()

    conn.connectTo(null)

    expect(action1).toBeCalledTimes(1)
    expect(action2).toBeCalledTimes(1)
    expect(conn.targetConnection).toBe(null)
    expect(b.nextConnection?.targetConnection).toBe(null)
  })
})
