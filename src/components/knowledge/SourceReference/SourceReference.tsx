import KnowledgeIcon from '../KnowledgeIcon'
import type { KnowledgeReference } from '../../../pages/knowledge/knowledgeTypes'
import './SourceReference.css'

type Props = { reference: KnowledgeReference; index: number; onOpen: () => void; onAsk: () => void }

export default function SourceReference({ reference, index, onOpen, onAsk }: Props) {
  const location = [reference.page ? `Page ${reference.page}` : '', reference.section || ''].filter(Boolean).join(' · ')
  return <article className="knowledge-source-reference"><div className="knowledge-source-reference-number">{index + 1}</div><div className="knowledge-source-reference-body"><div className="knowledge-source-reference-heading"><strong>{reference.documentName}</strong><span className="knowledge-source-relevance">{reference.relevance}% match</span></div><p>{reference.excerpt}</p><div className="knowledge-source-reference-meta"><span>{location}</span><span>{reference.department}</span><span>Updated {reference.updatedAt}</span><span>{reference.collection}</span></div><div className="knowledge-source-reference-actions"><button type="button" onClick={onOpen}>Open source <KnowledgeIcon name="external" size={13} /></button><button type="button" onClick={onAsk}>Ask about this document <KnowledgeIcon name="arrow" size={13} /></button></div></div></article>
}