import { Block, Workspace, BlockTextField, Renderer } from '../src'
import BlockProgram from './BlockProgram'

export default BlockProgram((el) => {
  const workspace = new Workspace()

  const block = new Block(null, 'p-n')
  const field = new BlockTextField('arg', 'hello')
  block.pushField(field)

  workspace.definedBlocks.add(createBlock({}, 'p-n'))
  workspace.definedBlocks.add(createBlock({ previous: false }, 'n'))
  workspace.definedBlocks.add(createBlock({ next: false }, 'p'))
  workspace.definedBlocks.add(createBlock({ next: false, previous: false }, 'none'))

  const renderer = new Renderer(workspace, 600, 400)

  renderer.mount(el)

  renderer.$w.addBlock('n', 100, 50)
  renderer.$w.addBlock('p-n', 100, 100)
  renderer.$w.addBlock('p', 100, 150)
  renderer.$w.addBlock('none', 100, 200)

  function createBlock(opt = {}, id) {
    const block = new Block(opt, id)

    const field = new BlockTextField('arg', 'hello')
    const field1 = new BlockTextField('arg', 'world')
    const field2 = new BlockTextField('arg', id)
    block.pushField(field)
    block.pushField(field1)
    block.pushField(field2)

    return block
  }
})
