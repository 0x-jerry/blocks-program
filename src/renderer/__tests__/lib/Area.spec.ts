import { Area } from '@/renderer/lib'

describe('Area', () => {
  let area: Area

  beforeEach(() => {
    area = new Area(600, 400)
  })

  it('setSize', () => {
    expect(area).not.toBeNull()
  })
})