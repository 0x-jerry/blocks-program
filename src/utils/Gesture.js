import Event from 'events'

/**
 * @type {Gesture[]}
 */
const nodes = []
/**
 * @type {Gesture}
 */
let currentNode = null
let isDragging = false

function _initialize() {
  document.addEventListener('mousedown', (e) => {
    currentNode = nodes.find((n) => n.node === e.target)

    if (currentNode) {
      currentNode.emit('dragstart', e)
    }
  })

  document.addEventListener('mousemove', (e) => {
    if (currentNode) {
      isDragging = true
      currentNode.emit('dragging', e)
    }
  })

  document.addEventListener('mouseup', (e) => {
    if (currentNode) {
      if (isDragging) {
        currentNode.emit('dragend', e)
      } else {
        currentNode.emit('click', e)
      }
    }

    isDragging = false
    currentNode = null
  })
}

_initialize()

export default class Gesture extends Event {
  /**
   *
   * @param {HTMLElement} node
   */
  constructor(node) {
    super()
    this.node = node
    nodes.push(this)
  }

  dispose() {
    const i = nodes.findIndex((n) => n === this)
    if (i >= 0) {
      nodes.splice(i, 1)
    }
  }
}
