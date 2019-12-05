import { Configuration } from '../Configuration'

interface TestConfig {
  step: number
}

describe('Configuration', () => {
  let config: Configuration<TestConfig>

  beforeEach(() => {
    config = new Configuration({ step: 1 })
  })

  it('get', () => {
    expect(config.get('step')).toBe(1)

    config = new Configuration<TestConfig>({
      step: 123
    })

    expect(config.get('step')).toBe(123)
  })

  it('set', () => {
    config.set('step', 12)

    expect(config.get('step')).toBe(12)

    config.set('step', 1)
    expect(config.get('step')).toBe(1)

    config.set('step', 1)
    expect(config.get('step')).toBe(1)
  })
})
