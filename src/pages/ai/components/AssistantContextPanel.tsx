import { Link } from 'react-router-dom'
import type { SourceReference } from '../assistantTypes'
import AssistantIcon from './AssistantIcon'
import './AssistantContextPanel.css'

interface AssistantContextPanelProps {
  context?: SourceReference
  onSummarize?: () => void
  onAsk?: () => void
  onClose?: () => void
  mobile?: boolean
}

const capabilities = [
  { title: 'Documents', detail: 'Find, summarize, compare and understand documents.', icon: 'file' },
  { title: 'Writing', detail: 'Draft memos, reports, emails, letters and notices.', icon: 'writing' },
  { title: 'Tasks', detail: 'Create tasks, find overdue work and track follow-ups.', icon: 'task' },
  { title: 'Meetings', detail: 'Prepare agendas, summarize meetings and extract actions.', icon: 'meeting' },
  { title: 'Knowledge', detail: 'Answer questions using authorized workplace information.', icon: 'book' },
] as const

function sourceIcon(type: SourceReference['type']): 'file' | 'task' | 'meeting' | 'mail' {
  return type === 'document' ? 'file' : type === 'task' ? 'task' : type === 'meeting' ? 'meeting' : 'mail'
}

export default function AssistantContextPanel({ context, onSummarize, onAsk, onClose, mobile = false }: AssistantContextPanelProps) {
  return <aside className={`assistant-context-panel ${mobile ? 'is-mobile-drawer' : ''}`} aria-label={context ? 'Current context' : 'OfficePilot capabilities'}><header><div><span>WORKSPACE CONTEXT</span><h2>{context ? 'Current context' : 'OfficePilot can help with'}</h2></div>{mobile && <button type="button" className="assistant-context-close" aria-label="Close context panel" onClick={onClose}><AssistantIcon name="close" /></button>}</header>{context ? <div className="assistant-current-context"><span className={`assistant-context-type type-${context.type}`}><AssistantIcon name={sourceIcon(context.type)} size={18} /></span><strong>{context.title}</strong><small>{context.metadata}</small><div className="assistant-context-related"><span>Related work</span><div><span>3 tasks</span><span>2 correspondence items</span><span>1 meeting</span></div></div><div className="assistant-context-actions"><Link to={context.route}><AssistantIcon name="external" size={14} />Open</Link><button type="button" onClick={onSummarize}><AssistantIcon name="sparkles" size={14} />Summarize</button><button type="button" onClick={onAsk}><AssistantIcon name="search" size={14} />Ask about this</button></div></div> : <div className="assistant-capabilities">{capabilities.map((capability) => <article key={capability.title}><span><AssistantIcon name={capability.icon} size={15} /></span><div><strong>{capability.title}</strong><p>{capability.detail}</p></div></article>)}</div>}<footer><span className="assistant-context-security"><AssistantIcon name="check" size={13} />Workplace context is permission-aware</span></footer></aside>
}