import { Renderer } from '../Renderer'
import { Workspace } from '../../core'
import './vi.setup'
import { FieldSVG } from '../fields'

describe('Renderer', () => {
  let $r: Renderer

  beforeEach(() => {
    const w = new Workspace()
    $r = new Renderer(w)
  })

  it('mount', () => {
    const $div = document.createElement('div')
    $r.mount($div)

    expect($div.children[0]).toBe($r.svg.dom)
  })

  it('registerEffect', () => {
    const testEffect = {
      id: 'string',
      dom: document.createElementNS('http://www.w3.org/2000/svg', 'pattern')
    }

    $r.registerEffect('test', testEffect)

    expect($r.effects.test).toBe(testEffect)
  })

  it('registerFieldCtor', () => {
    class TestField extends FieldSVG<any, any> {
      constructor() {
        // @ts-ignore
        super()
      }
    }

    $r.fieldFactory.set('test', TestField)

    const Ctor = $r.fieldFactory.get('test')

    expect(Ctor).toBe(TestField)
  })
})
