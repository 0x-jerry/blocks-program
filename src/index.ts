import '@svgdotjs/svg.js'
import '@svgdotjs/svg.filter.js'
import { Workspace } from './core/Workspace'
import { BasicBlocks } from './blocks/BasicBlocks'
import { FieldText } from './fields/Text'

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

const filed = new FieldText(block, 'test')

block.addFiled(filed)
block.addFiled(new FieldText(block, 'test2222222222-124'))

setTimeout(() => {
  filed.setValue('你好')
  block.update()
}, 1000)
