<template>
  <AForm
    :model="formModel"
    name="form"
    :rules="formRules"
    @submit-success="onSubmit"
  >
    <AFormItem field="a" label="123123">
      <AInput v-model="formModel.a" />
    </AFormItem>
  </AForm>
  <div v-for="i in 1000" :key="i">
    test-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxx
  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">
import { reactive } from 'vue'
import { Form as AForm, type FieldRule } from '@arco-design/web-vue'
// import { onSubmit } from '../../../../packages/modal-render/dist'

const formModel = reactive({
  a: 'tt',
  b: '',
})

const formRules: Record<string, FieldRule<any>> = {
  a: {
    required: true,
    message: '不能为空',
  },
}

// onSubmit(() => {
//   console.log('zhuchentong')
// })

function onSubmit(modal) {
  console.log(modal)
}
</script>
