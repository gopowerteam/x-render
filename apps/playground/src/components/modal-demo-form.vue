<script setup lang="ts">
import type { FieldRule } from '@arco-design/web-vue'
import { useModal } from '@gopowerteam/modal-render'
import { reactive } from 'vue'

const modal = useModal()

const formModel = reactive({
  name: '',
  email: '',
  role: '',
})

// 回归演示：弹窗内 ASelect 下拉列表的 z-index 必须高于弹窗本体，保证可正常选择
const roleOptions = [
  '管理员',
  '成员',
  '访客',
]

const formRules: Record<string, FieldRule<any> | FieldRule<any>[]> = {
  name: {
    required: true,
    message: '名称不能为空',
  },
  email: [
    {
      required: true,
      message: '邮箱不能为空',
    },
    {
      type: 'email',
      message: '邮箱格式不正确',
    },
  ],
}

// 验证通过后展示容器内 Loading，再以表单数据关闭（Promise resolve）
function onSubmitSuccess() {
  modal.showLoading({ text: '提交中...' })
  setTimeout(() => {
    modal.close({ ...formModel })
  }, 800)
}
</script>

<template>
  <AForm
    :model="formModel"
    name="form"
    :rules="formRules"
    layout="vertical"
    @submit-success="onSubmitSuccess"
  >
    <AFormItem field="name" label="名称">
      <AInput v-model="formModel.name" placeholder="请输入名称" />
    </AFormItem>
    <AFormItem field="email" label="邮箱">
      <AInput v-model="formModel.email" placeholder="请输入邮箱" />
    </AFormItem>
    <AFormItem field="role" label="角色">
      <ASelect v-model="formModel.role" :options="roleOptions" placeholder="请选择角色（验证下拉层级）" />
    </AFormItem>
  </AForm>
</template>
