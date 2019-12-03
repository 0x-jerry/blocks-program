import { Workspace } from './Workspace'

export class Block {
  private $w: Workspace

  constructor(workspace: Workspace) {
    this.$w = workspace
  }
}
