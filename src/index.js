import * as SVG from '@svgdotjs/svg.js'
import Filter from '@svgdotjs/svg.filter.js'
import Gesture from './utils/Gesture'

const draw = SVG.SVG()
document.getElementById('app').appendChild(draw.node)
window.draw = draw

draw.css({
  border: '1px solid #333',
  width: '80%',
  height: '600px',
  margin: '50px auto',
  display: 'block'
})

const dragFilter = new Filter()
draw.defs().add(dragFilter)

const blur = dragFilter
  .offset(0, 0)
  .in(dragFilter.$sourceAlpha)
  .gaussianBlur(2)

dragFilter.blend(dragFilter.$source, blur)

class BlocksContainer {
  constructor(opt) {
    opt = Object.assign({ x: 0, y: 0, height: 30, fill: '#eee', stroke: '#000' }, opt)

    this._path = []
    this._height = opt.height

    this._combinePath()
    this._shape = new SVG.Path({ d: this._path })
    this._shape.fill(opt.fill)
    this._shape.stroke(opt.stroke)

    this._group = new SVG.G()
    this._group.add(this._shape)
    draw.add(this._group)

    this.move(opt.x, opt.y)
    this._initializeEvents()
  }

  _combinePath() {
    const width = 60
    const radius = this._height / 2

    this._path = []
    this._path.push('M', 0, 0)
    // left radius
    this._path.push('c', -radius, 0, -radius, this._height, 0, this._height)
    // body
    this._path.push('h', width)

    // right radius
    this._path.push('c', radius, 0, radius, -this._height, 0, -this._height)
    this._path.push('z')
  }

  _initializeEvents() {
    this.gesture = new Gesture(this._shape.node)

    this.gesture.on('dragging', (e) => {
      this._group.dmove(e.movementX, e.movementY)
      this._group.filterWith(dragFilter)
    })

    this.gesture.on('dragend', () => {
      this._group.unfilter()
    })
  }

  move(x, y) {
    this._group.move(x, y)
  }
}

const topGroup = new SVG.G()
draw.add(topGroup)

const drawGesture = new Gesture(draw.node)

drawGesture.on('click', (e) => {
  const block = new BlocksContainer({ x: e.offsetX, y: e.offsetY })

  topGroup.add(block._group)
})

drawGesture.on('dragging', (e) => {
  topGroup.dmove(e.movementX, e.movementY)
})

topGroup.add(new BlocksContainer({ x: 50, y: 50 })._group)
