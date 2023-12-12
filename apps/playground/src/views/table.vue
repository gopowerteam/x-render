<template>
  <div>
    <AButton @click="() => draggable = !draggable">
      draggle toggle
    </AButton>
    <TableRender
      ref="table"
      v-model:checkbox-keys="checkboxKeys"
      v-model:checkbox-rows="checkboxRows"
      v-model:radio-key="radioKey"
      v-model:radio-row="radioRow"
      :columns="columns"
      :data-load="onTableLoad"
      :draggable="draggable"
      exportable
      :form="form"
      :form-options="{
        minWidth: 400,
      }"
      pageable="client"
      row-key="age"
      :selection="{
        type: 'checkbox',
        width: 100,
      }"
      @change="onTableChange"
    >
      <template #actions>
        <AButton type="primary">
          123adasd
        </AButton>
        <AButton type="primary">
          123adasd
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
const checkboxKeys = ref<number[]>([])
const radioRow = ref<any>()
const checkboxRows = ref<any[]>([{ age: 98 }, { age: 97 }])
interface t {
  age: string
  name: string
}

function onTableChange(...z: any) {
  console.log(z)
}
const draggable = ref(false)
const table = useTable('table')

const form = defineForm<t>([{
  key: 'age',
  title: 'age',
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
  render: r => r.date(),
}])

const columns = defineColumns<t>([{
  key: 'age',
  title: '年龄',
  width: 200,
  fixed: 'left',
  sortable: 'desc',
}, {
  key: 'image',
  title: 'image',

  render: r => r.image({
    preview: true,
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
}, {
  key: 'render',
  title: 'render',
  render: r => r.render(() => <div>123</div>),
}, {
  key: 'actions',
  width: 200,
  title: 'actions',
  fixed: 'right',
  render: r => r.button([
    {
      content: 'preview',
      confirm: true,
      onClick: () => {
        table.value.preview({ key: 1, mode: 'drawer' })
      },
    },
    {
      content: 'edit',
      onClick: (record) => {
        table.value.edit({
          key: record.age,
          form,
          onSubmit: (f) => {
            console.log('f', f)
          },
        }).then((a) => {
          console.log('z', a)
        })
      },
    },
  ]),
}])

const onTableLoad = defineTableLoad(({ form, update, page, sort }) => {
  console.log('zzz')
  if (page) {
    page.total = 1000
  }

  if (sort) {
    console.log(sort)
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      update(Array.from(Array(100), (_, i) => ({
        name: i,
        age: i === 3 ? i.toString().repeat(200) : i,
        text: i,
        image: 'https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/e08da34488b114bd4c665ba2fa520a31.svg',
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
  }, 3000)
})
</script>
