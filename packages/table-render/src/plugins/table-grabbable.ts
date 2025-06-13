const TouchDuration = 300

export function setupTableGrabbable(element: HTMLElement) {
  const tableDomElement = element
  const tableScrollContainer = tableDomElement?.querySelector<HTMLElement>('.arco-scrollbar-container.arco-table-body')

  if (!tableScrollContainer) {
    return
  }

  let timeout: number | undefined
  let grabbing = false
  let x: number | undefined

  tableScrollContainer.addEventListener('mousedown', () => {
    timeout = setTimeout(() => {
      if (timeout) {
        tableScrollContainer.style.cursor = 'grab'
        tableScrollContainer.style.userSelect = 'none'
        grabbing = true
      }
    }, TouchDuration)
  })

  tableScrollContainer.addEventListener('mouseup', () => {
    clearTimeout(timeout)
    if (timeout) {
      timeout = undefined
      grabbing = false
      tableScrollContainer.style.cursor = ''
      tableScrollContainer.style.userSelect = ''
      x = undefined
    }
  })

  tableScrollContainer.addEventListener('mousemove', (e) => {
    if (grabbing) {
      if (x === undefined) {
        x = e.clientX
      }
      else {
        const offsetX = x - e.clientX
        x = e.clientX
        tableScrollContainer.scrollLeft += offsetX
      }
    }
  })
}
