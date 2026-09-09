<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import { ModalContainerIdKey } from '../constants'

// 定位当前弹窗容器内的插槽锚点（锚点 id 含容器 id，嵌套弹窗互不串扰）；
// 未处于弹窗容器内时禁用 Teleport，降级为原位渲染
const containerId = inject(ModalContainerIdKey)

// 锚点位于容器模板中内容组件之后，挂载时尚未插入 DOM；
// 延迟到 onMounted（整树 DOM 就绪）后再启用 Teleport，避免 target 定位失败
const teleportReady = ref(false)

onMounted(() => {
  teleportReady.value = true
})
</script>

<template>
  <Teleport v-if="teleportReady" :to="containerId ? `#modal-footer-slot_${containerId}` : 'body'" :disabled="!containerId">
    <div class="modal-footer">
      <slot />
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
@use './styles/modal-buttons' as *;

.modal-footer {
  box-sizing: border-box;
  min-height: 50px;
  border-top: solid 1px var(--color-border-1, rgb(232, 232, 232));
  padding: 10px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
}

// slot 内容携带的是消费方 scope id，需用 :slotted 才能命中（原生 scoped 选择器对插槽按钮不生效）
:slotted(button) {
  @include modal-button-base;
}
</style>
