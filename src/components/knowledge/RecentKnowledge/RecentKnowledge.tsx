import type { KnowledgeSource } from '../../../pages/knowledge/knowledgeTypes'
import KnowledgeIcon from '../KnowledgeIcon'
import './RecentKnowledge.css'

type Props = { sources: KnowledgeSource[]; onOpen: (source: KnowledgeSource) => void }

function statusClass(status: string) { return `knowledge-status status-${status.toLowerCase().replace(/\s+/g, '-')}` }

export default function RecentKnowledge({ sources, onOpen }: Props) {
  return <section className="recent-knowledge"><header><div><span>ACTIVITY</span><h2>Recently added knowledge</h2></div><KnowledgeIcon name="clock" size={17} /></header><div className="recent-knowledge-list">{sources.slice(0, 4).map((source) => <button type="button" key={source.id} onClick={() => onOpen(source)}><span className="recent-knowledge-file"><KnowledgeIcon name="file" size={16} /></span><span className="recent-knowledge-copy"><strong>{source.title}</strong><small>{source.type} · {source.department} · {source.addedAt}</small></span><span className={statusClass(source.status)}>{source.status}</span></button>)}</div></section>
}