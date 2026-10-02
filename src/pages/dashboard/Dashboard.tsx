import './Dashboard.css'
import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'

const assistantSuggestions = [
  'Show my priorities',
  'Summarize my day',
  "What's overdue?",
  'Help me write something',
  'Find a document',
]

const todayTasks = [
  {
    title: 'Review quarterly report',
    status: 'Due today',
    priority: 'High priority',
    project: 'Operations',
    action: 'Review',
  },
  {
    title: 'Prepare client response',
    status: 'Due today',
    priority: 'Normal',
    project: 'Client Services',
    action: 'Open',
  },
  {
    title: 'Approve purchase request',
    status: 'Waiting for you',
    priority: 'Needs sign-off',
    project: 'Finance',
    action: 'Approve',
  },
  {
    title: 'Follow up on pending document',
    status: 'Overdue',
    priority: 'Urgent',
    project: 'Registry',
    action: 'Review',
  },
]

const attentionItems = [
  {
    title: 'Project Proposal',
    detail: 'Waiting for your review',
    when: 'Due today',
    action: 'Review',
    type: 'document',
  },
  {
    title: 'Procurement Request',
    detail: 'Approval awaiting decision',
    when: 'Due in 2 hours',
    action: 'Approve',
    type: 'approval',
  },
  {
    title: 'Client Correspondence',
    detail: 'Response required before noon',
    when: 'This morning',
    action: 'Respond',
    type: 'correspondence',
  },
  {
    title: 'Transport Update',
    detail: 'Meeting preparation is still pending',
    when: '11:00 AM',
    action: 'Open',
    type: 'meeting',
  },
]

const quickTools = [
  {
    title: 'Write a Memo',
    description: 'Create a professional office memo',
    path: '/ai/write',
    icon: <DocumentIcon />,
  },
  {
    title: 'Write a Report',
    description: 'Draft a clear internal report',
    path: '/ai/write',
    icon: <ReportIcon />,
  },
  {
    title: 'Draft an Email',
    description: 'Write a clear professional email',
    path: '/ai/write',
    icon: <MailIcon />,
  },
  {
    title: 'Summarize Document',
    description: 'Pull out the key points quickly',
    path: '/ai/summarize',
    icon: <SummaryIcon />,
  },
  {
    title: 'Scan to Editable',
    description: 'Turn a scanned page into editable text',
    path: '/ai/convert',
    icon: <ScanIcon />,
  },
  {
    title: 'PDF → Word',
    description: 'Convert a PDF into an editable document',
    path: '/ai/convert',
    icon: <ConvertIcon />,
  },
  {
    title: 'Word → PDF',
    description: 'Convert a document to PDF format',
    path: '/ai/convert',
    icon: <ConvertIcon />,
  },
  {
    title: 'Create Task',
    description: 'Add a task to your workload',
    path: '/tasks',
    icon: <CheckCircleIcon />,
  },
]

const upcomingEvents = [
  {
    time: '09:00',
    title: 'Team Meeting',
    detail: 'Today',
    type: 'meeting',
  },
  {
    time: '11:00',
    title: 'Project Review',
    detail: 'Today',
    type: 'meeting',
  },
  {
    time: 'Tomorrow',
    title: 'Submit Monthly Report',
    detail: 'Deadline',
    type: 'deadline',
  },
]

