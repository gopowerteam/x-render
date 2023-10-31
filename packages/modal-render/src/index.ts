import 'virtual:uno.css'
import ModalProvider from './components/modal-provider.vue'
import ModalContainer from './components/modal-container.vue'
import { useModal } from './hooks/use-modal'
import { ModalKey } from './constants'

export { onSubmit } from './hooks/on-submit'
export * from './interfaces'

export {
  ModalContainer,
  ModalProvider,
  useModal,
  ModalKey,
}
