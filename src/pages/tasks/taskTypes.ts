export type TaskStatus = 'To Do' | 'In Progress' | 'Waiting' | 'Completed'

export type TaskPriority = 'Low' | 'Medium' | 'High'

export interface TaskSubtask {
  id: string
  title: string
  completed: boolean
}

export interface TaskActivity {
  id: string
  dateLabel: string
  message: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  createdDate: string
  assignee: string
  createdBy: string
  relatedDocument?: string
  notes: string
  subtasks: TaskSubtask[]
  activity: TaskActivity[]
}