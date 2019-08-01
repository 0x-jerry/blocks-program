import { BlocksContainer } from './Container'

export class BasicBlocks extends BlocksContainer {
  calcPath(...opts: any[]): string {
    const padding = 5
    const width = this.getFieldsWidth()
    const height = this.getFieldsHeight() + padding * 2

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
