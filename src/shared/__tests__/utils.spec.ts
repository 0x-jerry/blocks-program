import { uid } from '../utils'

describe('utils', () => {
  it('uid', () => {
    expect(uid(4)).toHaveLength(4)

    expect(uid()).toHaveLength(8)

    expect(uid(13)).toHaveLength(13)
  })
})
