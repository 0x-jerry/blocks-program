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

    const block = new Block(null, 'testid')
    const field = new BlockTextField('arg', 'hello')
    block.pushField(field)

    workspace.definedBlocks.add(block)
    const renderer = new Renderer(workspace, 600, 400)

    renderer.$w.on('dblclick', (ev) => {
      console.log(ev)
      renderer.$w.addBlock('testid', ev.offsetX, ev.offsetY)
    })

    renderer.mount(document.getElementById(this.id))
  }
}
</script>
