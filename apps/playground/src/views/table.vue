<template>
  <div>
    <AButton @click="() => draggable = !draggable">
      draggle toggle
    </AButton>
    <TableRender
      ref="table"
      v-model:checkbox-keys="checkboxKeys"
      v-model:radio-key="radioKey"
      v-model:radio-row="radioRow"
      alway-show-pagination
      auto-fill
      collapsable
      :columns="columns"
      :columns-groups="[{
        title: 'group1',
        children: [{
          key: 'price',
        }, {
          key: 'image',
        }],
      }]"
      :data-load="onTableLoad"
      :draggable="draggable"
      exportable
      :form="form"
      :form-options="{
        minWidth: 400,
      }"
      pageable
      refreshable
      :row-class="() => 'tt'"
      row-key="age"
      :selection="{
        type: 'checkbox',
        width: 100,
      }"
      @change="onTableChange"
    >
      <template #actions>
        <AButton type="primary" @click="a">
          123adasd
        </AButton>
        <AButton type="primary" @click="b">
          clear selected
        </AButton>
      </template>
      <template #form-actions>
        <AButton @click="console.log(123)">
          button1
        </AButton>
      </template>
    </TableRender>
    radio:{{ radioKey }}
    checkbox:{{ checkboxKeys }}
    radio:{{ radioRow }}
    checkbox:{{ checkboxRows }}
  </div>
</template>

<style scoped>

</style>

<script setup lang="tsx">
import { defineColumns, defineTableLoad, useTable } from '@gopowerteam/table-render'
import { defineForm } from '@gopowerteam/form-render'
import { onMounted, ref } from 'vue'

const radioKey = ref<number>()
const checkboxKeys = ref<string[]>(['99'])
const radioRow = ref<any>()
const checkboxRows = ref<any[]>([{ age: 99 }])
interface t {
  age: string
  name: string
}
const xx = ref<any>(new Map())
function onTableChange(...z: any) {
  console.log(z)
}
const draggable = ref(false)
const table = useTable('table')

const a1 = ref('1')

function a() {
  a1.value = '2'
  // table.value.resetSelection()
  table.value.reloadColumns()
  table.value.reload().then(() => {
    console.log('ok111')
  })
}

function b() {
  checkboxKeys.value = []
  // checkboxRows.value = [{ age: '99' }]
  table.value.reloadSelection()
}
const form = defineForm<t>([{
  key: 'age',
  title: 'age',
  hideLabel: true,
  render: r => r.input({ type: 'number' }),
  rule: [{
    required: true,
    message: 'asdasd',
  }],
}, {
  key: 'test',
  title: 'xxx',
  render: r => r.select({ options: new Map([['a', 'b'], ['c', 'd']]) }),
}, {
  key: 'test1',
  title: 'xxx2',
  hideLabel: true,
  render: r => r.date(),
}, {
  key: 'yyy',
  title: 'yyy',
  hideLabel: true,
  render: r => r.select({
    options: xx,
    cache: true,
    autoSubmit: true,
  }),
}, {
  key: 'tree1',
  title: 'tree',
  hideLabel: true,
  render: r => r.treeSelect({
    options: [{
      key: 'a',
      title: 'b',
      children: [{
        key: 'c',
        title: 'd',
        children: [
          {
            key: 'e',
            title: 'f',
          },
        ],
      }],
    }],
  }),
}])

const columns = defineColumns<t>([
  {
    key: 'serial',
    title: '序号',
    render: r => r.serial(),
  }, {
    key: 'age',
    title: '年龄',
    width: 200,
    fixed: 'left',
    sortable: 'desc',
  }, {
    key: 'price',
    title: 'price',
    index: 'price.value',
    render: r => r.currency({
      inputUnit: '分',
      outputUnit: '元',
      precision: 2,
    }),
  }, {
    key: 'phone',
    title: 'phone',
    index: 'phone',
    width: 200,
    render: r => r.phone({
      safe: true,
      allowCopy: true,
      allowDial: true,
      allowPreview: true,
    }),
  }, {
    key: 'progress',
    title: 'progress',
    index: 'progress',
    width: 200,
    render: r => r.progress(),
  }, {
    key: 'image',
    title: 'image',
    // visiable: () => a1.value === '2',
    render: r => r.image({
      preview: true,
      size: 100,
    }),
  }, { key: 'a', title: 'a' }, { key: 'b', title: 'b' }, { key: 'c', title: 'c' }, { key: 'd', title: 'd' }, { key: 'e', title: 'e' }, {
    key: 'name',
    title: '名称',
    width: 200,
    form: true,
    sortable: 'asc',
    formatter: record => `${record.name}x`,
  }, {
    key: 'text',
    title: 'text',
    render: r => r.dict({
      dict: new Map([[3, 'xxx']]),
      tag: 'success',
    }),
  },
  {
    key: 'render',
    title: 'render',
    render: r => r.render(() => <div>123</div>),
  },
  {
    key: 'tags',
    title: 'tags',
    render: r => r.tag({
      formatter: record => [`${record.name}`],
    }),
  },
  {
    key: 'actions',
    title: 'xx',
    width: 200,
    render: r => r.dropdown({
      content: 'asd',
      options: [
        {
          content: 'preview',
          confirm: true,
          visiable: record => record.age === '99',
          onClick: () => {
            table.value.preview({ key: 1, mode: 'drawer' })
          },
        },
        {
          content: 'edit',
          visiable: record => record.age === '99',
          onClick: (record) => {},
        },
      ],
    }),
  },
// {
//   key: 'actions',
//   width: 200,
//   title: 'actions',
//   fixed: 'right',
//   render: r => r.button([
//     {
//       content: 'preview',
//       confirm: true,
//       visiable: record => record.age === '99',
//       onClick: () => {
//         table.value.preview({ key: 1, mode: 'drawer' })
//       },
//     },
//     {
//       content: 'edit',
//       visiable: record => record.age === '99',
//       onClick: (record) => {
//         table.value.edit({
//           key: record.age,
//           form,
//           onSubmit: (f) => {
//             console.log('f', f)
//           },
//         }).then((a) => {
//           console.log('z', a)
//         })
//       },
//     },
//   ]),
// }
])
let y = 0
function c() {
  console.log(y++)
  return new Promise<Map<string, string>>((resolve) => {
    setTimeout(() => {
      resolve(new Map<string, string>([['x', 'x'], ['y', 'y']]))
    }, 2000)
  })
}

const onTableLoad = defineTableLoad(({ form, update, page, sort }) => {
  if (page) {
    page.total = 10
  }

  if (sort) {
    console.log(sort)
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      update(Array.from(Array(100), (_, i) => ({
        name: i,
        age: i === 3 ? i.toString().repeat(200) : i.toString(),
        text: i,
        phone: `180${Math.random().toString().slice(2, 10)}`,
        progress: Math.random(),
        price: {
          value: 10099,
        },
        image: 'https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/e08da34488b114bd4c665ba2fa520a31.svg',
        tags: ['1', '22', '33'],
      })))
      resolve(true)
    }, 1000)
  })
})

onMounted(() => {
  setTimeout(() => {
    console.log(table.value.formInstance)
    table.value.formInstance?.updateFormField('test', 'c')
    console.log(table.value.formSource)
    xx.value = new Map<string, string>([['c', 'c'], ['ya', 'ya']])
  }, 3000)

  setTimeout(() => {
    xx.value = new Map<string, string>([['dd', 'dd'], ['yaa', 'yaa']])
  }, 5000)
})
</script>
