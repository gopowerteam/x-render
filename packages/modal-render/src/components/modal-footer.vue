<template>
  <Teleport to="#modal-footer-slot">
    <div class="modal-footer">
      <slot />
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.modal-footer{
  box-sizing: border-box;
  min-height: 50px;
  border-top: solid 1px var(--color-border-1, rgb(232, 232, 232));
  padding: 10px;

  button{
    height: 32px;
    line-height: 28px;
    min-width: 80px;
    outline: none;
    border-color: transparent;
    font-size: 14px;
    border-radius: 4px;
    padding: 0;
    box-sizing: border-box;

    &.submit-button{
      color: #fff;
      background-color: rgb(var(--primary-6, 45, 106, 251));

      &:hover{
        background-color: rgb(var(--primary-5, 28, 76, 207));
      }
      &:active{
        background-color: rgb(var(--primary-7, 14,66,210));
      }
    }
    &.cancel-button{
      color: rgb(var(--color-text-2, 78, 89, 105));
      background-color: var(--color-fill-1, #f5f5f5);

      &:hover{
        background-color: var(--color-fill-3, #e5e6eb);
      }

      &:active{
        background-color: var(--color-fill-4, #c9cdd4);
      }
    }
  }
}
</style>

<script setup lang="tsx">
</script>
