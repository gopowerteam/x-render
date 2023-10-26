import type { ComponentInternalInstance } from 'vue'

export function findContainer(ctx: ComponentInternalInstance | null) {
  let parent = ctx?.parent

  while (
    parent &&
    parent.vnode &&
    parent.vnode.el &&
    parent.vnode.el.className !== 'modal-container'
  ) {
    parent = parent.parent
  }

  if (parent?.vnode?.el?.className === 'modal-container') {
    return parent.props
  } else {
    return null
  }
}
