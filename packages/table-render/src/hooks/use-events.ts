export type TableEvent = 'export' | 'reload' | 'preview' | 'edit'

export interface TableReloadEventOptions {
  reset?: boolean
}

export interface TablePreviewEventOptions {
  key: string | number
  mode: 'dialog' | 'drawer'
  title?: string
}

export interface TableExportEventOptions {}

export interface TableEditEventOptions {}

export interface EventEmits {
  (event: 'reload', options?: TableReloadEventOptions): void
  (event: 'preview', options?: TablePreviewEventOptions): void
  (event: 'export', options?: TableExportEventOptions): void
  (event: 'edit', options?: TableEditEventOptions): void
  (event: TableEvent, options?: TableExportEventOptions | TableReloadEventOptions | TablePreviewEventOptions | TableEditEventOptions): void
}

export function useEvents(events: {
  reload: (options?: TableReloadEventOptions) => void
  export: (options?: TableExportEventOptions) => void
  preview: (options?: TablePreviewEventOptions) => void
  edit: (options?: TableEditEventOptions) => void
}): EventEmits {
  return (event, options) => events[event](options as any)
}
