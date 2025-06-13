<template>
  <div style="height:355px;overflow: auto;">
    <AForm :model="formModel" @submit-success="onSubmit">
      <AFormItem>
        <TableRender :columns="columns" :data-load="onDataLoad" />
      </AFormItem>
      <AFormItem>
        <button type="submit">
          submit
        </button>
      </AFormItem>
    </AForm>
  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">
import { defineColumns, defineTableLoad } from '@gopowerteam/table-render'
import { reactive } from 'vue'

const formModel = reactive({
  a: 'tt',
  b: '',
})

const columns = defineColumns([{
  title: 'actions',
  key: 'actions',
  render: r => r.button([
    {
      content: 'aaa',
      confirm: true,
    },
  ]),
}])

const onDataLoad = defineTableLoad(({ update }) => {
  update([{ actions: 1 }])
})

// const formRules: Record<string, FieldRule<any>> = {
//   a: {
//     required: true,
//     message: '不能为空',
//   },
// }

function onSubmit() {
  console.log('onSubmit')
}

// // function onSubmitSuccess() {
// }
</script>
