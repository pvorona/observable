import filesize from 'rollup-plugin-filesize'
import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/index.ts',
  output: {
    file: './dist/index.js',
    format: 'umd',
    name: 'observable',
  },
  plugins: [typescript(), filesize()],
}
