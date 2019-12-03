import { uid } from "@x/shared"

export class Workspace {
  private id: string

  constructor(id: string = uid()) {
    this.id = id
  }
}
