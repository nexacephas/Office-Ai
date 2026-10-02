export type WritingType = 'memo' | 'letter' | 'report' | 'email' | 'notice' | 'brief' | 'proposal' | 'minutes' | 'general'

export type WritingTone = 'professional' | 'formal' | 'concise' | 'friendly' | 'persuasive'

export type WritingLength = 'short' | 'standard' | 'detailed'

export type WritingAudience = 'internal' | 'management' | 'client' | 'official' | 'general'

export type DraftStatus = 'draft' | 'saved'

export type RefinementAction = 'formal' | 'concise' | 'expand' | 'clarity' | 'grammar' | 'rewrite' | 'tone' | 'summarize'

export interface WritingSettings {
  tone: WritingTone
  length: WritingLength
  audience: WritingAudience
  language: string
  useOrganizationStyle: boolean
}

export interface DraftDocument {
  id: string
  title: string
  type: WritingType
  content: string
  status: DraftStatus
  updatedAt: string
}

export interface WritingContextItem {
  id: string
  name: string
  type: 'document' | 'correspondence' | 'meeting' | 'reference'
  detail: string
}

export interface WritingTemplate {
  id: string
  title: string
  type: WritingType
  category: 'Official' | 'Administrative' | 'Reports' | 'Communication' | 'Meetings'
  description: string
  prompt: string
  outline: string[]
}