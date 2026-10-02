import type { KnowledgeReference } from '../../../pages/knowledge/knowledgeTypes'
import SourceReference from '../SourceReference/SourceReference'
import './KnowledgeSources.css'

type Props = { sources: KnowledgeReference[]; loading?: boolean; onOpen: (id: string) => void; onAsk: (name: string) => void }

export default function KnowledgeSources({ sources, loading = false, onOpen, onAsk }: Props) {
  if (loading) return <div className="knowledge-reference-skeletons" aria-label="Loading sources">{Array.from({ length: 2 }, (_, index) => <i key={index} />)}</div>
  if (!sources.length) return <p className="knowledge-no-references">No matching authorized sources were found.</p>
  return <div className="knowledge-sources-list"><h3>Best match</h3>{sources.slice(0, 1).map((reference, index) => <SourceReference key={reference.documentId} reference={reference} index={index} onOpen={() => onOpen(reference.documentId)} onAsk={() => onAsk(reference.documentName)} />)}{sources.length > 1 && <><h3>Related sources</h3>{sources.slice(1).map((reference, index) => <SourceReference key={reference.documentId} reference={reference} index={index + 1} onOpen={() => onOpen(reference.documentId)} onAsk={() => onAsk(reference.documentName)} />)}</>}</div>
}