<template>
  <div :id="id"></div>
</template>

<script>
import { Block, Workspace } from '../core'
import { BlockSlotField, BlockTextField } from '../core/fields'
import { SVG, Rect, PatternGrid, Area, Renderer } from '../renderer'
import { uuid } from '../shared'

export default {
  data() {
    return {
      id: uuid()
    }
  },
  mounted() {
    const workspace = new Workspace()

    const block = new Block(null, 'p-n')
    const field = new BlockTextField('arg', 'hello')
    block.pushField(field)

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
    renderer.$w.addBlock('p-n', 100, 100)
    renderer.$w.addBlock('p-n', 100, 150)

    renderer.$w.addBlock('slot-p-n', 300, 50)
    renderer.$w.addBlock('slot-p-n1', 300, 150)
    renderer.$w.addBlock('slot-p-n2', 300, 250)

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

    function createSlotBlock(opt = {}, id) {
      const block = new Block(opt, id)
      const slotField = new BlockSlotField('arg1')
      const field = new BlockTextField('arg', id)

      block.pushField(field)
      block.pushField(slotField, 1)

      return block
    }
  }
}
</script>
