export type DocumentType = 'PDF' | 'DOCX' | 'XLSX' | 'PPTX' | 'JPG' | 'PNG'

export type DocumentStatus = 'ready' | 'processing' | 'failed'

export type DocumentScope = 'All' | 'My documents' | 'Shared with me' | 'Recent' | 'Starred'

export type DocumentView = 'list' | 'grid'

export type DocumentDateFilter = 'any' | 'week' | 'month'

export type DocumentSort = 'modified-desc' | 'modified-asc' | 'name-asc' | 'name-desc' | 'size-desc'

export type DocumentAction =
  | 'summarize'
  | 'download'
  | 'ask'
  | 'extract'
  | 'dates'
  | 'action-items'
  | 'compare'
  | 'share'
  | 'convert'
  | 'delete'
  | 'rename'
  | 'move'
  | 'retry'

export interface DocumentRecord {
  id: string
  name: string
  description: string
  referenceNumber: string
  type: DocumentType
  owner: string
  folder: string
  modifiedAt: string
  modifiedLabel: string
  createdAt: string
  size: string
  starred: boolean
  sharedWithMe: boolean
  status: DocumentStatus
  preview: string
}

export const documentFolders = [
  'Reports',
  'Memos',
  'Correspondence',
  'Meetings',
  'Policies',
  'Projects',
  'Templates',
  'Other',
] as const

export type DocumentFolder = (typeof documentFolders)[number]