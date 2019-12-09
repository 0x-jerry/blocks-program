import { Path } from '@/renderer/lib'

describe('Path', () => {
  let path: Path

  beforeEach(() => {
    path = new Path()
  })

  it('new', () => {
    expect(path.dom.tagName.toUpperCase()).toBe('PATH')
  })

  it('d', () => {
    path.d
      .M(10, 10)
      .L(20, 20)
      .l(20, 20)
      .z()

    expect(path.attr('d')).toBe('M 10,10 L 20,20 l 20,20 z')

    path.d.clear()
    path.d.done()
    expect(path.attr('d')).toBe('')

    path.d
      .m(10, 10)
      .v(10, 10)
      .V(20)
      .H(3)
      .h(20, 20)
      .Z()
    expect(path.attr('d')).toBe('m 10,10 v 10 10 V 20 H 3 h 20 20 Z')

    path.d.clear()
    path.d
      .m(10, 10)
      .Q(10, 10, 20, 20)
      .T(10, 20)
      .q(10, 10, 20, 20, 30, 30)
      .t(10, 20, 30)
      .done()
    expect(path.attr('d')).toBe('m 10,10 Q 10,10 20,20 T 10,20 q 10,10 20,20 t 10,20')

    path.d.clear()
    path.d
      .m(0, 0)
      .C(10, 10, 20, 20, 30, 30)
      .S(20, 20, 40, 40)
      .c(10, 10, 20, 20, 30, 30)
      .s(20, 20, 40, 40)
      .done()
    expect(path.attr('d')).toBe('m 0,0 C 10,10 20,20 30,30 S 20,20 40,40 c 10,10 20,20 30,30 s 20,20 40,40')

    path.d.clear()
    path.d
      .A(10, 10, 30, 0, 1, 20, 20)
      .a(20, 20, 30, 1, 0, 50, 50)
      .Z()
    expect(path.attr('d')).toBe('A 10 10 30 0 1 20,20 a 20 20 30 1 0 50,50 Z')
  })
})
