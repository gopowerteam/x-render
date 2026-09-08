import type { InjectionKey } from 'vue'
import type { ModalActions } from './interfaces'

export const ModalKey = Symbol('__MODAL__') as InjectionKey<ModalActions>

/** 移动端断点（视口宽度，单位 px） */
export const MOBILE_BREAKPOINT = 768
