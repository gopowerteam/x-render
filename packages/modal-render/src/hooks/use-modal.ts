import type { Component } from 'vue'
import { getCurrentInstance, inject } from 'vue'
import { findContainer } from '../utils/find-container'
import { ModalKey } from '../constants'
import type { OpenModalOptions, ShowLoadingOptions } from '../interfaces'

export function useModal() {
  const modal = inject(ModalKey)
  const ctx = getCurrentInstance()

  function open(
    component: 'confirm',
    props: {
      title?: string
      content: string
      onOk?: () => Promise<void> | void
      onCancel?: () => Promise<void> | void
      footer?: () => JSX.Element
    }
  ): Promise<any> & { close: () => void }
  function open(
    component: 'info' | 'warning' | 'error' | 'success',
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
    component: Component | 'confirm' | 'info' | 'warning' | 'error' | 'success',
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
    showLoading(options?: ShowLoadingOptions) {
      if (!modal) {
        throw new Error('Not Found Modal Provider Component')
      }

      const container = findContainer(ctx, 'ModalContainer')
      const id = container?.props?.id as string | undefined

      return modal.showLoading(id, options)
    },
    hideLoading() {
      if (!modal) {
        throw new Error('Not Found Modal Provider Component')
      }

      const container = findContainer(ctx, 'ModalContainer')
      const id = container?.props?.id as string | undefined

      return modal.hideLoading(id)
    },
    confirm(props: {
      title?: string
      content: string
      onOk?: () => Promise<void> | void
      onCancel?: () => Promise<void> | void
      footer?: () => JSX.Element
    }) {
      return this.open('confirm', props)
    },
    info(props: {
      title?: string
      content: string
    }) {
      return this.open('info', props)
    },
    error(props: {
      title?: string
      content: string
    }) {
      return this.open('error', props)
    },
    warning(props: {
      title?: string
      content: string
    }) {
      return this.open('warning', props)
    },
    success(props: {
      title?: string
      content: string
    }) {
      return this.open('success', props)
    },
  }
}
