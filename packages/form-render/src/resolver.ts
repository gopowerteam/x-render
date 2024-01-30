export function FormRenderResolver({ importStyle }: { importStyle: boolean }) {
  return {
    type: 'component' as const,
    resolve: (name: string) => {
      const packageName = '@gopowerteam/form-render'
      if (name === 'FormRender' || name === 'form-render') {
        return {
          name: 'FormRender',
          from: packageName,
          sideEffects: importStyle ? [`${packageName}/dist/style.css`] : [],
        }
      }
    },
  }
}
