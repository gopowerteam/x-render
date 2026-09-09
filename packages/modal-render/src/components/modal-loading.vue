<script setup lang="ts">
withDefaults(defineProps<{
  text?: string
}>(), {
  text: '加载中',
})
</script>

<template>
  <section class="flex-center">
    <div class="modal-loading">
      <div class="lds-ring">
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
    <div class="modal-loading-text">
      {{ text }}
    </div>
  </section>
</template>

<style scoped lang="scss">
@use './styles/loading-spinner' as *;

.modal-loading {
  @include loading-spinner;
}
.modal-loading-text {
  color: #fff;
  font-weight: bold;
}
</style>
