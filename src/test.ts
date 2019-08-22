import './less/style.less'
import { Workspace, Blocks, FieldLabel, Gesture, GestureEvent, FieldText } from './index'

const el = document.getElementById('app')

async function wait(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), time)
  })
}

const ws = new Workspace(el)
// @ts-ignore
window.ws = ws

ws.svgRoot.dom.style.border = '1px solid #333'
ws.svgRoot.dom.style.width = '80%'
ws.svgRoot.dom.style.height = '600px'
ws.svgRoot.dom.style.margin = '50px auto'
ws.svgRoot.dom.style.display = 'block'

const block = new Blocks(ws, { x: 50, y: 50 })
ws.addBlock(block)

const field = new FieldLabel(block, 'click me')
field.gesture = new Gesture(field.group.dom)

block.addFiled(field)
block.addFiled(new FieldLabel(block, ' space '))

block.addFiled(new FieldText(block, 'click to input'))

let times = 0
field.gesture.on(GestureEvent.click, () => {
  const newValue = 'click: ' + times++
  field.setValue(newValue)
})

const block2 = new Blocks(ws, { x: 150, y: 150 })
ws.addBlock(block2)

const field2 = new FieldLabel(block2, new Date().toISOString())
block2.addFiled(field2)

// setInterval(() => {
//   field2.setValue(new Date().toISOString())
//   block2.updateShapeWithoutCache()
// }, 1000)

for (let i = 0; i < 5; i++) {
  const b = new Blocks(ws, { x: 150 + i * 50, y: 150 + i * 50 })
  const f = new FieldLabel(b, 'test ' + i)
  b.addFiled(f)
  ws.addBlock(b)
}
