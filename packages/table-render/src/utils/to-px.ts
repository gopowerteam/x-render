export function toPx(value: string | number | undefined) {
  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number') {
    return `${value}px`
  }
}
