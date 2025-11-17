<template>
  <FormRender
    id="xxxx"
    collapsed-mode="dialog"
    :form="form"
    layout="horizontal"
    resetable
    searchable
    @submit="aaa"
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
import { ref } from 'vue'

const aaaa = ref<Map<string, string>>(new Map())

setTimeout(() => {
  aaaa.value = new Map([
    ['a', 'aaa'],
    ['b', 'bbb'],
  ])
}, 5000)

const form = defineForm([
  {
    key: 'radio',
    title: 'radio',
    hideLabel: true,
    default: 'b',
    span: 12,
    render: r => r.radio({
      type: 'button',
      size: 'large',
      options: aaaa,
    }),
  },
  {
    key: 'xxx',
    title: 'xxx',
    // group: ['xx'],
    render: r => r.input({
      autoSubmit: true,
      clearable: true,
    }),

  }, {
    key: 'switch',
    title: 'switch',
    default: false,
    render: r => r.switch(),
  }, {
    key: 'select',
    title: 'select',
    render: r => r.select({
      multiple: true,
      options: new Map([
        ['a', 'aaa'],
        ['b', 'bbb'],
      ]),
    }),
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
      autoSubmit: true,
      treeProps: {
        defaultExpandAll: true,
      },
      slots: {
        'footer': () => (<div>123</div>),
        'tree-slot-title': () => (<div>123</div>),
      },
    }),
  }, {
    key: 'xxx1',
    title: 'xx-date',
    render: r => r.dateRange({
      autoSubmit: true,
    }),
  }, {
    key: 'xxx2',
    title: 'xx',
    render: r => r.date({
      type: 'date',
    }),

  }, {
    key: 'amount',
    title: 'amount',
    render: r => r.currency({
      inputUnit: '元',
      outputUnit: '分',
    }),

  }, {
    key: 'cascader',
    title: 'cascader',
    render: r => r.cascader({
      pathMode: true,
      multiple: true,
      options: getCascaderOptions,
    }),
  }])

function aaa(...a: any) {
  console.log(a, 'on-submit')
}

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

// const x = 0
// const y = 0

// function a(): Promise<Map<string, string>> {
//   return new Promise<Map<string, string>>((resolve, reject) => {
//     console.log(x++)
//     resolve(new Map<string, string>([['a', 'b'], ['c', 'd']]))
//   })
// }

// function b() {
//   console.log(y++)
//   return new Promise<Map<string, string>>((resolve) => {
//     setTimeout(() => {
//       resolve(new Map<string, string>([['x', 'x'], ['y', 'y']]))
//     }, 2000)
//   })
// }
</script>
