import type { Meta, StoryObj } from '@storybook/vue3'

import UseModal from '../components/use-modal.vue'
import '@gopowerteam/modal-render/dist/style.css'
// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: 'Example/Modal',
  component: UseModal,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'middle', 'large'] },
  },
  args: {
    header: true,
    draggable: true,
    title: 'Base Demo',
    size: 'middle',
    closeable: true,
    esc: true,
    maskClosable: true,
  }, // default value
} satisfies Meta<typeof UseModal>

export default meta
type Story = StoryObj<typeof meta>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */
export const Draggable: Story = {
  args: {
    draggable: true,
  },
}

export const Footer: Story = {
  args: {
    footer: true,
    title: 'Footer Demo',
  },
}

// export const Large: Story = {
//   args: {
//     label: 'Button',
//     size: 'large',
//   },
// };

// export const Small: Story = {
//   args: {
//     label: 'Button',
//     size: 'small',
//   },
// };
