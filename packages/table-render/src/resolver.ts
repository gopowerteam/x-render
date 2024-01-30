export function TableRenderResolver({ importStyle }: { importStyle: boolean }) {
  return {
    type: 'component' as const,
    resolve: (name: string) => {
      const packageName = '@gopowerteam/table-render'
      if (name === 'TableRender' || name === 'table-render') {
        return {
          name: 'TableRender',
          from: packageName,
          sideEffects: importStyle ? [`${packageName}/dist/style.css`] : [],
        }
      }
    },
  }
}
