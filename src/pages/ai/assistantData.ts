import type { AssistantAction, ChatMessage, Conversation, SourceReference } from './assistantTypes'

function message(id: string, role: 'user' | 'assistant', content: string, options: Partial<ChatMessage> = {}): ChatMessage {
  return { id, role, content, timestamp: role === 'user' ? '10:42 AM' : '10:43 AM', ...options }
}

function action(id: string, label: string, kind: AssistantAction['kind'], options: Partial<AssistantAction> = {}): AssistantAction {
  return { id, label, kind, ...options }
}

function source(id: string, type: SourceReference['type'], title: string, route: string, metadata?: string): SourceReference {
  return { id, type, title, route, metadata }
}

export const suggestedPrompts = [
  'Show me what needs my attention today',
  'Find my pending correspondence',
  'Summarize my recent documents',
  'Prepare me for my next meeting',
  'Help me write a formal memo',
  "What's overdue?",
]

export const quickActions = [
  { label: 'Write something', icon: 'edit', route: '/ai/write', prompt: 'Help me write a professional workplace memo.' },
  { label: 'Summarize a document', icon: 'file', route: '/ai/summarize', prompt: 'Summarize the latest department report.' },
  { label: 'Find information', icon: 'search', route: '/documents', prompt: 'Find information in my workplace documents.' },
  { label: 'Prepare for a meeting', icon: 'meeting', route: '/meetings', prompt: 'Prepare me for my next meeting.' },
  { label: 'Create a task', icon: 'task', route: '/tasks', prompt: 'Create a task to submit the report by Friday.' },
  { label: 'Analyze a document', icon: 'sparkles', route: '/ai', prompt: 'What does the Q3 report say about pending projects?' },
] as const

const correspondenceSources = [
  source('source-corr-184', 'correspondence', 'Request for Updated Transport Statistics', '/correspondence', 'FMT/TPC/2026/184 · Received Sep 30'),
  source('source-corr-activity', 'correspondence', 'Departmental Activity Report', '/correspondence', 'FMT/ADM/2026/178 · Due Oct 4'),
  source('source-corr-invite', 'correspondence', 'Stakeholder Meeting Invitation', '/correspondence', 'SEC/MEET/2026/092 · Due Oct 5'),
]

const reportSource = source('source-q3-report', 'document', 'Q3 Department Activity Report', '/documents', 'DOCX · Modified 4 hours ago')

