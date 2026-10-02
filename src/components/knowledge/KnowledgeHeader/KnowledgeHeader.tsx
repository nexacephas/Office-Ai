import KnowledgeIcon from '../KnowledgeIcon'
import './KnowledgeHeader.css'

type Props = { onAsk: () => void; onAdd: () => void }

export default function KnowledgeHeader({ onAsk, onAdd }: Props) {
  return <header className="knowledge-header"><div><span className="knowledge-eyebrow">ORGANIZATION KNOWLEDGE</span><h1>Knowledge</h1><p>Find answers, understand workplace information, and explore your organization's knowledge.</p></div><div className="knowledge-header-actions"><button type="button" className="knowledge-secondary-button" onClick={onAdd}><KnowledgeIcon name="plus" size={16} /> Add Knowledge Source</button><button type="button" className="knowledge-primary-button" onClick={onAsk}><KnowledgeIcon name="message" size={16} /> Ask Knowledge</button></div></header>
}