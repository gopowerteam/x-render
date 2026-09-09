<script setup lang="ts">
import type { OpenModalOptions } from '@gopowerteam/modal-render'
import { useModal } from '@gopowerteam/modal-render'
import { ref } from 'vue'
import ModalDemoContent from '../components/modal-demo-content.vue'
import ModalDemoFooter from '../components/modal-demo-footer.vue'
import ModalDemoForm from '../components/modal-demo-form.vue'

const modal = useModal()

// 解构调用验证：confirm 等快捷方法不依赖 this
const { confirm: confirmAction } = modal

// Promise 回传结果展示
const resolvedData = ref<unknown>(null)

// 无表单时底部「确定」按钮的默认行为：直接关闭
function onOkClose({ close }: { close: () => void }) {
  close()
}

// hideLoading 兜底验证：无容器场景下 showLoading 后由 hideLoading 关闭
function onShowLoadingByHide() {
  modal.showLoading({ text: '由 hideLoading 兜底关闭，1.5 秒后自动隐藏' })
  setTimeout(() => {
    modal.hideLoading()
  }, 1500)
}

const drawerPositionText = {
  right: '右侧',
  left: '左侧',
  top: '顶部',
  bottom: '底部',
} as const

function openContent(title: string, options: OpenModalOptions = {}) {
  modal.open(ModalDemoContent, { content: `这是「${title}」示例。` }, { title, ...options })
}

function openDrawer(position: NonNullable<OpenModalOptions['position']>) {
  modal.open(ModalDemoContent, { content: `这是一个从${drawerPositionText[position]}滑出的抽屉。` }, {
    title: `${drawerPositionText[position]}抽屉`,
    mode: 'drawer',
    position,
    footer: true,
    onOk: onOkClose,
  })
}

function openFormResult() {
  modal.open(ModalDemoForm, {}, {
    title: '表单提交',
    footer: true,
    // 底部「确定」触发组件内 name="form" 的表单提交
    form: 'form',
    width: 420,
  }).then((data) => {
    resolvedData.value = data
  })
}

function openContentResult() {
  modal.open(ModalDemoContent, { content: '点击「关闭并回传数据」按钮，回传内容会展示在页面底部。' }, {
    title: 'Promise 数据回传',
  }).then((data) => {
    resolvedData.value = data
  })
}

function onShowLoadingManual() {
  const hide = modal.showLoading({ text: '数据加载中，2 秒后关闭' })
  setTimeout(() => hide(), 2000)
}

function onShowLoadingAuto() {
  modal.showLoading({ text: '到时自动关闭的 Loading', duration: 2000 })
}

interface DemoItem {
  label: string
  action: () => void
}

interface DemoSection {
  title: string
  description: string
  items: DemoItem[]
}