function IconFrame({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

function DocumentIcon() {
  return <IconFrame><path d="M13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10z" /><path d="M13 3v7h7M8 15h8M8 18h6" /></IconFrame>
}

function ReportIcon() {
  return <IconFrame><path d="M5 3h10l4 4v14H5z" /><path d="M15 3v5h4M8 17v-3m4 3v-6m4 6v-4" /></IconFrame>
}

function MailIcon() {
  return <IconFrame><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></IconFrame>
}

function SummaryIcon() {
  return <IconFrame><path d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" /><path d="M8 9h8M8 13h8M8 17h5" /></IconFrame>
}

function ScanIcon() {
  return <IconFrame><path d="M7 4H5a1 1 0 0 0-1 1v2m13-3h2a1 1 0 0 1 1 1v2M4 17v2a1 1 0 0 0 1 1h2m13-3v2a1 1 0 0 1-1 1h-2M4 12h16" /></IconFrame>
}

function ConvertIcon() {
  return <IconFrame><path d="M7 7h12l-3-3m3 3-3 3M17 17H5l3 3m-3-3 3-3" /></IconFrame>
}

function CheckCircleIcon() {
  return <IconFrame><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></IconFrame>
}

function SparklesIcon() {
  return <IconFrame><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" /></IconFrame>
}

function SendIcon() {
  return <IconFrame><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></IconFrame>
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect
        x="4"
        y="5"
        width="16"
        height="15"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M8 3.5v3M16 3.5v3M4 9.5h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 12h13M13 7l5 5-5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArrowUpRightIcon({
  className = '',
}: {
  className?: string
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M7 17 17 7M8 7h9v9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function AttentionIcon({
  type,
}: {
  type: string
}) {
  if (type === 'approval') {
    return <CheckCircleIcon />
  }

  if (type === 'meeting') {
    return <CalendarIcon />
  }

  if (type === 'correspondence') {
    return <MailIcon />
  }

  return <DocumentIcon />
}
const recentActivity = [
  {
    person: 'You',
    action: 'uploaded Quarterly Report',
    time: '10 minutes ago',
  },
  {
    person: 'Sarah',
    action: 'completed Procurement Review',
    time: '32 minutes ago',
  },
  {
    person: 'John',
    action: 'sent a document for review',
    time: '1 hour ago',
  },
  {
    person: 'OfficePilot',
    action: 'converted a PDF to Word',
    time: '2 hours ago',
  },
]

const recentDocuments = [
  {
    name: 'Quarterly Operations Report',
    type: 'PDF',
    updated: 'Updated 10 min ago',
  },
  {
    name: 'Project Proposal',
    type: 'DOCX',
    updated: 'Updated 1 hour ago',
  },
  {
    name: 'Meeting Minutes',
    type: 'DOCX',
    updated: 'Updated yesterday',
  },
]

export default function Dashboard() {
  const navigate = useNavigate()

  const currentHour = new Date().getHours()

  const greeting =
    currentHour < 12
      ? 'Good morning'
      : currentHour < 17
        ? 'Good afternoon'
        : 'Good evening'

  const dateLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date())

  const handleSuggestionClick = (suggestion: string) => {
    if (
      suggestion === 'Show my priorities' ||
      suggestion === "What's overdue?"
    ) {
      navigate('/tasks')
      return
    }

    if (suggestion === 'Find a document') {
      navigate('/documents')
      return
    }

    navigate('/ai')
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-header__content">
          <span className="dashboard-kicker">Your workspace</span>

          <h1>
            {greeting}, <span>Cephas</span>
          </h1>

          <p>Here’s what needs your attention today.</p>
        </div>

        <div className="dashboard-header__date">
          <CalendarIcon />
          {dateLabel}
        </div>
      </header>

      <section className="assistant-panel">
        <div className="assistant-panel__header">
          <div className="assistant-title-wrap">
            <span className="assistant-icon">
              <SparklesIcon />
            </span>

            <div>
              <span className="assistant-label">
                Your Office Assistant
              </span>

              <strong>Today’s brief</strong>
            </div>
          </div>

          <span className="assistant-status">
            <span />
            Online
          </span>
        </div>

        <div className="assistant-message-wrap">
          <p className="assistant-message">
            You have <strong>4 tasks</strong> today,{' '}
            <strong>2 documents</strong> waiting for review, and a meeting at{' '}
            <strong>11:00 AM</strong>. One task is overdue.
          </p>

          <button
            type="button"
            className="assistant-open"
            onClick={() => navigate('/ai')}
          >
            Open Assistant
            <ArrowUpRightIcon />
          </button>
        </div>

        <div
          className="assistant-suggestions"
          aria-label="Suggested actions"
        >
          {assistantSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className="assistant-suggestion"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>

        <div className="assistant-input-row">
          <div className="assistant-input-wrap">
            <SparklesIcon />

            <input
              type="text"
              placeholder="Ask OfficePilot anything about your work..."
              aria-label="Ask OfficePilot anything about your work"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  navigate('/ai')
                }
              }}
            />
          </div>

          <button
            type="button"
            className="assistant-send"
            onClick={() => navigate('/ai')}
          >
            <SendIcon />
            <span>Ask OfficePilot</span>
          </button>
        </div>
      </section>

      <div className="dashboard-main-grid">
        <section
          className="content-panel"
          aria-labelledby="today-work-title"
        >
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">Focus</span>
              <h2 id="today-work-title">Today’s work</h2>
            </div>

            <button
              type="button"
              className="panel-link"
              onClick={() => navigate('/tasks')}
            >
              View all
              <ArrowRightIcon />
            </button>
          </div>

          <div className="task-list">
            {todayTasks.map((task) => (
              <article key={task.title} className="work-item">
                <div className="work-item__indicator" />

                <div className="work-item__content">
                  <div className="work-item__meta">
                    <div>
                      <h3>{task.title}</h3>
                      <span className="work-item__project">
                        {task.project}
                      </span>
                    </div>

                    <span
                      className={`work-item__priority ${
                        task.priority.toLowerCase().includes('urgent')
                          ? 'is-urgent'
                          : task.priority
                                .toLowerCase()
                                .includes('normal')
                            ? 'is-normal'
                            : 'is-high'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <div className="work-item__details">
                    <span
                      className={
                        task.status === 'Overdue'
                          ? 'is-overdue'
                          : undefined
                      }
                    >
                      {task.status}
                    </span>

                    <button
                      type="button"
                      onClick={() => navigate('/tasks')}
                    >
                      {task.action}
                      <ArrowRightIcon />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className="content-panel"
          aria-labelledby="attention-title"
        >
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">Action required</span>
              <h2 id="attention-title">Needs your attention</h2>
            </div>
          </div>

          <div className="attention-list">
            {attentionItems.map((item) => (
              <article key={item.title} className="attention-item">
                <div className="attention-item__icon">
                  <AttentionIcon type={item.type} />
                </div>

                <div className="attention-item__content">
                  <div className="attention-item__title-row">
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.detail}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          item.type === 'approval'
                            ? '/approvals'
                            : item.type === 'meeting'
                              ? '/meetings'
                              : item.type === 'correspondence'
                                ? '/correspondence'
                                : '/documents',
                        )
                      }
                    >
                      {item.action}
                    </button>
                  </div>

                  <span>{item.when}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="dashboard-support-grid">
        <section
          className="content-panel"
          aria-labelledby="quick-tools-title"
        >
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">Get work done</span>
              <h2 id="quick-tools-title">Quick tools</h2>
              <p className="panel-subtitle">
                Common office actions, one click away.
              </p>
            </div>
          </div>

          <div className="quick-tools-grid">
            {quickTools.map((tool) => (
              <button
                key={tool.title}
                type="button"
                className="quick-tool"
                onClick={() => navigate(tool.path)}
              >
                <span className="quick-tool__icon">
                  {tool.icon}
                </span>

                <span className="quick-tool__content">
                  <strong>{tool.title}</strong>
                  <small>{tool.description}</small>
                </span>

                <ArrowUpRightIcon className="quick-tool__arrow" />
              </button>
            ))}
          </div>
        </section>

        <section
          className="content-panel"
          aria-labelledby="upcoming-title"
        >
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">Next</span>
              <h2 id="upcoming-title">Upcoming</h2>
            </div>

            <button
              type="button"
              className="panel-link"
              onClick={() => navigate('/meetings')}
            >
              View schedule
              <ArrowRightIcon />
            </button>
          </div>

          <div className="upcoming-list">
            {upcomingEvents.map((event) => (
              <div
                key={`${event.time}-${event.title}`}
                className="upcoming-item"
              >
                <span className="upcoming-time">
                  {event.time}
                </span>

                <div>
                  <strong>{event.title}</strong>
                  <small>{event.detail}</small>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="dashboard-lower-grid">
        <section
          className="content-panel"
          aria-labelledby="activity-title"
        >
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">Workspace</span>
              <h2 id="activity-title">Recent activity</h2>
            </div>
          </div>

          <ul className="activity-list">
            {recentActivity.map((item) => (
              <li
                key={`${item.person}-${item.time}`}
                className="activity-item"
              >
                <span className="activity-dot" />

                <div>
                  <p>
                    <strong>{item.person}</strong>{' '}
                    {item.action}
                  </p>

                  <small>{item.time}</small>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="content-panel"
          aria-labelledby="documents-title"
        >
          <div className="panel-header">
            <div>
              <span className="panel-eyebrow">Files</span>
              <h2 id="documents-title">Recent documents</h2>
            </div>

            <button
              type="button"
              className="panel-link"
              onClick={() => navigate('/documents')}
            >
              View all
              <ArrowRightIcon />
            </button>
          </div>

          <div className="document-list">
            {recentDocuments.map((document) => (
              <div
                key={document.name}
                className="document-item"
              >
                <div className="document-item__meta">
                  <span className="document-file-type">
                    {document.type}
                  </span>

                  <div>
                    <strong>{document.name}</strong>
                    <small>{document.updated}</small>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/documents')}
                >
                  Open
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}