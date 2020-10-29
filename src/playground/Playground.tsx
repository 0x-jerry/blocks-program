import './styles.less'
import { defineComponent, onMounted } from 'vue'
import { Area, SVG, Rect, PatternGrid } from '../renderer'

export const Playground = defineComponent({
  setup() {
    onMounted(() => {
      const svg = new SVG(600, 400)
      svg.mount(document.getElementById('playground'))

      const area = new Area(600, 400)
      svg.append(area)

      const rect = new Rect(20, 20)

      rect.move(10, 10)
      area.appendContent(rect)

      const gridPattern = new PatternGrid(40, 40)
      svg.defs.append(gridPattern)

      area.background.dom.style.fill = `url(#${gridPattern.id})`

      area.events.on('move', (dx, dy) => {
        gridPattern.dmove(-dx, -dy)
      })

      // Performance test
      for (let index = 0; index < 100; index++) {
        const rect = new Rect(20, 20)

        rect.move(-2000 + Math.random() * 4000, -2000 + Math.random() * 4000)
        area.appendContent(rect)
      }

      svg.on('dblclick', (e) => {
        const rect = new Rect(20, 20)
        rect.move(e.offsetX, e.offsetY)
        area.appendContent(rect)
      })
    })
    return () => <div class="playground" id="playground"></div>
  }
})
