<template>
  <FormRender
    id="xxxx"
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

<script setup lang="tsx">
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
  render: r => r.treeSelect({
    options: [{
      key: 1,
      title: '2',
      children: [{
        key: 2,
        title: '3',
      }],
    }],
    cache: true,
    autoSumbit: true,
    slots: {
      'footer': () => <div>123</div> as any,
      'tree-slot-title': () => <div>123</div>,
    },
  }),
}, {
  key: 'xxx1',
  title: 'xx',
  render: r => r.dateRange(),

}, {
  key: 'cascader',
  title: 'cascader',
  render: r => r.cascader({
    options: getCascaderOptions,
  }),
}])

function getCascaderOptions() {
  return [
    {
      value: 'beijing',
      label: 'Beijing',
      children: [
        {
          value: 'chaoyang',
          label: 'ChaoYang',
          children: [
            {
              value: 'datunli',
              label: 'Datunli',
            },
          ],
        },
        {
          value: 'haidian',
          label: 'Haidian',
        },
        {
          value: 'dongcheng',
          label: 'Dongcheng',
        },
        {
          value: 'xicheng',
          label: 'Xicheng',
          children: [
            {
              value: 'jinrongjie',
              label: 'Jinrongjie',
            },
            {
              value: 'tianqiao',
              label: 'Tianqiao',
            },
          ],
        },
      ],
    },
    {
      value: 'shanghai',
      label: 'Shanghai',
      children: [
        {
          value: 'huangpu',
          label: 'Huangpu',
        },
      ],
    },
  ]
}

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
  return new Promise<Map<string, string>>((resolve) => {
    setTimeout(() => {
      resolve(new Map<string, string>([['x', 'x'], ['y', 'y']]))
    }, 2000)
  })
}
</script>
