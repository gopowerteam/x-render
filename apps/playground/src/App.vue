<template>
  <ModalProvider :offset="{ x: 500, y: 0 }">
    <RouterView />
  </ModalProvider>
</template>

<script setup lang="ts">
import { ModalProvider } from '@gopowerteam/modal-render'
</script>
