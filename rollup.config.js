import babel from 'rollup-plugin-babel'
import typescript from 'rollup-plugin-typescript2'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import { terser } from 'rollup-plugin-terser'

const config = {
  file: 'build/blocks-program',
  name: 'BlocksProgram'
}

const tsDeclarationConfig = {
  declarationDir: 'dist',
  declaration: true,
  declarationMap: true
}

export default {
  input: 'src/index.ts',
  output: [
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
  ],
  plugins: [
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
