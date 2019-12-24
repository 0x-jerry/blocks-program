import { Area, PatternGrid } from './lib'
import { Workspace } from '@/core'
import { Renderer } from './Renderer'
import { warn, SArray } from '@/shared'
import { BlockSVG } from './BlockSVG'

export class WorkspaceSVG extends Area {
  readonly $w: Workspace
  readonly $r: Renderer
  blocks: SArray<BlockSVG>

  constructor(workspace: Workspace, renderer: Renderer, width: number, height: number) {
    super(width, height)

    this.$r = renderer
    this.$w = workspace
    this.blocks = new SArray()

    this._initGrid()
  }

  private _initGrid() {
    const gridPattern = new PatternGrid(40, 40)
    this.$r.svg.defs.append(gridPattern)

    this.background.dom.style.fill = `url(#${gridPattern.id})`
    this.events.on('move', (dx, dy) => {
      gridPattern.dmove(-dx, -dy)
    })
  }

  addBlock(defineId: string, x = 0, y = 0) {
    const block = this.$w.definedBlocks.find((b) => b.id === defineId)

    if (!block) {
      warn('Not found block definition: ', defineId)
      return
    }

    const newBlock = block.clone()
    const blockSVG = new BlockSVG(newBlock, this.$r, { x, y })

    this.$w.addBlock(newBlock)
    this.blocks.pushDistinct(blockSVG)

    this.appendContent(blockSVG)
    blockSVG.updateShape()
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
}
