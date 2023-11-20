<template>
  <FormRender
    :columns="1"
    footer
    :form="form"
    layout="horizontal"
    resetable
    searchable
  >
    <template #actions>
      <AButton type="primary">
        123123
      </AButton>
    </template>
  </FormRender>
</template>

<style scoped>

</style>

<script setup lang="ts">
import { FormRender, defineForm } from '@gopowerteam/form-render'

const form = defineForm([...Array.from(Array(10), (_, index) => ({
  key: `name${index}`,
  title: `姓名${index}`,
  render: r => r.input(),
  default: 'xxxx',
})), {
  key: 'xxx123123123123123',
  title: 'zzz123123123',
  collapsed: true,
  rule: {
    required: true,
    message: 'asdasd',
  },
}])
</script>
