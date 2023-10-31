import type { Component } from 'vue'
import { getCurrentInstance, inject } from 'vue'
import { findContainer } from '../utils/find-container'
import { ModalKey } from '../constants'
import type { OpenModalOptions } from '../interfaces'

export function useModal() {
  const modal = inject(ModalKey)
  const ctx = getCurrentInstance()
  return {
    open(
      component: Component,
      props?: Record<string, any>,
      options?: OpenModalOptions,
    ): Promise<any> {
      if (!modal) {
        throw new Error('Not Found Modal Provider Component')
      }

      return modal.open(component, props || {}, options || {})
    },
    close(data?: any): void {
      if (!modal) {
        throw new Error('Not Found Modal Provider Component')
      }

      const modalContainer = findContainer(ctx, 'ModalContainer')
      const id = modalContainer?.props?.id as string | undefined

      if (!id) {
        throw new Error('Not Found Current Modal Container')
      }

      modal.close(id, data)
    },
    closeAll() {
      if (!modal) {
        throw new Error('Not Found Modal Provider Component')
      }

      modal.closeAll()
    },
  }
}
