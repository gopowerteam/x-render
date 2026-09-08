import { createSharedComposable, useMediaQuery } from '@vueuse/core'
import { MOBILE_BREAKPOINT } from '../constants'

const useSharedMediaQuery = createSharedComposable(() =>
  useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT}px)`),
)

/**
 * 是否为移动端视口（所有 ModalContainer 共享同一个媒体查询监听）
 */
export function useMobile() {
  return useSharedMediaQuery()
}
