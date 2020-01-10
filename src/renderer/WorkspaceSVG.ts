import { Area, IAreaEventsMap } from './lib'
import { Workspace } from '@/core'
import { Renderer } from './Renderer'
import { warn, SArray, EventEmitter } from '@/shared'
import { BlockSVG } from './BlockSVG'

type WorkspaceSVGEventsMap = IAreaEventsMap & {
  'select-block'(block: BlockSVG): void
  'block-move'(block: BlockSVG): void
}

export class WorkspaceSVG extends Area {
  readonly $w: Workspace
  readonly $r: Renderer
  events: EventEmitter<WorkspaceSVGEventsMap>
  currentSelectedBlock: BlockSVG | null

  blocks: SArray<BlockSVG>

  constructor(workspace: Workspace, renderer: Renderer, width: number, height: number) {
    super(width, height)

    this.currentSelectedBlock = null

    this.$r = renderer
    this.$w = workspace
    this.blocks = new SArray()

    this._initGrid()
  }

  private _initGrid() {
    const gridEffect = this.$r.effects.grid

    this.background.dom.style.fill = `url(#${gridEffect.id})`
    this.events.on('move', (dx, dy) => {
      gridEffect.dmove(-dx, -dy)
    })
  }

  addBlock(defineId: string, x = 0, y = 0) {
    const block = this.$w.definedBlocks.get(defineId)

    if (!block) {
      warn('Not found block definition: ', defineId)
      return
    }

    const newBlock = block.clone()
    const blockSVG = new BlockSVG(newBlock, this.$r, { x, y, type: defineId })

    this.$w.addBlock(newBlock)
    this.blocks.pushDistinct(blockSVG)

    this.appendContent(blockSVG)
    blockSVG.updateShape()

    blockSVG.dragger.on('dragstart', () => {
      this.currentSelectedBlock?.removeClasses('s_block_selected')
      this.currentSelectedBlock = blockSVG

      this.currentSelectedBlock?.addClasses('s_block_selected')
      this.events.emit('select-block', blockSVG)
    })

    blockSVG.dragger.on('dragging', () => {
      this.events.emit('block-move', blockSVG)
    })

    return blockSVG
  }

  removeBlock(blockSVGOrId: BlockSVG | string) {
    const block =
      typeof blockSVGOrId === 'string'
        ? this.blocks.remove((b) => b.$b.id === blockSVGOrId)
        : this.blocks.removeItem(blockSVGOrId)

    if (block) {
      this.removeContent(block)
      block.destroy()
    }
  }

  displayAtTop(block: BlockSVG) {
    const pos = block.getWorldPosition()

    block.move(pos.x, pos.y)

    super.displayAtTop(block)
  }
}
