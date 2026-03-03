<script setup lang="tsx">
</script>

<template>
  <Teleport to="#modal-header-slot">
    <div class="modal-header">
      <slot />
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.modal-header {
  box-sizing: border-box;
  padding: 10px;
  min-height: 50px;
  border-bottom: solid 1px var(--color-border-1, rgb(232, 232, 232));
  color: var(--color-text-2, #4e5969);
}
</style>
