import { Factory } from '../Factory'

interface TestCtor {
  new (): Test
}

class Test {}

describe('Factory', () => {
  let factory = new Factory<TestCtor>()

  it('set/get', () => {
    factory.set('a', Test)
    expect(factory.get('a')).toBe(Test)
  })
})
