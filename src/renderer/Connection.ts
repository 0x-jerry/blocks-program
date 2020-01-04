import { BlockSVG } from './BlockSVG'

export enum ConnectionType {
  blockPrevious = 'block-previous',
  blockNext = 'block-next',
  blockOutput = 'block-output',
  field = 'field'
}

export interface IConnectionOption {
  dx?: number
  dy?: number
  type: ConnectionType
  connectAction: (destConn: Connection) => void
  acceptTypes?: ConnectionType[]
}

export class Connection {
  readonly type: ConnectionType
  readonly sourceBlock: BlockSVG
  readonly connectAction: (destConn: Connection) => void

  dx: number
  dy: number
  targetConnection: Connection | null

  isActive: boolean

  acceptTypes: ConnectionType[]

  get isConnected() {
    return !!this.targetConnection
  }

  constructor(block: BlockSVG, opt: IConnectionOption) {
    this.acceptTypes = []
    this.isActive = false
    this.targetConnection = null

    this.connectAction = opt.connectAction
    this.dx = opt.dx || 0
    this.dy = opt.dy || 0
    this.sourceBlock = block
    this.type = opt.type
    this.acceptTypes = opt.acceptTypes || []
  }

  setActive(active: boolean) {
    this.isActive = active
    if (this.isActive) {
      this.sourceBlock.addClasses('s_conn_active')
    } else {
      this.sourceBlock.removeClasses('s_conn_active')
    }
  }

  /**
   * Whether can connect
   * @param conn
   */
  checkDestConn(destConn: Connection) {
    const isAcceptType = !!this.acceptTypes.find((t) => t === destConn.type)
    const isConnected = destConn.isConnected

    return isAcceptType && !isConnected
  }

  /**
   * Null to disconnect
   */
  connectTo(destConn: Connection | null, execAction = true) {
    const oldTargetConnection = this.targetConnection

    if (destConn === oldTargetConnection) {
      return
    }

    if (!destConn) {
      this.targetConnection = null

      oldTargetConnection?.connectTo(null)
    } else {
      if (execAction) {
        this.connectAction(destConn)
      }

      this.targetConnection = destConn

      destConn.connectTo(this, false)
    }
  }
}
