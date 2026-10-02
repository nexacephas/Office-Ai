export type KnowledgeStatus = 'Processing' | 'Ready' | 'Needs Review' | 'Failed' | 'Archived'
export type KnowledgeSourceType = 'Policy' | 'Procedure' | 'Guideline' | 'Report' | 'Template' | 'Manual'
export type KnowledgeVisibility = 'Only you' | 'Department' | 'Organization'

export type KnowledgeSource = {
  id: string
  title: string
  type: KnowledgeSourceType
  department: string
  owner: string
  updatedAt: string
  addedAt: string
  status: KnowledgeStatus
  collection: string
  visibility: KnowledgeVisibility
  description: string
  pagesIndexed: number
  sectionsIndexed: number
  lastIndexed: string
  relatedDocuments: string[]
  relatedPolicies: string[]
  relatedTasks: string[]
  relatedCorrespondence: string[]
  excerpt: string
  page?: number
  section?: string
  tags: string[]
}

export type KnowledgeReference = {
  documentId: string
  documentName: string
  page?: number
  section?: string
  excerpt: string
  relevance: number
  updatedAt: string
  department: string
  collection: string
}

export type KnowledgeAnswer = { question: string; answer: string; sources: KnowledgeReference[]; createdAt: string }

export type KnowledgeCollection = { id: string; name: string; description: string; sourceCount: number; updatedAt: string }

export type KnowledgeFiltersState = {
  collection: string
  department: string
  documentType: string
  updated: string
  owner: string
  status: string
  sort: 'Relevance' | 'Recently updated' | 'Newest' | 'Oldest'
}