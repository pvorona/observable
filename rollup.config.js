import filesize from 'rollup-plugin-filesize'
import sourceMaps from 'rollup-plugin-sourcemaps'
import typescript from 'rollup-plugin-typescript2'

// const pkg = require('./package.json')

export default {
  input: 'src/index.ts',
  output: [
    { dir: 'dist' },
    // { file: pkg.main, name: 'observable', format: 'umd', sourcemap: true },
    // { file: pkg.module, format: 'es', sourcemap: true },
  ],
  plugins: [typescript({ declaration: true }), filesize(), sourceMaps()],
  preserveModules: true,
}
