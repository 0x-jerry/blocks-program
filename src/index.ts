import '@svgdotjs/svg.js'
import '@svgdotjs/svg.filter.js'
import { Workspace } from './core/Workspace'
import { BasicBlocks } from './blocks/BasicBlocks'

const el = document.getElementById('app')

//@ts-ignore
// window.ws = ws

async function wait(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), time)
  })
}

async function test() {
  for (let i = 0; i < 1; i++) {
    const ws = new Workspace(el)

    ws.draw.css({
      border: '1px solid #333',
      width: '80%',
      height: '600px',
      margin: '50px auto',
      display: 'block'
    })

    const block = new BasicBlocks(ws, { x: 50, y: 50 })
    ws.addBlock(block)
  }
}

test()
