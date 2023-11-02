import type { Component } from 'vue'
import { getCurrentInstance, inject } from 'vue'
import { findContainer } from '../utils/find-container'
import { ModalKey } from '../constants'
import type { OpenModalOptions } from '../interfaces'

export function useModal() {
  const modal = inject(ModalKey)
  const ctx = getCurrentInstance()

  function open(
    component: 'confirm',
    props: {
      title?: string
      content: string
      footer?: () => JSX.Element
    }
  ): Promise<any> & { close: () => void }
  function open(
    component: 'info' | 'warning' | 'error' | 'sucess',
    props: {
      title?: string
      content: string
    }
  ): Promise<any> & { close: () => void }
  function open(
    component: Component,
    props?: Record<string, any>,
    options?: OpenModalOptions,
  ): Promise<any> & { close: () => void }
  function open(
    component: Component | 'confirm' | 'info' | 'warning' | 'error' | 'sucess',
    props?: Record<string, any>,
    options?: OpenModalOptions,
  ): Promise<any> & { close: () => void } {
    if (!modal) {
      throw new Error('Not Found Modal Provider Component')
    }

    return modal.open(component, props, options)
  }
  return {
    open,
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
    showLoading() {
      if (!modal) {
        throw new Error('Not Found Modal Provider Component')
      }

      const container = findContainer(ctx, 'ModalContainer')
      const id = container?.props?.id as string | undefined

      if (!id) {
        throw new Error('Not Found Current Modal Container')
      }

      if (container?.exposed) {
        container?.exposed.showLoading()
      }
    },
    hideLoading() {
      if (!modal) {
        throw new Error('Not Found Modal Provider Component')
      }

      const container = findContainer(ctx, 'ModalContainer')
      const id = container?.props?.id as string | undefined

      if (!id) {
        throw new Error('Not Found Current Modal Container')
      }

      if (container?.exposed) {
        container?.exposed.hideLoading()
      }
    },
  }
}
