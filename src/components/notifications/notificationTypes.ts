export type NotificationType =
  | 'Tasks'
  | 'Approvals'
  | 'Correspondence'
  | 'Meetings'
  | 'Documents'
  | 'Files & Registry'
  | 'AI'
  | 'System'

export type NotificationPriority = 'Urgent' | 'High' | 'Normal' | 'Low'

export type NotificationRecord = {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: string
  read: boolean
  actionRequired: boolean
  priority: NotificationPriority
  relatedType: string
  relatedId: string
  route: string
  actor: string
  activity: string[]
  mention?: boolean
  archived?: boolean
}

export type NotificationTab = 'All' | 'Unread' | 'Action Required' | 'Mentions' | 'System'