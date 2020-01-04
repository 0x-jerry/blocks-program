import { SArray, vecUtils } from '@/shared'
import { BlockSVG } from './BlockSVG'
import { Renderer } from './Renderer'
import { Connection, IConnectionOption } from './Connection'

export interface IConnectionPair {
  from: Connection
  to: Connection
}

export class ConnectionManager {
  readonly $r: Renderer
  readonly maxRange: number
  connections: SArray<Connection>

  constructor(renderer: Renderer, range = 10) {
    this.$r = renderer
    this.connections = new SArray()
    this.maxRange = range
  }

  createConnection(b: BlockSVG, opt: IConnectionOption) {
    const conn = new Connection(b, opt)
    this.connections.push(conn)
    return conn
  }

  getNearestConn(conn?: Connection) {
    if (!conn) {
      return null
    }

    let nearestOne: Connection | null = null
    let minDistance = Infinity

    for (const c of this.connections) {
      if (conn.sourceBlock === c.sourceBlock || !conn.checkDestConn(c)) {
        continue
      }

      const d = vecUtils.distance(
        vecUtils.plus(this.$r.$w.getWorldPosition(c.sourceBlock), {
          x: c.dx,
          y: c.dy
        }),
        vecUtils.plus(this.$r.$w.getWorldPosition(conn.sourceBlock), {
          x: conn.dx,
          y: conn.dy
        })
      )

      if (d < this.maxRange && d < minDistance) {
        minDistance = d
        nearestOne = c
      }
    }

    return nearestOne
  }

  getNearestConnPair(...conns: (Connection | undefined)[]) {
    let pair: IConnectionPair | null = null

    for (const conn of conns) {
      if (!conn) {
        continue
      }

      const dest = this.getNearestConn(conn)

      if (dest) {
        pair = {
          from: conn,
          to: dest
        }
      }
    }

    return pair
  }
}
