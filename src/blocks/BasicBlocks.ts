import { BlocksContainer } from './Container'

export class BasicBlocks extends BlocksContainer {
  calcPath(...opts: any[]): string {
    const width = 60
    const height = 30
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

  dispose() {}
}
