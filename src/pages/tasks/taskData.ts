import type { Task } from './taskTypes'

function dateOffset(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const yesterday = dateOffset(-1)
const today = dateOffset(0)
const tomorrow = dateOffset(1)
const friday = dateOffset((5 - new Date().getDay() + 7) % 7 || 7)
const nextWeek = dateOffset(8)

export const mockTasks: Task[] = [
  {
    id: 'task-transport-report',
    title: 'Prepare Q3 Transport Report',
    description: 'Compile department figures and prepare the final report for submission.',
    status: 'In Progress',
    priority: 'High',
    dueDate: today,
    createdDate: yesterday,
    assignee: 'Cephas',
    createdBy: 'Cephas',
    relatedDocument: 'Q3 Transport Report.docx',
    notes: 'Use the latest figures from Fleet Operations before submitting.',
    subtasks: [
      { id: 'transport-figures', title: 'Gather department figures', completed: true },
      { id: 'transport-review', title: 'Review previous report', completed: true },
      { id: 'transport-draft', title: 'Complete final draft', completed: false },
      { id: 'transport-submit', title: 'Submit report', completed: false },
    ],
    activity: [
      { id: 'transport-activity-1', dateLabel: 'Today', message: 'You changed status to In Progress' },
      { id: 'transport-activity-2', dateLabel: 'Yesterday', message: 'Task was created' },
    ],
  },
  {
    id: 'task-correspondence',
    title: 'Review Incoming Correspondence',
    description: 'Review and classify newly received departmental correspondence.',
    status: 'To Do',
    priority: 'Medium',
    dueDate: tomorrow,
    createdDate: yesterday,
    assignee: 'Cephas',
    createdBy: 'Sarah Chen',
    relatedDocument: 'Correspondence register',
    notes: 'Flag urgent items for the department director.',
    subtasks: [],
    activity: [
      { id: 'correspondence-activity-1', dateLabel: 'Yesterday', message: 'Task was assigned to you' },
    ],
  },
  {
    id: 'task-approval-follow-up',
    title: 'Follow Up on Approval Request',
    description: 'Check the status of the pending procurement approval.',
    status: 'Waiting',
    priority: 'High',
    dueDate: yesterday,
    createdDate: dateOffset(-3),
    assignee: 'Cephas',
    createdBy: 'Cephas',
    relatedDocument: 'Procurement request PR-2048.pdf',
    notes: 'Finance is reviewing the updated cost estimate.',
    subtasks: [],
    activity: [
      { id: 'approval-activity-1', dateLabel: 'Yesterday', message: 'Waiting on Finance approval' },
      { id: 'approval-activity-2', dateLabel: 'Monday', message: 'Task was created' },
    ],
  },
  {
    id: 'task-meeting-brief',
    title: 'Prepare Meeting Brief',
    description: "Prepare talking points and supporting documents for Friday's meeting.",
    status: 'In Progress',
    priority: 'Medium',
    dueDate: friday,
    createdDate: dateOffset(-2),
    assignee: 'Cephas',
    createdBy: 'Cephas',
    relatedDocument: 'Operations review agenda.docx',
    notes: '',
    subtasks: [
      { id: 'meeting-agenda', title: 'Review the meeting agenda', completed: true },
      { id: 'meeting-talking-points', title: 'Draft talking points', completed: false },
    ],
    activity: [
      { id: 'meeting-activity-1', dateLabel: 'Today', message: 'You started working on this task' },
    ],
  },
  {
    id: 'task-archive-documents',
    title: 'Archive Completed Documents',
    description: 'Organize completed files and move them to the appropriate archive.',
    status: 'To Do',
    priority: 'Low',
    dueDate: nextWeek,
    createdDate: dateOffset(-1),
    assignee: 'Jordan Lee',
    createdBy: 'Cephas',
    relatedDocument: 'Archive checklist.xlsx',
    notes: 'Follow the 2026 records retention schedule.',
    subtasks: [],
    activity: [
      { id: 'archive-activity-1', dateLabel: 'Yesterday', message: 'Task was assigned to Jordan' },
    ],
  },
  {
    id: 'task-monthly-report',
    title: 'Submit Monthly Department Report',
    description: 'Collect team updates and submit the monthly operational summary.',
    status: 'To Do',
    priority: 'Medium',
    dueDate: nextWeek,
    createdDate: today,
    assignee: 'Cephas',
    createdBy: 'Sarah Chen',
    relatedDocument: 'Monthly department report.docx',
    notes: '',
    subtasks: [],
    activity: [{ id: 'monthly-activity-1', dateLabel: 'Today', message: 'Task was created' }],
  },
  {
    id: 'task-vendor-response',
    title: 'Send Vendor Contract Response',
    description: 'Confirm the revised delivery terms with the procurement vendor.',
    status: 'Waiting',
    priority: 'Low',
    dueDate: today,
    createdDate: dateOffset(-2),
    assignee: 'Cephas',
    createdBy: 'Cephas',
    relatedDocument: 'Vendor contract revision.pdf',
    notes: 'Vendor is expected to provide revised language this afternoon.',
    subtasks: [],
    activity: [{ id: 'vendor-activity-1', dateLabel: 'Yesterday', message: 'Response requested from vendor' }],
  },
  {
    id: 'task-policy-review',
    title: 'Review Updated Travel Policy',
    description: 'Check the revised travel guidance and share any department feedback.',
    status: 'Completed',
    priority: 'Low',
    dueDate: dateOffset(-2),
    createdDate: dateOffset(-5),
    assignee: 'Cephas',
    createdBy: 'Jordan Lee',
    relatedDocument: 'Travel policy v2.pdf',
    notes: 'Feedback was sent to People Operations.',
    subtasks: [],
    activity: [{ id: 'policy-activity-1', dateLabel: 'Yesterday', message: 'You marked this task complete' }],
  },
]

export async function loadMockTasks(): Promise<Task[]> {
  return mockTasks.map((task) => ({
    ...task,
    subtasks: task.subtasks.map((subtask) => ({ ...subtask })),
    activity: task.activity.map((activity) => ({ ...activity })),
  }))
}