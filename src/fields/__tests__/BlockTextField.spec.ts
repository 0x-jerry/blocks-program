import { BlockTextField } from "../BlockTextField"

describe('BlockTextField', () => {
  it('get/set value', () => {
    const a = new BlockTextField('test')
    expect(a.value()).toBe('test')

    a.value('123')
    expect(a.value()).toBe('123')
  })
})