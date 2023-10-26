import type { Options } from 'tsup'

export default <Options>{
  entryPoints: ['src/index.ts'],
  clean: true,
  platform: 'node',
  target: 'node18',
  format: ['cjs'],
  dts: true,
}
