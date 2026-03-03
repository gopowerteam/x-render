<script setup lang="ts">
import { ModalProvider } from '@gopowerteam/modal-render'
</script>

<template>
  <ModalProvider :offset="{ x: 0, y: 0 }">
    <RouterView />
  </ModalProvider>
</template>
