import { Workspace } from '@/core'
import { SVG } from './lib'
import { WorkspaceSVG } from './WorkspaceSVG'
import { FieldSVGCtor, BlockTextFieldSVG } from './fields'
import { FIELD_TYPES } from '@/fields'

export class Renderer {
  readonly $w: Workspace
  svg: SVG
  workspaceSVG: WorkspaceSVG

  fieldCtors: {
    [type: string]: FieldSVGCtor
  }

  constructor(workspace: Workspace, width = 600, height = 400) {
    this.fieldCtors = {}

    this._registerAllFields()

    this.svg = new SVG(width, height)
    this.$w = workspace

    this.workspaceSVG = new WorkspaceSVG(workspace, this, width, height)

    this.svg.append(this.workspaceSVG)
  }

  private _registerAllFields() {
    this.registerFieldCtor(FIELD_TYPES.TEXT, BlockTextFieldSVG)
  }

  mount(el: HTMLElement) {
    this.svg.mount(el)
  }

  registerFieldCtor(type: FIELD_TYPES | string, Ctor: FieldSVGCtor) {
    this.fieldCtors[type] = Ctor
  }

  getFieldCtor(type: FIELD_TYPES | string): FieldSVGCtor | null {
    return this.fieldCtors[type] || null
  }
}
