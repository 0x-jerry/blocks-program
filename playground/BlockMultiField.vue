<template>
  <div :id="id"></div>
</template>

<script>
import {
  Area,
  SVG,
  PatternGrid,
  Rect,
  Block,
  Workspace,
  BlockSlotField,
  BlockTextField,
  BlockInputField,
  BlockDropdownField,
  Renderer
} from '../src'
import { uuid } from '../src/shared'

export default {
  data() {
    return {
      id: uuid()
    }
  },
  mounted() {
    const workspace = new Workspace()

    workspace.definedBlocks.add(createBlock({}, 'p-n'))
    workspace.definedBlocks.add(createBlock({ previous: false }, 'n'))
    workspace.definedBlocks.add(createBlock({ next: false }, 'p'))
    workspace.definedBlocks.add(createBlock({ next: false, previous: false }, 'none'))

    workspace.definedBlocks.add(createSlotBlock({ next: true, previous: true }, 'slot-p-n'))
    workspace.definedBlocks.add(createSlotBlock({ next: true, previous: true }, 'slot-p-n1'))
    workspace.definedBlocks.add(createSlotBlock({ next: true, previous: true }, 'slot-p-n2'))
    const renderer = new Renderer(workspace, 600, 400)

    renderer.mount(document.getElementById(this.id))

    renderer.$w.addBlock('p-n', 100, 50)
    renderer.$w.addBlock('n', 100, 150)
    renderer.$w.addBlock('p', 100, 250)

    renderer.$w.addBlock('slot-p-n', 300, 50)
    // renderer.$w.addBlock('slot-p-n1', 300, 150)
    // renderer.$w.addBlock('slot-p-n2', 300, 250)

    function createBlock(opt = {}, id) {
      const block = new Block(opt, id)

      const field = new BlockTextField('text1', 'hello')
      const field1 = new BlockTextField('text2', 'world')
      const field2 = new BlockTextField('arg', id)
      block.pushField(field)
      block.pushField(field1)
      block.pushField(field2, 1)

      return block
    }

    function createSlotBlock(opt = {}, id) {
      const block = new Block(opt, id)
      const slotField = new BlockSlotField('arg1')
      const field = new BlockTextField('arg', id)

      block.pushField(field)
      block.pushField(slotField, 1)
      block.pushField(field.clone(), 2)
      block.pushField(slotField.clone(), 3)

      return block
    }
  }
}
</script>
