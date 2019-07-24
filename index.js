import SVG from 'svg.js'

const draw = SVG('app')
window.draw = draw

draw.style({
  border: '1px solid #333',
  width: '80%',
  height: '600px',
  margin: '50px auto',
  display: 'block'
})

const Draggable = {
  nodes: [],
  _dragging: false,
  _currentFunc: () => {},
  _id: 0,
  add(node, func) {
    if (typeof func !== 'function') {
      console.warn('no function', node)
      return
    }
    const id = this._id++

    this.nodes.push({
      id,
      node,
      func
    })

    return id
  },
  init() {
    document.addEventListener('mousedown', (e) => {
      const find = this.nodes.find((n) => n.node === e.target)
      if (find) {
        this._dragging = true
        this._currentFunc = find.func
      }
    })

    document.addEventListener('mousemove', (e) => {
      if (!this._dragging) {
        return
      }
      this._currentFunc(e)
    })

    document.addEventListener('mouseup', (e) => {
      this._dragging = false
    })
  }
}
Draggable.init()

class BlocksContainer {
  constructor(opt) {
    opt = Object.assign({ x: 0, y: 0, height: 30, fill: '#eee', stroke: '#000' }, opt)

    this._path = []
    this._height = opt.height

    this._combinePath()
    this._shape = draw.path(this._path)
    this._shape.fill(opt.fill)
    this._shape.stroke(opt.stroke)

    this._group = draw.group()
    this._group.add(this._shape)

    this.move(opt.x, opt.y)
    this._initializeEvents()
  }

  _combinePath() {
    const width = 60
    const radius = this._height / 2

    this._path = []
    this._path.push(['M', 0, 0])
    // left radius
    this._path.push(['c', -radius, 0, -radius, this._height, 0, this._height])
    // body
    this._path.push(['h', width])

    // right radius
    this._path.push(['c', radius, 0, radius, -this._height, 0, -this._height])
    this._path.push(['z'])
  }

  _initializeEvents() {
    Draggable.add(this._shape.node, (e) => {
      this._group.dmove(e.movementX, e.movementY)
    })
  }

  move(x, y) {
    this._group.move(x, y)
  }
}

const block = new BlocksContainer({ x: 50, y: 50 })

const topGroup = draw.group()

Draggable.add(draw.node, (e) => {
  topGroup.dmove(e.movementX, e.movementY)
})

topGroup.add(block._group)
topGroup.add(new BlocksContainer({ x: 100, y: 200 })._group)

draw.on('click', (e) => {
  if (e.target !== draw.node) {
    return
  }

  topGroup.add(new BlocksContainer({ x: e.offsetX, y: e.offsetY })._group)
})
