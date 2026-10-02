import type { BatchItem, ConversionHistoryItem, ConversionSettingsState, ConversionTool, ConversionToolId, ProcessingQueueItem } from './convertTypes'

export const conversionTools: ConversionTool[] = [
  { id: 'pdf-to-word', title: 'PDF → Word', description: 'Turn PDF documents into editable Word files.', output: 'DOCX', icon: 'pdf', category: 'Document conversion' },
  { id: 'word-to-pdf', title: 'Word → PDF', description: 'Create professional PDF documents from Word files.', output: 'PDF', icon: 'word', category: 'Document conversion' },
  { id: 'pdf-to-excel', title: 'PDF → Excel', description: 'Extract tables and structured data into Excel.', output: 'XLSX', icon: 'excel', category: 'Data extraction' },
  { id: 'excel-to-pdf', title: 'Excel → PDF', description: 'Prepare spreadsheets for sharing and official distribution.', output: 'PDF', icon: 'excel', category: 'Spreadsheet' },
  { id: 'ppt-to-pdf', title: 'PowerPoint → PDF', description: 'Convert presentations into portable PDF documents.', output: 'PDF', icon: 'ppt', category: 'Presentation' },
  { id: 'image-to-pdf', title: 'Image → PDF', description: 'Combine images or scans into a PDF.', output: 'PDF', icon: 'image', category: 'Image processing' },
  { id: 'ocr-scan', title: 'OCR & Scan', description: 'Turn scanned documents and images into searchable, editable text.', output: 'DOCX', icon: 'ocr', category: 'OCR' },
  { id: 'merge-pdf', title: 'Merge PDF', description: 'Combine multiple PDF documents into one file.', output: 'PDF', icon: 'merge', category: 'Document assembly' },
  { id: 'split-pdf', title: 'Split PDF', description: 'Separate selected pages into individual documents.', output: 'PDF', icon: 'split', category: 'Document assembly' },
  { id: 'compress-pdf', title: 'Compress PDF', description: 'Reduce PDF size while keeping documents readable.', output: 'PDF', icon: 'compress', category: 'Optimization' },
]

export const defaultSettingsByTool: Record<ConversionToolId, ConversionSettingsState> = {
  'pdf-to-word': {
    outputFormat: 'DOCX',
    mode: 'Editable document',
    preserveLayout: true,
    extractTextOnly: false,
  },
  'word-to-pdf': {
    outputFormat: 'PDF',
    mode: 'High quality',
    preserveLayout: true,
  },
  'pdf-to-excel': {
    outputFormat: 'XLSX',
    detectTables: true,
    preserveStructure: true,
  },
  'excel-to-pdf': {
    outputFormat: 'PDF',
    preserveStructure: true,
  },
  'ppt-to-pdf': {
    outputFormat: 'PDF',
    pageSize: 'A4',
    orientation: 'Landscape',
    margins: 'Standard',
  },
  'image-to-pdf': {
    outputFormat: 'PDF',
    pageSize: 'A4',
    orientation: 'Portrait',
    margins: 'Standard',
  },
  'ocr-scan': {
    outputFormat: 'DOCX',
    language: 'English',
    resultType: 'Searchable PDF',
  },
  'merge-pdf': {
    outputFormat: 'PDF',
    mode: 'Combined',
  },
  'split-pdf': {
    outputFormat: 'PDF',
    mode: 'Selected pages',
  },
  'compress-pdf': {
    outputFormat: 'PDF',
    mode: 'Balanced',
  },
}

export const recentConversions: ConversionHistoryItem[] = [
  { id: 'rc-1', file: 'Annual Budget.pdf', conversion: 'PDF → Excel', status: 'Completed', date: 'Today, 10:42 AM', size: '3.8 MB', outputType: 'XLSX' },
  { id: 'rc-2', file: 'Staff Notice.docx', conversion: 'Word → PDF', status: 'Completed', date: 'Today, 9:15 AM', size: '1.2 MB', outputType: 'PDF' },
  { id: 'rc-3', file: 'Scanned Memo.pdf', conversion: 'OCR → Word', status: 'Completed', date: 'Yesterday', size: '5.6 MB', outputType: 'DOCX' },
  { id: 'rc-4', file: 'Project Brief.pptx', conversion: 'PowerPoint → PDF', status: 'Completed', date: 'Yesterday', size: '8.4 MB', outputType: 'PDF' },
]

export const processingQueue: ProcessingQueueItem[] = [
  { id: 'pq-1', file: 'Procurement_Report.pdf', operation: 'PDF → Word', progress: 68, status: 'Converting...' },
  { id: 'pq-2', file: 'Operations_Notes.pdf', operation: 'OCR → Word', progress: 42, status: 'Reading document...' },
]

export const batchItems: BatchItem[] = [
  { id: 'batch-1', file: 'Management_Report_Q3.pdf', inputType: 'PDF', outputType: 'DOCX', status: 'Queued' },
  { id: 'batch-2', file: 'Business_Travel_Expenses.xlsx', inputType: 'XLSX', outputType: 'PDF', status: 'Ready' },
  { id: 'batch-3', file: 'Board_Deck.pptx', inputType: 'PPTX', outputType: 'PDF', status: 'Queued' },
]

export const exampleHistory: ConversionHistoryItem[] = [
  ...recentConversions,
  { id: 'history-5', file: 'Transport_Project_Brief.pdf', conversion: 'PDF → Word', status: 'Processing', date: 'Today, 11:20 AM', size: '2.1 MB', outputType: 'DOCX' },
  { id: 'history-6', file: 'Departmental_Budget.xlsx', conversion: 'Excel → PDF', status: 'Failed', date: 'Mon', size: '4.5 MB', outputType: 'PDF' },
]
