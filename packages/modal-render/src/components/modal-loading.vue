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

<style scoped lang="less">
.modal-loading{
  .lds-ring {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 80px;
    height: 80px;
  }
  .lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 48px;
    height: 48px;
    margin: 8px;
    border: 5px solid #fff;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #fff transparent transparent transparent;
  }
  .lds-ring div:nth-child(1) {
    animation-delay: -0.45s;
  }
  .lds-ring div:nth-child(2) {
    animation-delay: -0.3s;
  }
  .lds-ring div:nth-child(3) {
    animation-delay: -0.15s;
  }
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
.modal-loading-text{
  color: #fff;
  font-weight: bold;
}
</style>

<script setup lang="ts">
withDefaults(defineProps<{
  text?: string
}>(), {
  text: '加载中',
})
</script>
