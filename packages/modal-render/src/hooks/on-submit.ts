import { getCurrentInstance, inject } from 'vue'
import { ModalKey } from '../constants'
import { findContainer } from '../utils/find-container'

export function onSubmit(callback: () => void) {
  const modal = inject(ModalKey)
  const ctx = getCurrentInstance()
  const container = findContainer(ctx, 'ModalContainer')
  const id = container?.props?.id as string

  if (modal && id) {
    modal.addSubmitListener(id, callback)
  }
}
