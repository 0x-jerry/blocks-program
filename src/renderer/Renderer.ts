import { Workspace } from '@/core'
import { SVG, DropShadowEffect, PatternGrid } from './lib'
import { WorkspaceSVG } from './WorkspaceSVG'
import { FieldSVGCtor, BlockTextFieldSVG, BlockSlotFieldSVG, BlockInputFieldSVG } from './fields'
import { FieldTypes } from '@/fields'
import { ConnectionManager, IConnectionPair } from './ConnectionManager'
import { BlockSVG, IBlockSVGRenderOption } from './BlockSVG'
import { Connection } from './Connection'
import { FloatWeight } from './utils'

interface IEffect {
  readonly id: string
  dom: SVGElement
}

interface IRendererEffectMaps {
  dragging: DropShadowEffect
  grid: PatternGrid
}

export interface IRendererEffects extends IRendererEffectMaps {
  [name: string]: IEffect | undefined
}

export interface IRenderOptions {
  block: IBlockSVGRenderOption
}

export class Renderer {
  svg: SVG
  dom?: HTMLElement
  floatWeight: FloatWeight
  $w: WorkspaceSVG

  connectionManager: ConnectionManager
  currentActiveConnPair: IConnectionPair | null

  fieldCtors: {
    [type: string]: FieldSVGCtor
  }

  effects: IRendererEffects

  rendererOptions: IRenderOptions

  constructor(workspace: Workspace, width = 600, height = 400) {
    //@ts-ignore
    this.effects = {}
    this.fieldCtors = {}

    this.currentActiveConnPair = null
    this.connectionManager = new ConnectionManager(this)
    this.floatWeight = new FloatWeight()

    this._initRendererOptions()

    this._registerAllFields()

    this._initWorkspaceSVG(workspace, width, height)
  }

  private _initRendererOptions() {
    this.rendererOptions = {
      block: {
        joinHeight: 4,
        joinWidth: 10,
        joinStartWidth: 10,
        slotWidth: 5,
        emptyHeight: 20,
        fieldGap: 5,
        horizontalPadding: 8,
        verticalPadding: 6
      }
    }
  }

  private _initWorkspaceSVG(workspace: Workspace, width: number, height: number) {
    this.svg = new SVG(width, height)
    this._initEffects()

    this.$w = new WorkspaceSVG(workspace, this, width, height)

    this.svg.append(this.$w)

    this.$w.events.on('select-block', this._blockMoving)

    this.$w.events.on('block-move', this._blockMoving)

    this.$w.dragger.on('dragstart', () => {
      this.floatWeight.hide()
    })

    this.$w.dragger.on('dragend', () => {
      this.currentActiveConnPair?.from.connectTo(this.currentActiveConnPair.to)
      this.currentActiveConnPair?.to.setActive(false)
    })
  }

  private _blockMoving = (block: BlockSVG) => {
    this.floatWeight.hide()

    if (block.previousConnection) {
      block.previousConnection.connectTo(null)
    }

    this.currentActiveConnPair?.to?.setActive(false)

    const getSlotConnections = (block: BlockSVG) => {
      const conns: Connection[] = []
      const slotFields = block.fields.flat().filter((f) => f.$f.type === FieldTypes.blockSlot) as BlockSlotFieldSVG[]

      for (const slot of slotFields) {
        if (slot.connection.targetConnection) {
          const slotConnectedBlock = slot.connection.targetConnection.sourceBlock
          conns.push(...getAllNextAndSlotConnections(slotConnectedBlock))
        } else {
          conns.push(slot.connection)
        }
      }

      return conns
    }

    const getAllNextAndSlotConnections = (block: BlockSVG) => {
      const conns: Connection[] = []

      conns.push(...getSlotConnections(block))

      if (block.nextConnection) {
        if (block.nextBlock) {
          const nextConns = getAllNextAndSlotConnections(block.nextBlock)
          conns.push(...nextConns)
        } else {
          conns.push(block.nextConnection)
        }
      }

      return conns
    }

    this.currentActiveConnPair = this.connectionManager.getNearestConnPair(
      block.previousConnection,
      block.outputConnection,
      block.getTrialBlock().nextConnection,
      ...getAllNextAndSlotConnections(block)
    )

    this.currentActiveConnPair?.to.setActive(true)
  }

  private _initEffects() {
    const dropShadow = new DropShadowEffect()
    this.svg.defs.append(dropShadow)

    const gridPattern = new PatternGrid(40, 40)
    this.svg.defs.append(gridPattern)

    this.registerEffect('dragging', dropShadow)
    this.registerEffect('grid', gridPattern)
  }

  private _registerAllFields() {
    this.registerFieldCtor(FieldTypes.text, BlockTextFieldSVG)
    this.registerFieldCtor(FieldTypes.blockSlot, BlockSlotFieldSVG)
    this.registerFieldCtor(FieldTypes.input, BlockInputFieldSVG)
  }

  mount(el: HTMLElement) {
    this.dom = el
    this.svg.mount(el)
  }

  /**
   * Register new effect or replace a exist effect.
   * @param name
   * @param effect
   */
  registerEffect<K extends keyof IRendererEffectMaps>(name: K, effect: IRendererEffectMaps[K]): void
  registerEffect(name: string, effect: IEffect): void
  registerEffect<K extends keyof IRendererEffectMaps>(
    name: string | K,
    effect: IEffect | IRendererEffectMaps[K]
  ): void {
    // @ts-ignore
    this.effects[name] = effect

    this.svg.defs.dom.append(effect.dom)
  }

  registerFieldCtor(type: FieldTypes | string, Ctor: FieldSVGCtor) {
    this.fieldCtors[type] = Ctor
  }

  getFieldCtor(type: FieldTypes | string): FieldSVGCtor | null {
    return this.fieldCtors[type] || null
  }
}
