import { Path } from '@/renderer/lib'

describe('Path', () => {
  let path: Path

  beforeEach(() => {
    path = new Path()
  })

  it('new', () => {
    expect(path.dom.tagName.toUpperCase()).toBe('PATH')
  })
})
