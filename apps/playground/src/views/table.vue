<template>
  <div>
    <TableRender
      ref="table"
      :columns="columns"
      :load-data="onTableLoad"
      row-key="age"
    />
  </div>
</template>

<style scoped>

</style>

<script setup lang="tsx">
import { TableRender, defineColumns, defineTableLoad, useTable } from '@gopowerteam/table-render'

interface t {
  age: string
  name: string
}

const table = useTable('table')

const columns = defineColumns<t>([{
  key: 'age',
  title: '年龄',
  width: 200,
  fixed: 'left',
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
  render: r => r.button({
    content: 'asdasd',
    confirm: true,
    onClick: (record) => {
      table.value.preview({ key: 1 })
    },
  }),
}])

const onTableLoad = defineTableLoad(({ form, update }) => {
  update(Array.from(Array(100), (_, i) => ({
    name: i,
    age: i === 3 ? i.toString().repeat(200) : i,
    text: i,
    image: 'https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/e08da34488b114bd4c665ba2fa520a31.svg',
  })))
})
</script>
