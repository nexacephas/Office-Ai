export type SummaryStyle = 'executive' | 'key-points' | 'detailed' | 'action-oriented' | 'decision-brief'

export type SummaryLength = 'short' | 'standard' | 'detailed'

export interface SummaryFocus {
  keyPoints: boolean
  decisions: boolean
  actionItems: boolean
  deadlines: boolean
  people: boolean
  dates: boolean
  numbers: boolean
  risks: boolean
  recommendations: boolean
  requirements: boolean
}

export interface DocumentOption {
  id: string
  name: string
  type: string
  sizeLabel: string
  updatedAt: string
  pages: number
  category: 'PDF' | 'DOCX' | 'PPTX' | 'TXT' | 'Image'
  sentencePreview: string
  previewText: string
}

export interface ActionItem {
  id: string
  title: string
  owner: string
  due: string
  priority: 'High' | 'Normal' | 'Low'
}

export interface DeadlineItem {
  id: string
  date: string
  title: string
}

export interface EntityItem {
  id: string
  name: string
  mentions: number
  label: string
}

export interface SourceReference {
  id: string
  page: string
  title: string
}

export interface RelatedWorkItem {
  id: string
  type: 'task' | 'correspondence' | 'meeting'
  label: string
  route: string
}

export interface SummaryResult {
  id: string
  documentId: string
  executiveSummary: string
  keyPoints: string[]
  actionItems: ActionItem[]
  deadlines: DeadlineItem[]
  decisions: string[]
  people: EntityItem[]
  risks: string[]
  recommendations: string[]
  sources: SourceReference[]
  relatedWork: RelatedWorkItem[]
  createdAt: string
}

export interface SummaryHistoryItem {
  id: string
  documentTitle: string
  generatedAt: string
}
