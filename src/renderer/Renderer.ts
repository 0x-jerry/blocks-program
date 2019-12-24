import { Workspace } from '@/core'
import { SVG } from './lib'
import { WorkspaceSVG } from './WorkspaceSVG'

export class Renderer {
  readonly $w: Workspace
  svg: SVG
  workspaceSVG: WorkspaceSVG

  constructor(workspace: Workspace, width = 600, height = 400) {
    this.svg = new SVG(width, height)
    this.$w = workspace

    this.workspaceSVG = new WorkspaceSVG(workspace, this, width, height)

    this.svg.append(this.workspaceSVG)
  }

  mount(el: HTMLElement) {
    this.svg.mount(el)
  }

  createBlock(type: string) {}
}
