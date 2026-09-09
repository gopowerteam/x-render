import type { InjectionKey } from 'vue'
import type { ModalActions } from './interfaces'

export const ModalKey = Symbol('__MODAL__') as InjectionKey<ModalActions>

/**
 * ModalContainer 向内容组件注入自身 id，
 * 供 ModalHeader / ModalFooter 定位所属弹窗的 Teleport 锚点（支持嵌套弹窗）
 */
export const ModalContainerIdKey = Symbol('__MODAL_CONTAINER_ID__') as InjectionKey<string>

/** 移动端断点（视口宽度，单位 px） */
export const MOBILE_BREAKPOINT = 768
