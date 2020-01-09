import babel from 'rollup-plugin-babel'
import typescript from 'rollup-plugin-typescript2'
import replace from '@rollup/plugin-replace'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import { terser } from 'rollup-plugin-terser'

const config = {
  file: 'build/blocks-program',
  name: 'BlocksProgram'
}

const prod = process.env.NODE_ENV === 'production'

const tsDeclarationConfig = {
  declarationDir: 'dist',
  declaration: true,
  declarationMap: true
}

/**
 * @type {import('rollup').OutputOptions[]}
 */
const output = prod
  ? [
      {
        file: config.file + '.cjs.js',
        sourcemap: true,
        format: 'cjs'
      },
      {
        file: config.file + '.esm.js',
        sourcemap: true,
        format: 'esm'
      },
      {
        file: config.file + '.browser.min.js',
        format: 'iife',
        name: config.name,
        sourcemap: true,
        plugins: [terser()]
      },
      {
        file: config.file + '.umd.min.js',
        format: 'umd',
        name: config.name,
        sourcemap: true,
        plugins: [terser()]
      }
    ]
  : [
      {
        file: config.file + '.browser.min.js',
        format: 'iife',
        name: config.name,
        sourcemap: true
      }
    ]

export default {
  input: 'src/index.ts',
  output: output,
  plugins: [
    replace({ 'process.env.NODE_ENV': prod ? '"production"' : '"development"' }),
    babel({
      extensions: [...DEFAULT_EXTENSIONS, '.ts']
    }),
    typescript({
      check: false,
      tsconfig: 'tsconfig.json',
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: tsDeclarationConfig,
        exclude: ['**/__tests__']
      }
    })
  ]
}
