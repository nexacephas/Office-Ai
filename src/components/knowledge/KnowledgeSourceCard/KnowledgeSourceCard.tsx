import type { KnowledgeSource } from '../../../pages/knowledge/knowledgeTypes'
import KnowledgeIcon from '../KnowledgeIcon'
import './KnowledgeSourceCard.css'

type Props = { source: KnowledgeSource; onOpen: () => void; onAsk: () => void; onRefresh: () => void; onDetails: () => void; onArchive: () => void }

export default function KnowledgeSourceCard({ source, onOpen, onAsk, onRefresh, onDetails, onArchive }: Props) {
  return <article className="knowledge-source-card"><button className="knowledge-source-card-title" type="button" onClick={onDetails}><span><KnowledgeIcon name="file" size={17} /></span><strong>{source.title}</strong></button><div className="knowledge-source-card-info"><span>{source.type}</span><span>{source.department}</span><span>{source.owner}</span><span>{source.updatedAt}</span><span className={`knowledge-status status-${source.status.toLowerCase().replace(/\s+/g, '-')}`}>{source.status}</span></div><div className="knowledge-source-card-actions"><button type="button" onClick={onOpen}>Open</button><button type="button" onClick={onAsk}>Ask AI</button><button type="button" onClick={onRefresh} aria-label={`Refresh ${source.title}`} title="Refresh knowledge"><KnowledgeIcon name="refresh" size={14} /></button><button type="button" onClick={onDetails}>Details</button><button type="button" onClick={onArchive}>Archive</button></div></article>
}