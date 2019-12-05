import { Codes } from '../Codes'

describe('Codes', () => {
  let codes: Codes
  beforeEach(() => {
    codes = new Codes()
  })

  it('addMain', () => {
    const c = ['const text = "Hello world!"', 'console.log(text)']
    codes.addMain(c)

    expect(codes.getCode()).toBe(c.join('\n'))
  })

  it('addDefine', () => {
    codes.addDefine('1', ['import "hello"'])
    codes.addDefine('2', ['import "world"'])

    const text = ['import "hello"', 'import "world"']

    expect(codes.getCode()).toBe(text.join('\n'))

    const text1 = ['import!', 'import "hello"', 'import "world"']

    codes.addDefine('0', ['import!'])
    expect(codes.getCode()).toBe(text1.join('\n'))
  })

  it('addFunction', () => {
    const f1 = ['function () {', '}']
    const f2 = ['function f2() {', '}']

    codes.addFunction('10', f1)
    codes.addFunction('0', f2)

    const code = codes.getCode()

    expect(code).toBe([...f2, ...f1].join('\n'))
  })

  it('addFinished', () => {
    const f1 = ['suffix things']
    const f2 = ['suffix things2']

    codes.addFinished('10', f1)
    codes.addFinished('0', f2)

    const code = codes.getCode()

    expect(code).toBe([...f2, ...f1].join('\n'))
  })

  it('getCode', () => {
    expect(codes.getCode()).toBe('')

    codes.addMain(['console.log("Hello world!")'])

    expect(codes.getCode()).toBe('console.log("Hello world!")')

    codes.addDefine('0', ['import "universe"'])

    expect(codes.getCode()).toBe(['import "universe"', 'console.log("Hello world!")'].join('\n'))

    codes.addFinished('0', ['finished'])

    expect(codes.getCode()).toBe(['import "universe"', 'console.log("Hello world!")', 'finished'].join('\n'))

    codes.addFunction('0', ['function () {}'])

    expect(codes.getCode()).toBe(
      ['import "universe"', 'function () {}', 'console.log("Hello world!")', 'finished'].join('\n')
    )
  })
})
