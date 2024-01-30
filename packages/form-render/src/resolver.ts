export function FormRenderResolver({ sideEffect }: { sideEffect?: boolean } = {}) {
  return {
    type: 'component' as const,
    resolve: (name: string) => {
      const packageName = '@gopowerteam/form-render'
      if (name === 'FormRender' || name === 'form-render') {
        return {
          name: 'FormRender',
          from: packageName,
          sideEffects: sideEffect ? [`${packageName}/dist/style.css`] : [],
        }
      }
    },
  }
}
