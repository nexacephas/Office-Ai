import { Link } from 'react-router-dom'
import type { AssistantAction, ChatMessage as ChatMessageData, SourceReference } from '../assistantTypes'
import AssistantIcon from './AssistantIcon'
import './ChatMessage.css'

interface ChatMessageProps {
  message: ChatMessageData
  createdActionIds: string[]
  onAction: (messageId: string, action: AssistantAction) => void
  onSuggestion: (prompt: string) => void
  onSource: (source: SourceReference) => void
}

function SourceIcon({ type }: { type: SourceReference['type'] }) {
  const name = type === 'document' ? 'file' : type === 'task' ? 'task' : type === 'meeting' ? 'meeting' : 'mail'
  return <AssistantIcon name={name} size={15} />
}

export default function ChatMessage({ message, createdActionIds, onAction, onSuggestion, onSource }: ChatMessageProps) {
  if (message.role === 'user') return <article className="chat-message user-message"><div className="user-message-content"><p>{message.content}</p>{message.attachments && message.attachments.length > 0 && <div className="user-attachment-list">{message.attachments.map((attachment) => <span key={attachment.id}><AssistantIcon name="file" size={13} />{attachment.name}</span>)}</div>}<time>{message.timestamp}</time></div></article>

  return <article className="chat-message assistant-message"><div className="assistant-message-mark"><AssistantIcon name="sparkles" size={16} /></div><div className="assistant-message-content"><header><strong>OfficePilot</strong><time>{message.timestamp}</time></header><p className="assistant-message-intro">{message.content}</p>
    {message.blocks?.map((block, index) => <section className={`assistant-message-block block-${block.type}`} key={`${message.id}-block-${index}`}>
      {block.heading && <h3>{block.heading}</h3>}{block.text && (block.type === 'draft' ? <pre>{block.text}</pre> : <p>{block.text}</p>)}{block.items && (block.heading === 'Response queue' ? <ol>{block.items.map((item) => <li key={item}>{item}</li>)}</ol> : <ul>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>)}
      {block.type === 'task' && <div className="assistant-task-card"><span className="assistant-task-icon"><AssistantIcon name="task" size={16} /></span><div><strong>{block.title}</strong><small>{block.owner} · Due {block.due} · {block.priority} priority</small></div></div>}
    </section>)}
    {message.sources && message.sources.length > 0 && <section className="assistant-sources"><h3>Sources</h3><div>{message.sources.map((source) => <Link to={source.route} key={source.id} onClick={() => onSource(source)}><span><SourceIcon type={source.type} /></span><span><strong>{source.title}</strong>{source.metadata && <small>{source.metadata}</small>}</span><AssistantIcon name="external" size={13} /></Link>)}</div></section>}
    {message.actions && message.actions.length > 0 && <div className="assistant-message-actions">{message.actions.map((action) => {
      const completed = createdActionIds.includes(action.id)
      return <div className="assistant-action-wrap" key={action.id}><button type="button" className={action.kind === 'create-task' ? 'is-primary' : ''} disabled={completed} onClick={() => onAction(message.id, action)}>{completed ? <><AssistantIcon name="check" size={14} />Task Created</> : action.label}</button>{completed && <Link className="assistant-action-route" to="/tasks">View tasks</Link>}</div>
    })}</div>}
    {message.suggestions && message.suggestions.length > 0 && <div className="assistant-followup-prompts"><span>Suggested next</span>{message.suggestions.map((prompt) => <button type="button" key={prompt} onClick={() => onSuggestion(prompt)}>{prompt}</button>)}</div>}
    </div></article>
}