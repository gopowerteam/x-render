import { type Column, Workbook, type Worksheet } from 'exceljs'
import { h, render } from 'vue'
import dayjs from 'dayjs'
import { getColumnValue } from '../utils'
import type {
  DataRecord,
  ExportColumnOptions,
  TableColumnsOptions,
} from '../interfaces'
import { toRenderFunction } from '../render/table-column-render'

function createWorkBook() {
  return new Workbook()
}

function createWorkSheet(workbook: Workbook, name = 'Sheet1') {
  const sheet = workbook.addWorksheet(name, {
    headerFooter: { firstHeader: '', firstFooter: '' },
  })

  return sheet
}

function setWorkSheetColumns(worksheet: Worksheet, columns: Column[]) {
  worksheet.columns = columns
}

function setWorkSheetRows(worksheet: Worksheet, rows: any[]) {
  worksheet.addRows(rows)
}

async function exportExcelFromJSON<T = any>({
  columns,
  rows,
  filename,
}: {
  columns: Column[]
  rows: T[]
  filename?: string
}) {
  const workbook = createWorkBook()
  const worksheet = createWorkSheet(workbook)
  setWorkSheetColumns(worksheet, columns)
  setWorkSheetRows(worksheet, rows)

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer])

  saveAs(blob, filename || `${dayjs().format('YYYY-MM-DD HH:mm:ss')}.xlsx`)
}

function saveAs(obj: Blob, filename: string) {
  const tmpLink = document.createElement('a')
  tmpLink.download = filename || 'download'
  tmpLink.href = URL.createObjectURL(obj)
  tmpLink.click()

  setTimeout(() => {
    URL.revokeObjectURL(tmpLink.href)
  }, 1000)
}

export function getTableRowValue(
  columns: TableColumnsOptions<any>,
  record: DataRecord,
): Record<string, any> {
  const row: Record<string, any> = {}
  const exportColumns = columns
    .filter(column => column.exportable !== false)
    .map(column => ({
      options: column,
      render: toRenderFunction(column),
      content:
        typeof column.exportable === 'object'
          ? column.exportable.content
          : undefined,
    }))

  exportColumns.forEach((column) => {
    const renderTemplate = column.render?.render
    const getRowValue = () => {
      switch (true) {
        case !!column.content:
          return column.content && column.content(record)
        case !!renderTemplate: {
          const container = document.createElement('div')
          const node = h(
            () => renderTemplate && renderTemplate({ record }),
          )
          render(node, container)
          return node.el?.innerText
        }
        default:
          return getColumnValue(record, column.options)
      }
    }

    row[column.options.key] = getRowValue()
  })

  return row
}

function transformWidth(width: string | number | undefined) {
  const ratio = 6
  switch (true) {
    case typeof width === 'number':
      return (width as number) / ratio
    case typeof width === 'string' && width.endsWith('px'):
      return parseInt((width as string).replace('px', '')) / ratio
    default:
      return 30
  }
}

function exportExcel(
  columns: TableColumnsOptions,
  source: DataRecord[],
  filename?: string,
) {
  const exportColumns = columns
    .filter(column => column.exportable !== false)
    .map(column => ({
      key: column.key,
      header:
        (column.exportable as ExportColumnOptions)?.header || column.title,
      width:
        (column.exportable as ExportColumnOptions)?.width
        || transformWidth(column.width),
    }))

  const exportRows = source.map((record) => {
    return getTableRowValue(columns, record)
  })
  exportExcelFromJSON({
    columns: exportColumns as any,
    rows: exportRows,
    filename,
  })
}

export function useExport() {
  return {
    exportExcel,
  }
}
