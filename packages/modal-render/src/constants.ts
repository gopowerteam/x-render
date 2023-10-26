import type { InjectionKey } from 'vue'
import type { ModalActions } from './interfaces'

export const ModalKey = Symbol('__MODAL__') as InjectionKey<ModalActions>
