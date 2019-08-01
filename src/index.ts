import '@svgdotjs/svg.js'
import '@svgdotjs/svg.filter.js'
import { Workspace } from './core/Workspace'
import { BasicBlocks } from './blocks/BasicBlocks'
import { FieldLabel } from './fields/Label'
import { UnicodeChar } from './utils/Characters'
import { Gesture } from './utils/Gesture'

const el = document.getElementById('app')

async function wait(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), time)
  })
}

const ws = new Workspace(el)
// @ts-ignore
window.ws = ws

ws.draw.css({
  border: '1px solid #333',
  width: '80%',
  height: '600px',
  margin: '50px auto',
  display: 'block'
})

const block = new BasicBlocks(ws, { x: 50, y: 50 })
ws.addBlock(block)

const field = new FieldLabel(block, 'click me')
field.gesture = new Gesture(field.shape.node)

block.addFiled(field)
block.addFiled(new FieldLabel(block, `${UnicodeChar.space}space`))
block.addFiled(new FieldLabel(block, `${UnicodeChar.space}xx`))

let times = 0
field.gesture.on('click', () => {
  const newValue = 'click: ' + times++
  field.setValue(newValue)
})

const block2 = new BasicBlocks(ws, { x: 150, y: 150 })
ws.addBlock(block2)

const field2 = new FieldLabel(block2, new Date().toISOString())
block2.addFiled(field2)

setInterval(() => {
  field2.setValue(new Date().toISOString())
  block2.update()
}, 1000)

for (let i = 0; i < 5; i++) {
  const b = new BasicBlocks(ws, { x: 150 + i * 50, y: 150 + i * 50 })
  const f = new FieldLabel(b, 'test ' + i)
  b.addFiled(f)
  ws.addBlock(b)
}
