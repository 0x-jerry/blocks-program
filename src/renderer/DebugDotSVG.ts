import { config } from '../config'
import { SElement, Rect } from './lib'
import { Connection } from './Connection'

export class DebugDotSVg {
  svg: Rect
  constructor(x: number, y: number, source: SElement) {
    if (!config.debug) {
      return
    }

    this.svg = new Rect(2, 2)
    this.svg.addClasses('s_debug', 's_debug_dot')
    this.svg.move(x, y)
    source.append(this.svg)
  }

  proxyOnConnection(conn: Connection) {
    const dot = this

    dot.svg.attr('conn-type', conn.type)

    return new Proxy(conn, {
      set(target, key, value, receiver) {
        // console.log(target, key, value, receiver)
        //@ts-ignore
        target[key] = value

        if (key === 'dx' || key === 'dy') {
          dot.svg.move(conn.dx, conn.dy)
        }

        if (key === 'targetConnection') {
          dot.svg.attr('target', String(!!value))
        }

        return true
      }
    })
  }
}
