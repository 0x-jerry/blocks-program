import { Workspace } from '@/core'
import { SVG, DropShadowEffect, PatternGrid } from './lib'
import { WorkspaceSVG } from './WorkspaceSVG'
import { FieldSVGCtor, BlockTextFieldSVG, BlockSlotFieldSVG } from './fields'
import { FieldTypes } from '@/fields'
import { ConnectionManager, IConnectionPair } from './ConnectionManager'

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

export class Renderer {
  svg: SVG
  $w: WorkspaceSVG

  connectionManager: ConnectionManager
  currentActiveConnPair: IConnectionPair | null

  fieldCtors: {
    [type: string]: FieldSVGCtor
  }

  effects: IRendererEffects

  constructor(workspace: Workspace, width = 600, height = 400) {
    //@ts-ignore
    this.effects = {}
    this.fieldCtors = {}

    this.currentActiveConnPair = null
    this.connectionManager = new ConnectionManager(this)

    this._registerAllFields()

    this._initWorkspaceSVG(workspace, width, height)
  }

  private _initWorkspaceSVG(workspace: Workspace, width: number, height: number) {
    this.svg = new SVG(width, height)
    this._initEffects()

    this.$w = new WorkspaceSVG(workspace, this, width, height)

    this.svg.append(this.$w)

    this.$w.events.on('block-move', (block) => {
      if (block.previousConnection) {
        block.previousConnection.connectTo(null)
      }

      this.currentActiveConnPair?.to?.setActive(false)
      const slotFields = block.fields.flat().filter((f) => f.$f.type === FieldTypes.blockSlot) as BlockSlotFieldSVG[]

      this.currentActiveConnPair = this.connectionManager.getNearestConnPair(
        block.previousConnection,
        block.outputConnection,
        block.getTrialBlock().nextConnection,
        ...slotFields.map((f) => f.connection)
      )

      this.currentActiveConnPair?.to.setActive(true)
    })

    this.$w.dragger.on('dragend', () => {
      this.currentActiveConnPair?.from.connectTo(this.currentActiveConnPair.to)
      this.currentActiveConnPair?.to.setActive(false)
    })
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
  }

  mount(el: HTMLElement) {
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
