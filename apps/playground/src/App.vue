<template>
  <ModalProvider :min-width="500">
    <RouterView />
  </ModalProvider>
</template>

<script setup lang="ts">
import { ModalProvider } from '@gopowerteam/modal-render'
</script>
