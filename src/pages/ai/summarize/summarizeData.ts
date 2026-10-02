import type { DocumentOption, SummaryFocus, SummaryHistoryItem, SummaryResult, SummaryStyle } from './summarizeTypes'

export const summaryStyles: Array<{ id: SummaryStyle; title: string; description: string }> = [
  { id: 'executive', title: 'Executive Summary', description: 'Understand the document in a few paragraphs.' },
  { id: 'key-points', title: 'Key Points', description: 'Get the most important points quickly.' },
  { id: 'detailed', title: 'Detailed Summary', description: 'Preserve more context and supporting information.' },
  { id: 'action-oriented', title: 'Action-Oriented', description: 'Focus on tasks, responsibilities and deadlines.' },
  { id: 'decision-brief', title: 'Decision Brief', description: 'Focus on decisions, risks and information needed for action.' },
]

export const focusOptions = [
  'Key points',
  'Decisions',
  'Action items',
  'Deadlines',
  'Names & people',
  'Dates',
  'Numbers',
  'Risks',
  'Recommendations',
  'Requirements',
] as const

export const defaultFocus: SummaryFocus = {
  keyPoints: true,
  decisions: false,
  actionItems: true,
  deadlines: true,
  people: false,
  dates: false,
  numbers: false,
  risks: false,
  recommendations: false,
  requirements: false,
}

export const recentDocuments: DocumentOption[] = [
  {
    id: 'q3-department-report',
    name: 'Q3 Department Activity Report',
    type: 'PDF report',
    sizeLabel: '4.2 MB',
    updatedAt: 'Updated 2 hours ago',
    pages: 14,
    category: 'PDF',
    sentencePreview: 'The department completed several projects during Q3 while also managing review cycles and outstanding submissions.',
    previewText: 'Q3 Department Activity Report\n\nThe department completed several projects during Q3 while also managing review cycles and outstanding submissions. Key workstreams included transport monitoring, service continuity, and cross-department coordination.\n\nThe team also identified several operational challenges related to reporting delays and follow-up actions. These issues required additional validation and ownership tracking across departments.\n\nKey priorities for the next reporting cycle include early submission of financial and operational statistics, review of outstanding correspondence, and finalization of pending action items before the next coordination meeting.',
  },
  {
    id: 'management-minutes',
    name: 'Management Meeting Minutes',
    type: 'DOCX meeting notes',
    sizeLabel: '1.4 MB',
    updatedAt: 'Updated yesterday',
    pages: 7,
    category: 'DOCX',
    sentencePreview: 'The leadership team agreed to review action items, extend some reporting timelines, and confirm owners for the next cycle.',
    previewText: 'Management Meeting Minutes\n\nThe leadership team agreed to review action items, extend some reporting timelines, and confirm owners for the next cycle.\n\nA series of operational changes were approved, and follow-up meetings were scheduled for staffing and reporting coordination.\n\nThe team emphasized readiness and communication across departments to reduce reporting delays and improve accountability.',
  },
  {
    id: 'transport-policy',
    name: 'Transport Policy Review',
    type: 'PDF policy review',
    sizeLabel: '2.9 MB',
    updatedAt: 'Updated Sep 28',
    pages: 12,
    category: 'PDF',
    sentencePreview: 'The review recommends revised process controls, clearer line-of-accountability, and a more structured approval pathway.',
    previewText: 'Transport Policy Review\n\nThe review recommends revised process controls, clearer line-of-accountability, and a more structured approval pathway.\n\nThe document proposes new controls for service continuity, escalation, and departmental reporting responsibilities. It also sets out a timeline for implementation and a review structure to support governance decisions.',
  },
]

export const summaryHistory: SummaryHistoryItem[] = [
  { id: 'history-1', documentTitle: 'Q3 Department Activity Report', generatedAt: 'Generated today' },
  { id: 'history-2', documentTitle: 'Management Meeting Minutes', generatedAt: 'Generated yesterday' },
  { id: 'history-3', documentTitle: 'Transport Policy Review', generatedAt: 'Generated Sep 28' },
]

export function createMockSummaryResult(documentId: string, style: SummaryStyle): SummaryResult {
  const isActionFocused = style === 'action-oriented' || style === 'decision-brief'

  return {
    id: `summary-${Date.now()}`,
    documentId,
    executiveSummary:
      'The report outlines the department\'s activities for Q3, including ongoing projects, completed initiatives, operational challenges, and upcoming priorities. The most important points are the need to submit outstanding statistics before the next review, the need to resolve pending correspondence, and the need to maintain clear accountability for follow-up actions.',
    keyPoints: [
      'Three major projects remain active and require continued coordination across departments.',
      'Two departmental reports are awaiting submission and should be finalized before the next review cycle.',
      'The next reporting deadline is October 3, with the departmental review taking place on October 5.',
      'Several outstanding tasks require follow-up, especially around correspondence and assigned ownership.',
    ],
    actionItems: [
      { id: 'task-submit-stats', title: 'Submit Q3 transport statistics', owner: 'Planning Team', due: 'Oct 3', priority: 'High' },
      { id: 'task-review-correspondence', title: 'Review pending correspondence', owner: 'Admin Unit', due: 'Oct 2', priority: 'Normal' },
      { id: 'task-confirm-owners', title: 'Confirm ownership for outstanding reports', owner: 'Operations Lead', due: 'Oct 5', priority: 'High' },
    ],
    deadlines: [
      { id: 'deadline-1', date: 'October 3', title: 'Submit Q3 statistics' },
      { id: 'deadline-2', date: 'October 5', title: 'Departmental report review' },
      { id: 'deadline-3', date: 'October 10', title: 'Next coordination meeting' },
    ],
    decisions: [
      'Updated reporting procedure takes effect October 5.',
      'Departments must submit revised statistics before the next review.',
      'Outstanding correspondence should be resolved before the reporting deadline.',
    ],
    people: [
      { id: 'person-planning', name: 'Planning Department', mentions: 8, label: 'Department' },
      { id: 'person-transport', name: 'Transport Planning & Coordination', mentions: 5, label: 'Team' },
      { id: 'person-head', name: 'Department Head', mentions: 3, label: 'Role' },
    ],
    risks: [
      'Delayed submission of required statistics.',
      'Outstanding correspondence may affect reporting timelines.',
    ],
    recommendations: [
      'Resolve pending requests before the next review.',
      'Confirm responsibility for outstanding actions and document ownership.',
    ],
    sources: [
      { id: 'source-1', page: 'Page 2', title: 'Q3 activities' },
      { id: 'source-2', page: 'Page 5', title: 'Pending projects' },
      { id: 'source-3', page: 'Page 8', title: 'Reporting deadlines' },
    ],
    relatedWork: [
      { id: 'related-1', type: 'task', label: 'Submit Q3 statistics', route: '/tasks' },
      { id: 'related-2', type: 'correspondence', label: 'Request for Updated Transport Statistics', route: '/correspondence' },
      { id: 'related-3', type: 'meeting', label: 'Department Coordination Meeting', route: '/meetings' },
    ],
    createdAt: isActionFocused ? 'Today • Action summary' : 'Today',
  }
}
