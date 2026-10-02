export type ConversionToolId =
  | 'pdf-to-word'
  | 'word-to-pdf'
  | 'pdf-to-excel'
  | 'excel-to-pdf'
  | 'ppt-to-pdf'
  | 'image-to-pdf'
  | 'ocr-scan'
  | 'merge-pdf'
  | 'split-pdf'
  | 'compress-pdf'

export interface ConversionTool {
  id: ConversionToolId
  title: string
  description: string
  output: string
  icon: string
  category: string
}

export interface UploadedFileMeta {
  id: string
  name: string
  type: string
  sizeLabel: string
  pages?: number
  category: 'PDF' | 'DOCX' | 'XLSX' | 'PPTX' | 'PNG' | 'JPG' | 'TXT'
}

export interface ConversionResult {
  id: string
  originalName: string
  convertedName: string
  originalType: string
  convertedType: string
  sizeLabel: string
  pages: number
  createdAt: string
}

export interface ConversionHistoryItem {
  id: string
  file: string
  conversion: string
  status: 'Completed' | 'Processing' | 'Failed'
  date: string
  size: string
  outputType: string
}

export interface ProcessingQueueItem {
  id: string
  file: string
  operation: string
  progress: number
  status: string
}

export interface BatchItem {
  id: string
  file: string
  inputType: string
  outputType: string
  status: 'Queued' | 'Ready'
}

export interface ConversionSettingsState {
  outputFormat: string
  mode?: string
  preserveLayout?: boolean
  extractTextOnly?: boolean
  detectTables?: boolean
  preserveStructure?: boolean
  pageSize?: string
  orientation?: string
  margins?: string
  language?: string
  resultType?: string
}