const seededConversations: Conversation[] = [
  {
    id: 'conversation-q3-report',
    title: 'Q3 report summary',
    updatedAt: '10:43 AM',
    messages: [
      message('q3-user', 'user', 'Summarize the latest department report.'),
      message('q3-assistant', 'assistant', 'I found the latest Department Activity Report.', {
        blocks: [
          { type: 'section', heading: 'Summary', text: 'The report covers Q3 departmental activities, pending projects, operational challenges, and planned actions for the next reporting period.' },
          { type: 'section', heading: 'Key points', items: ['3 major projects remain active.', '2 reports are awaiting submission.', 'The department has 4 outstanding action items.'] },
          { type: 'note', heading: 'Important', text: 'The next major submission deadline is October 3.' },
        ],
        sources: [reportSource, source('source-management-minutes', 'meeting', 'Previous Management Meeting Minutes', '/meetings', 'Sep 27 · Summary available')],
        actions: [action('q3-open', 'Open document', 'navigate', { route: '/documents' }), action('q3-tasks', 'Create tasks', 'create-task', { taskTitle: 'Review Q3 department report', due: 'Oct 3, 2026', priority: 'High' }), action('q3-followup', 'Ask follow-up', 'ask')],
        suggestions: ['What is the deadline?', 'Who owns the outstanding action?', 'Draft a report follow-up'],
      }),
    ],
  },
  {
    id: 'conversation-correspondence',
    title: 'Pending correspondence',
    updatedAt: 'Yesterday',
    messages: [
      message('corr-user', 'user', "What's waiting for my response?"),
      message('corr-assistant', 'assistant', 'You have 3 correspondence items awaiting a response.', {
        blocks: [{ type: 'section', heading: 'Response queue', items: ['Request for Updated Transport Statistics · Due Oct 3 · High', 'Departmental Activity Report · Due Oct 4 · Normal', 'Stakeholder Meeting Invitation · Due Oct 5 · Normal'] }],
        sources: correspondenceSources,
        actions: [action('corr-open', 'View correspondence', 'navigate', { route: '/correspondence' }), action('corr-create', 'Create tasks', 'create-task', { taskTitle: 'Respond to pending correspondence', due: 'Oct 3, 2026', priority: 'High' })],
        suggestions: ['Draft a response', 'Which one is most urgent?', 'Create follow-up tasks'],
      }),
    ],
  },
  {
    id: 'conversation-management-meeting',
    title: 'Prepare for management meeting',
    updatedAt: 'Yesterday',
    messages: [
      message('meeting-user', 'user', 'Prepare me for my next meeting.'),
      message('meeting-assistant', 'assistant', 'Your next meeting is the Department Coordination Meeting today at 11:00 AM in Conference Room 2.', {
        blocks: [
          { type: 'section', heading: 'Suggested agenda', items: ['Review previous action items', 'Discuss pending correspondence', 'Review Q3 progress', 'Assign next steps'] },
          { type: 'section', heading: 'Open issues', items: ['3 outstanding tasks', '2 unanswered correspondence items', '1 overdue action'] },
        ],
        sources: [source('source-meeting-coordination', 'meeting', 'Department Coordination Meeting', '/meetings', 'Today · 11:00 AM · 8 participants'), reportSource],
        actions: [action('meeting-open', 'Open meeting', 'navigate', { route: '/meetings' }), action('meeting-docs', 'View documents', 'navigate', { route: '/documents' }), action('meeting-tasks', 'View tasks', 'navigate', { route: '/tasks' })],
        suggestions: ['Show the previous meeting summary', 'Draft an agenda', 'What should I ask?'],
      }),
    ],
  },
  {
    id: 'conversation-transport-response',
    title: 'Draft transport response',
    updatedAt: 'Sep 30',
    messages: [
      message('draft-user', 'user', 'Draft a formal response to the transport statistics request.'),
      message('draft-assistant', 'assistant', 'Here is a formal response you can review and adapt.', {
        blocks: [{ type: 'draft', heading: 'RESPONSE', text: 'Dear Planning Department,\n\nThank you for your request for updated third-quarter transport statistics. Our team is compiling the latest vehicle utilization figures and will provide the complete update by October 3, 2026.\n\nPlease let us know if you need any additional breakdowns.\n\nKind regards,\nTransport Planning & Coordination' }],
        sources: [correspondenceSources[0]],
        actions: [action('draft-writer', 'Open in Writer', 'navigate', { route: '/ai/write' }), action('draft-corr', 'Open correspondence', 'navigate', { route: '/correspondence' }), action('draft-copy', 'Copy draft', 'copy')],
      }),
    ],
  },
  {
    id: 'conversation-policy-docs',
    title: 'Find policy documents',
    updatedAt: 'Sep 29',
    messages: [
      message('policy-user', 'user', 'Which documents mention the new reporting requirements?'),
      message('policy-assistant', 'assistant', 'I found two relevant workplace documents.', {
        blocks: [{ type: 'section', heading: 'Relevant documents', items: ['Q3 Department Activity Report · Reporting template and submission dates', 'Departmental Reporting Guide · Review and approval process'] }],
        sources: [reportSource, source('source-report-guide', 'document', 'Departmental Reporting Guide', '/documents', 'PDF · Policies')],
        actions: [action('policy-open', 'Open documents', 'navigate', { route: '/documents' }), action('policy-summarize', 'Summarize', 'navigate', { route: '/ai/summarize' })],
      }),
    ],
  },
  {
    id: 'conversation-todays-priorities',
    title: "Today's priorities",
    updatedAt: 'Sep 29',
    messages: [
      message('priority-user', 'user', 'Show me what needs my attention today.'),
      message('priority-assistant', 'assistant', 'Here is a practical order for today based on deadlines and priority.', {
        blocks: [{ type: 'section', heading: 'Start here', items: ['Follow up on the overdue procurement documentation.', 'Submit Q3 transport statistics by October 3.', 'Prepare for the Quarterly Transport Review at 2:00 PM.'] }],
        sources: [source('source-task-depot', 'task', 'Send depot maintenance documents', '/tasks', 'Overdue · Urgent'), correspondenceSources[0], source('source-quarterly-meeting', 'meeting', 'Quarterly Transport Review', '/meetings', 'Today · 2:00 PM')],
        actions: [action('priority-tasks', 'View tasks', 'navigate', { route: '/tasks' }), action('priority-meeting', 'Prepare for meeting', 'navigate', { route: '/meetings' })],
      }),
    ],
  },
]

