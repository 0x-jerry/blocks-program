import Event from 'events'

export class GestureManager {
  nodes: Gesture[] = []
  currentNode: Gesture = null
  isDragging = false

  constructor() {
    this.initialize()
  }

  add(gesture: Gesture) {
    this.nodes.push(gesture)
  }

  remove(gesture: Gesture) {
    const idx = this.nodes.indexOf(gesture)
    this.nodes.splice(idx, 1)
  }

  private initialize() {
    document.addEventListener('mousedown', (e) => {
      this.currentNode = this.nodes.find((n) => n.node === e.target)

      if (this.currentNode) {
        this.currentNode.emit('dragstart', e)
      }
    })

    document.addEventListener('mousemove', (e) => {
      if (this.currentNode) {
        this.isDragging = true
        this.currentNode.emit('dragging', e)
      }
    })

    document.addEventListener('mouseup', (e) => {
      if (this.currentNode) {
        if (this.isDragging) {
          this.currentNode.emit('dragend', e)
        } else {
          this.currentNode.emit('click', e)
        }
      }

      this.isDragging = false
      this.currentNode = null
    })
  }
}

type DomElement = HTMLElement | SVGElement

export class Gesture extends Event {
  node: DomElement

  constructor(node: DomElement) {
    super()
    this.node = node
  }
}
