<template>
  <div>
    <TableRender
      ref="table"
      v-model:checkbox-keys="checkboxKeys"
      v-model:checkbox-rows="checkboxRows"
      v-model:radio-key="radioKey"
      v-model:radio-row="radioRow"
      :columns="columns"
      exportable
      :load-data="onTableLoad"
      pagination
      row-key="age"
      :selection="{
        type: 'checkbox',
        width: 100,
      }"
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
import { TableRender, defineColumns, defineTableLoad, useTable } from '@gopowerteam/table-render'
import { defineForm } from '@gopowerteam/form-render'
import { ref } from 'vue'

const radioKey = ref<number>()
const checkboxKeys = ref<number[]>([])
const radioRow = ref<any>()
const checkboxRows = ref<any[]>([])
interface t {
  age: string
  name: string
}

const table = useTable('table')

const form = defineForm([{
  key: 'age',
  title: 'age',
  render: r => r.input({ type: 'number' }),
  rule: [{
    required: true,
    message: 'asdasd',
  }],
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
      onClick: () => {
        table.value.edit({
          key: 1,
          form,
          onSubmit: () => {
            //
          },
        }).then(() => {
          // console.log('z', a)
        })
      },
    },
  ]),
}])

const onTableLoad = defineTableLoad(({ form, update, page, sort }) => {
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
</script>
