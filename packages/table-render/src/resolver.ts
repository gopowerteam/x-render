export function TableRenderResolver() {
  return {
    type: 'component' as const,
    resolve: (name: string) => {
      const packageName = '@gopowerteam/table-render'
      if (name === 'TableRender' || name === 'table-render') {
        return {
          name: 'TableRender',
          from: packageName,
          sideEffects: [`${packageName}/dist/style.css`],
        }
      }
    },
  }
}
