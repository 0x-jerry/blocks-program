import { BlockContainer } from './Container'

export class BasicBlock extends BlockContainer {
  calcPath(...opts: any[]): string {
    const width = this.caches.fields.width
    const height = this.caches.fields.height + this.style.paddingTop * 2

    const radius = height / 2

    const path = []
    path.push('M', 0, 0)
    // left radius
    path.push('c', -radius, 0, -radius, height, 0, height)
    // body
    path.push('h', width)

    // right radius
    path.push('c', radius, 0, radius, -height, 0, -height)

    path.push('z')

    return path.join(' ')
  }
}