export function loadSeedConversations(): Conversation[] {
  return seededConversations.map((conversation) => ({
    ...conversation,
    messages: conversation.messages.map((item) => ({
      ...item,
      blocks: item.blocks?.map((block) => ({ ...block, items: block.items ? [...block.items] : undefined })),
      sources: item.sources?.map((itemSource) => ({ ...itemSource })),
      actions: item.actions?.map((itemAction) => ({ ...itemAction })),
      suggestions: item.suggestions ? [...item.suggestions] : undefined,
    })),
  }))
}

export function createMockResponse(prompt: string, id: string): ChatMessage {
  const query = prompt.toLowerCase()
  if (query.includes('correspondence') || query.includes('response') || query.includes('reply')) {
    return message(id, 'assistant', 'You have 3 correspondence items awaiting a response.', {
      blocks: [{ type: 'section', heading: 'Response queue', items: ['Request for Updated Transport Statistics · Due Oct 3 · High', 'Departmental Activity Report · Due Oct 4 · Normal', 'Stakeholder Meeting Invitation · Due Oct 5 · Normal'] }],
      sources: correspondenceSources,
      actions: [action(`${id}-view`, 'Open correspondence', 'navigate', { route: '/correspondence' }), action(`${id}-draft`, 'Draft response', 'navigate', { route: '/ai/write' }), action(`${id}-task`, 'Create task', 'create-task', { taskTitle: 'Respond to pending correspondence', due: 'Oct 3, 2026', priority: 'High' })],
      suggestions: ['Draft a response', 'Which one is most urgent?', 'Create follow-up tasks'],
    })
  }
  if (query.includes('meeting') || query.includes('agenda') || query.includes('tomorrow')) {
    return message(id, 'assistant', 'Your next meeting is the Department Coordination Meeting today at 11:00 AM in Conference Room 2.', {
      blocks: [{ type: 'section', heading: 'Preparation', items: ['Review previous actions', 'Discuss pending correspondence', 'Review Q3 progress', 'Assign next steps'] }, { type: 'section', heading: 'Open issues', items: ['3 outstanding tasks', '2 unanswered correspondence items', '1 overdue action'] }],
      sources: [source(`${id}-meeting`, 'meeting', 'Department Coordination Meeting', '/meetings', 'Today · 11:00 AM · 8 participants'), reportSource],
      actions: [action(`${id}-open`, 'Open meeting', 'navigate', { route: '/meetings' }), action(`${id}-docs`, 'View documents', 'navigate', { route: '/documents' }), action(`${id}-tasks`, 'View tasks', 'navigate', { route: '/tasks' })],
      suggestions: ['Show the previous meeting summary', 'Draft an agenda', 'What should I ask?'],
    })
  }
  if (query.includes('write') || query.includes('memo') || query.includes('draft') || query.includes('email') || query.includes('letter')) {
    return message(id, 'assistant', 'Here is a draft you can review and adapt.', {
      blocks: [{ type: 'draft', heading: 'MEMORANDUM', text: 'To: Department Head\nFrom: Transport Planning & Coordination\nSubject: Department Update\n\nThis memorandum provides an update on current departmental priorities and outstanding actions. The team is reviewing the latest transport statistics and will share a consolidated report by October 3, 2026.\n\nPlease contact the planning team if further details are required.\n\nKind regards,\nTransport Planning & Coordination' }],
      sources: [reportSource],
      actions: [action(`${id}-writer`, 'Open in Writer', 'navigate', { route: '/ai/write' }), action(`${id}-copy`, 'Copy draft', 'copy'), action(`${id}-corr`, 'Create correspondence', 'navigate', { route: '/correspondence' })],
    })
  }
  if (query.includes('knowledge') || query.includes('process') || query.includes('policy') || query.includes('how do i')) {
    return message(id, 'assistant', 'Based on your organization’s available documents, the reporting process is:', {
      blocks: [{ type: 'section', heading: 'Departmental report process', items: ['Prepare the report using the approved department template.', 'Review content with the unit lead.', 'Submit through the designated planning channel.', 'Record the submission reference and follow-up date.'] }, { type: 'note', heading: 'Organization context', text: 'This demo answer is based on mock workplace documents. A connected assistant would only use information you are authorized to access.' }],
      sources: [source(`${id}-policy`, 'document', 'Departmental Reporting Guide', '/documents', 'PDF · Policies'), reportSource],
      actions: [action(`${id}-docs`, 'Open source documents', 'navigate', { route: '/documents' }), action(`${id}-ask`, 'Ask a follow-up', 'ask')],
      suggestions: ['Who reviews the report?', 'Find the approved template', 'What is the next deadline?'],
    })
  }
  if (query.includes('document') || query.includes('report') || query.includes('summar')) {
    return message(id, 'assistant', 'I found the latest Department Activity Report.', {
      blocks: [{ type: 'section', heading: 'Summary', text: 'The report covers Q3 departmental activities, pending projects, operational challenges, and planned actions for the next reporting period.' }, { type: 'section', heading: 'Key points', items: ['3 major projects remain active.', '2 reports are awaiting submission.', 'The department has 4 outstanding action items.'] }, { type: 'note', heading: 'Important', text: 'The report identifies October 3 as the next major submission deadline.' }],
      sources: [reportSource, source(`${id}-minutes`, 'meeting', 'Previous Management Meeting Minutes', '/meetings', 'Sep 27 · Summary available')],
      actions: [action(`${id}-open`, 'Open document', 'navigate', { route: '/documents' }), action(`${id}-summarize`, 'Summarize', 'navigate', { route: '/ai/summarize' }), action(`${id}-task`, 'Create task', 'create-task', { taskTitle: 'Submit Q3 transport statistics', due: 'Oct 3, 2026', priority: 'High' }), action(`${id}-ask`, 'Ask about this document', 'ask')],
      suggestions: ['What does it say about pending projects?', 'Who owns the next action?', 'Find related correspondence'],
    })
  }
  if (query.includes('task') || query.includes('overdue') || query.includes('priorit') || query.includes('attention') || query.includes('away')) {
    return message(id, 'assistant', query.includes('overdue') ? 'I found 2 overdue actions that need attention.' : 'Here is a practical order for the work that needs your attention today.', {
      blocks: [{ type: 'section', heading: query.includes('overdue') ? 'Overdue' : 'Suggested priorities', items: ['Follow up on the pending procurement documentation · Urgent · Overdue', 'Submit Q3 transport statistics · High · Due Oct 3', 'Prepare for the Quarterly Transport Review · Today · 2:00 PM'] }, { type: 'task', title: 'Submit Q3 transport statistics', owner: 'Planning Team', due: 'Oct 3, 2026', priority: 'High' }],
      sources: [source(`${id}-task-1`, 'task', 'Send depot maintenance documents', '/tasks', 'Overdue · Urgent'), source(`${id}-task-2`, 'task', 'Provide Q3 transport statistics', '/tasks', 'Due Oct 3 · High'), source(`${id}-meeting`, 'meeting', 'Quarterly Transport Review', '/meetings', 'Today · 2:00 PM')],
      actions: [action(`${id}-view`, 'View tasks', 'navigate', { route: '/tasks' }), action(`${id}-create`, 'Create Task', 'create-task', { taskTitle: 'Submit Q3 transport statistics', due: 'Oct 3, 2026', priority: 'High' }), action(`${id}-meeting-action`, 'Prepare for meeting', 'navigate', { route: '/meetings' })],
      suggestions: ['Which task is most urgent?', 'Draft a status update', 'Find the related report'],
    })
  }
  return message(id, 'assistant', 'I can help you find information, understand workplace documents, prepare for meetings, and move follow-ups forward. What would you like to work on?', {
    blocks: [{ type: 'section', heading: 'A few useful places to start', items: ['Check what needs a response today.', 'Find a document by title, reference, or topic.', 'Prepare for your next meeting.', 'Turn a decision into a task.'] }],
    actions: [action(`${id}-tasks`, 'Show priorities', 'navigate', { route: '/tasks' }), action(`${id}-documents`, 'Find a document', 'navigate', { route: '/documents' }), action(`${id}-meetings`, 'Prepare for a meeting', 'navigate', { route: '/meetings' })],
    suggestions: ['What’s waiting for my response?', 'Summarize the latest department report', 'What meetings do I have tomorrow?'],
  })
}