const sections: DemoSection[] = [
  {
    title: '基础弹窗',
    description: 'mode: dialog（默认），通过 options 控制头部、底部、尺寸、拖拽、全屏等形态',
    items: [
      { label: '默认弹窗', action: () => openContent('默认弹窗', { footer: true, onOk: onOkClose }) },
      { label: '自定义按钮文案', action: () => openContent('自定义按钮文案', { footer: true, submitText: '保存', cancelText: '返回', onOk: onOkClose }) },
      { label: '无头部', action: () => openContent('无头部弹窗', { header: false, footer: true, onOk: onOkClose }) },
      { label: 'ESC / 遮罩点击关闭', action: () => openContent('ESC 与遮罩关闭', { footer: true, esc: true, maskClosable: true, onOk: onOkClose }) },
      { label: '可拖拽', action: () => openContent('可拖拽弹窗', { footer: true, draggable: true, onOk: onOkClose }) },
      { label: '全屏', action: () => openContent('全屏弹窗', { footer: true, fullscreen: true, onOk: onOkClose }) },
      { label: '小尺寸', action: () => openContent('小尺寸弹窗', { size: 'small', footer: true, onOk: onOkClose }) },
      { label: '中尺寸（默认）', action: () => openContent('中尺寸弹窗', { size: 'middle', footer: true, onOk: onOkClose }) },
      { label: '大尺寸', action: () => openContent('大尺寸弹窗', { size: 'large', footer: true, onOk: onOkClose }) },
      { label: '自定义宽度', action: () => openContent('自定义宽度', { width: 320, footer: true, onOk: onOkClose }) },
      { label: '自定义底部（ModalFooter）', action: () => modal.open(ModalDemoFooter, { content: '底部按钮由 ModalFooter 渲染；可打开嵌套验证插槽锚点唯一化。' }, { title: '自定义底部' }) },
    ],
  },
  {
    title: '抽屉',
    description: 'mode: drawer，position 支持上 / 右 / 下 / 左四个方位',
    items: [
      { label: '右侧抽屉（默认）', action: () => openDrawer('right') },
      { label: '左侧抽屉', action: () => openDrawer('left') },
      { label: '顶部抽屉', action: () => openDrawer('top') },
      { label: '底部抽屉', action: () => openDrawer('bottom') },
    ],
  },
  {
    title: '消息弹窗',
    description: '内置 confirm / info / success / warning / error 五种轻量提示',
    items: [
      { label: 'confirm', action: () => modal.confirm({ content: '确认执行该操作吗？', onOk: () => console.log('已确认') }) },
      { label: 'confirm（解构调用）', action: () => confirmAction({ content: '解构调用 confirm 正常工作（不依赖 this）' }) },
      { label: 'info', action: () => modal.info({ title: '提示', content: '这是一条普通提示信息' }) },
      { label: 'success', action: () => modal.success({ title: '成功', content: '操作已成功完成' }) },
      { label: 'warning', action: () => modal.warning({ title: '警告', content: '请注意潜在的风险' }) },
      { label: 'error', action: () => modal.error({ title: '错误', content: '操作失败，请重试' }) },
    ],
  },
  {
    title: 'Promise 数据回传',
    description: '弹窗内以 close(data) 关闭时 Promise resolve；未携带数据关闭时 Promise 永远挂起，then 不会触发',
    items: [
      { label: '表单提交回传', action: openFormResult },
      { label: '组件按钮回传', action: openContentResult },
    ],
  },
  {
    title: 'Loading',
    description: 'showLoading 返回关闭函数；传入 duration 后到时自动关闭',
    items: [
      { label: '页面 Loading（手动关闭）', action: onShowLoadingManual },
      { label: '页面 Loading（自动关闭）', action: onShowLoadingAuto },
      { label: '页面 Loading（hideLoading 关闭）', action: onShowLoadingByHide },
    ],
  },
  {
    title: '移动端形态',
    description: 'mobile: auto（默认，跟随视口宽度）/ false（强制桌面形态）/ true（强制移动端底部抽屉形态）',
    items: [
      { label: '强制桌面形态', action: () => openContent('保持桌面形态', { mobile: false, footer: true, onOk: onOkClose }) },
      { label: '强制移动端形态', action: () => openContent('移动端形态', { mobile: true, footer: true, onOk: onOkClose }) },
    ],
  },
  {
    title: '嵌套与批量关闭',
    description: '弹窗内容组件中提供「打开嵌套弹窗」按钮，可在弹窗内再打开新弹窗',
    items: [
      { label: '打开嵌套演示', action: () => openContent('嵌套弹窗演示') },
      { label: '关闭全部弹窗', action: () => modal.closeAll() },
    ],
  },
]
</script>

<template>
  <div class="modal-demo">
    <header class="page-header">
      <h2>ModalRender 示例</h2>
      <p>基于 useModal 的命令式 API，演示弹窗、抽屉、消息提示、Loading 与 Promise 数据回传。</p>
    </header>

    <section v-for="section in sections" :key="section.title" class="demo-section">
      <h3>{{ section.title }}</h3>
      <p class="section-desc">
        {{ section.description }}
      </p>
      <ASpace wrap>
        <AButton
          v-for="item in section.items"
          :key="item.label"
          type="outline"
          size="small"
          @click="item.action"
        >
          {{ item.label }}
        </AButton>
      </ASpace>
    </section>

    <section v-if="resolvedData" class="demo-section">
      <h3>Promise 回传结果</h3>
      <pre class="result-view">{{ JSON.stringify(resolvedData, null, 2) }}</pre>
    </section>
  </div>
</template>

<style scoped>
.modal-demo {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}

.page-header h2 {
  margin: 0 0 8px;
}

.page-header p {
  margin: 0 0 16px;
  color: var(--color-text-3, #86909c);
}

.demo-section {
  margin-bottom: 24px;
}

.demo-section h3 {
  margin: 0 0 4px;
  font-size: 16px;
}

.section-desc {
  margin: 0 0 12px;
  font-size: 12px;
  color: var(--color-text-3, #86909c);
}

.result-view {
  margin: 0;
  padding: 12px;
  background: var(--color-fill-1, #f7f8fa);
  border-radius: 4px;
  font-size: 12px;
}
</style>
