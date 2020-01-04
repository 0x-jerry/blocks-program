import { SArray, distance } from '@/shared'
import { BlockSVG } from './BlockSVG'

export interface IConnectionOption {
  x: number
  y: number
  type: ConnectionType 
}

export enum ConnectionType {
  blockPrevious = 'block-previous',
  blockNext = 'block-next',
  blockOutput = 'block-output',
  field = 'field'
}

export class Connection {
  readonly x: number
  readonly y: number
  readonly type: ConnectionType
  readonly $b: BlockSVG

  acceptTypes: string[]

  constructor(block: BlockSVG, opt: IConnectionOption) {
    this.acceptTypes = []

    this.x = opt.x
    this.y = opt.y
    this.$b = block
    this.type = opt.type
  }

  /**
   * Whether can connect
   * @param conn
   */
  check(destConn: Connection) {
    return !!this.acceptTypes.find((t) => t === destConn.type)
  }

  connectTo(destConn: Connection) {
    this.$b.$b.connectTo(destConn.$b.$b)
    this.$b.move(destConn.x, destConn.y)
  }
}

export class ConnectionManager {
  connections: SArray<Connection>

  readonly maxRange: number

  constructor(range = 10) {
    this.connections = new SArray()
    this.maxRange = range
  }

  createConnection(b: BlockSVG, opt: IConnectionOption) {
    const conn = new Connection(b, opt)
    this.connections.push(conn)

    return conn
  }

  getNearestConn(conn: Connection) {
    let nearestOne: Connection | null = null
    let minDistance = Infinity

    for (const c of this.connections) {
      const d = distance(c, conn)
      if (d < this.maxRange && d < minDistance) {
        minDistance = d
        nearestOne = c
      }
    }

    return nearestOne
  }
}
