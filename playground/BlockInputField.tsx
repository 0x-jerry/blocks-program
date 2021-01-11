import { Block, Workspace, BlockTextField, Renderer, BlockInputField } from '../src'
import BlockProgram from './BlockProgram'

export default BlockProgram((el) => {
  const workspace = new Workspace()
  const renderer = new Renderer(workspace, 600, 400)
  renderer.mount(el)

  workspace.definedBlocks.add(createBlock({}, 'input'))

  renderer.$w.addBlock('input', 100, 50)

  function createBlock(opt = {}, id) {
    const block = new Block(opt, id)

    const field = new BlockTextField('text1', 'hello')
    const field1 = new BlockInputField('text2', 'input')
    block.pushField(field)
    block.pushField(field1)

    return block
  }
})
