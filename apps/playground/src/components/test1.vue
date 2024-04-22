<template>
  <div style="height:355px;overflow: auto;">
    <AForm
      :model="formModel"
      name="form"
      :rules="formRules"
      @submit-success="onSubmitSuccess"
    >
      <AFormItem field="a" label="123123">
        <AInput v-model="formModel.a" />
      </AFormItem>
    </AForm>
    <div v-for="i in 200" :key="i" style="width:2000px;">
      test-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxxtest-1xxxx
    </div>
  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">
import { reactive } from 'vue'
import { Form as AForm, type FieldRule } from '@arco-design/web-vue'
import { onSubmit } from '@gopowerteam/modal-render'

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

onSubmit((modal) => {
  modal.showLoading()
  // modal.close('aaa')
})

function onSubmitSuccess() {
}
</script>
