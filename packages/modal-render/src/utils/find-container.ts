import type { ComponentInternalInstance } from 'vue'

export function findContainer(ctx: ComponentInternalInstance | null, name: 'ModalContainer' | 'ModalProvider') {
  let parent = ctx?.parent

  while (
    parent
    && parent?.type?.name !== name
  ) {
    parent = parent.parent
  }

  if (parent?.type?.name === name) {
    return parent
  }
  else {
    return null
  }
}
