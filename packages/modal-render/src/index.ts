import ModalContainer from './components/modal-container.vue'
import ModalFooter from './components/modal-footer.vue'
import ModalHeader from './components/modal-header.vue'
import ModalProvider from './components/modal-provider.vue'
import { ModalKey } from './constants'
import { useModal } from './hooks/use-modal'
import 'virtual:uno.css'
import 'vue/jsx'

export { onSubmit } from './hooks/on-submit'
export * from './interfaces'

export {
  ModalContainer,
  ModalFooter,
  ModalHeader,
  ModalKey,
  ModalProvider,
  useModal,
}
