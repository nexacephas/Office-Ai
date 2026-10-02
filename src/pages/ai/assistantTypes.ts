export type MessageRole = 'user' | 'assistant'

export type SourceType = 'document' | 'task' | 'meeting' | 'correspondence'

export interface SourceReference {
  id: string
  type: SourceType
  title: string
  metadata?: string
  route: string
}

export interface AssistantBlock {
  type: 'paragraph' | 'section' | 'task' | 'draft' | 'note'
  heading?: string
  text?: string
  items?: string[]
  title?: string
  owner?: string
  due?: string
  priority?: string
}

export interface AssistantAction {
  id: string
  label: string
  kind: 'navigate' | 'create-task' | 'copy' | 'ask'
  route?: string
  taskTitle?: string
  due?: string
  priority?: string
}

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: string
  blocks?: AssistantBlock[]
  sources?: SourceReference[]
  actions?: AssistantAction[]
  suggestions?: string[]
  attachments?: AttachmentChip[]
}

export interface Conversation {
  id: string
  title: string
  updatedAt: string
  messages: ChatMessage[]
  archived?: boolean
}

export interface AttachmentChip {
  id: string
  name: string
  type: string
  size: string
}