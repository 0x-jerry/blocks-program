import { Workspace } from '@/core'
import { SVG, DropShadowEffect, PatternGrid } from './lib'
import { WorkspaceSVG } from './WorkspaceSVG'
import { FieldSVGCtor, BlockTextFieldSVG } from './fields'
import { FIELD_TYPES } from '@/fields'

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
  readonly $w: Workspace
  svg: SVG
  workspaceSVG: WorkspaceSVG

  fieldCtors: {
    [type: string]: FieldSVGCtor
  }

  effects: IRendererEffects

  constructor(workspace: Workspace, width = 600, height = 400) {
    //@ts-ignore
    this.effects = {}
    this.fieldCtors = {}

    this.$w = workspace
    this._registerAllFields()

    this.svg = new SVG(width, height)
    this._initEffects()

    this.workspaceSVG = new WorkspaceSVG(workspace, this, width, height)

    this.svg.append(this.workspaceSVG)
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
    this.registerFieldCtor(FIELD_TYPES.TEXT, BlockTextFieldSVG)
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

  registerFieldCtor(type: FIELD_TYPES | string, Ctor: FieldSVGCtor) {
    this.fieldCtors[type] = Ctor
  }

  getFieldCtor(type: FIELD_TYPES | string): FieldSVGCtor | null {
    return this.fieldCtors[type] || null
  }
}
