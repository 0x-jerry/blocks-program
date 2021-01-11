import { Block, Workspace, BlockTextField, Renderer } from '../src'
import BlockProgram from './BlockProgram'

export default BlockProgram((el) => {
  const workspace = new Workspace()

  const block = new Block(null, 'testid')
  const field = new BlockTextField('arg', 'hello')
  block.pushField(field)

  workspace.definedBlocks.add(block)
  const renderer = new Renderer(workspace, 600, 400)

  renderer.$w.on('dblclick', (ev) => {
    console.log(ev)
    renderer.$w.addBlock('testid', ev.offsetX, ev.offsetY)
  })

  renderer.mount(el)
})
