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

const form = defineForm([{
  key: 'xxx',
  title: 'xxx',
  render: r => r.input(),
  rule: [{
    required: true,
    message: 'xxx',
  }],
}, {
  key: 'yyy',
  title: 'yyy',
  render: r => r.select({
    options: b,
    cache: true,
    autoSumbit: true,
  }),
}, {
  key: 'xxx1',
  title: 'xx',
  render: r => r.dateRange(),

}])

let x = 0
let y = 0

function a(): Promise<Map<string, string>> {
  return new Promise<Map<string, string>>((resolve, reject) => {
    console.log(x++)
    resolve(new Map<string, string>([['a', 'b'], ['c', 'd']]))
  })
}

function b() {
  console.log(y++)
  return new Map<string, string>([['x', 'x'], ['y', 'y']])
}
</script>
