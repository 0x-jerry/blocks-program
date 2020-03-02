import { blockJSONParser } from '../../index'
import { Block } from '@/core/Block'
import { BlockDropdownField } from '@/core/fields'

describe('blockJSONParser', () => {
  it('parse', () => {
    const block = blockJSONParser.parse({
      content: 'text $a',
      args: {
        a: {
          type: 'INPUT'
        }
      },
      output: 'STRING'
    })

    expect(block).toBeInstanceOf(Block)
    expect(block?.options.previous).toBeFalsy()
    expect(block?.options.next).toBeFalsy()
    expect(block?.hasOutput).toBe(true)

    const field = block?.getField('a')
    expect(field).toBeTruthy()
    expect(field?.type).toBe('INPUT')
  })

  it('parse mutil line', () => {
    const block = blockJSONParser.parse({
      content: ['text $a', 'line2 $b'],
      args: {
        a: {
          type: 'INPUT'
        },
        b: {
          type: 'DROPDOWN',
          options: [
            ['1', '1'],
            ['2', '2']
          ]
        }
      },
      previous: false
    })

    expect(block).toBeInstanceOf(Block)
    expect(block?.options.next).toBeTruthy()
    expect(block?.options.previous).toBeFalsy()

    const fa = block?.getField('a')
    expect(fa).toBeTruthy()
    expect(fa?.rowIdx).toBe(0)
    expect(fa?.type).toBe('INPUT')

    const fb = block?.getField('b') as BlockDropdownField
    expect(fb).toBeTruthy()
    expect(fb?.rowIdx).toBe(1)
    expect(fb?.type).toBe('DROPDOWN')
    expect(fb?.options).toEqual([
      { key: '1', value: '1' },
      { key: '2', value: '2' }
    ])
  })

  it('parse slot field', () => {
    const block = blockJSONParser.parse({
      content: 'text \n$slot\n text2',
      args: {
        slot: {
          type: 'BLOCK_SLOT'
        }
      }
    })

    expect(block).toBeInstanceOf(Block)
    expect(block?.options.previous).toBeTruthy()
    expect(block?.options.next).toBeTruthy()
    expect(block?.hasOutput).toBe(false)

    const field = block?.getField('slot')
    expect(field).toBeTruthy()
    expect(field?.type).toBe('BLOCK_SLOT')
    expect(field?.rowIdx).toBe(1)
  })
})
