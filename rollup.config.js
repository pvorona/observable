import typescript from 'rollup-plugin-typescript2'

export default {
  input: 'src/index.ts',
  output: [{ dir: 'dist' }],
  plugins: [typescript({ declaration: true })],
  preserveModules: true,
  external: ['@pvorona/scheduling'],
}
