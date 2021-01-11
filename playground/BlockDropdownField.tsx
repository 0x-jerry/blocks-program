import { Block, Workspace, BlockTextField, Renderer, BlockDropdownField } from '../src'
import BlockProgram from './BlockProgram'

export default BlockProgram((el) => {
  const workspace = new Workspace()
  const renderer = new Renderer(workspace, 600, 400)
  renderer.mount(el)

  workspace.definedBlocks.add(createBlock({}, 'dropdown'))

  renderer.$w.addBlock('dropdown', 100, 50)

  function createBlock(opt = {}, id) {
    const block = new Block(opt, id)

    const field = new BlockTextField('text1', 'hello')
    const options = [['1'], ['2', '21']]
    const field1 = new BlockDropdownField('text2', 'dropdown', { options })
    block.pushField(field)
    block.pushField(field1)

    return block
  }
})
