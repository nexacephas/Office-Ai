import KnowledgeIcon from '../KnowledgeIcon'
import type { KnowledgeCollection } from '../../../pages/knowledge/knowledgeTypes'
import './KnowledgeCollectionCard.css'

export default function KnowledgeCollectionCard({ collection, onSelect }: { collection: KnowledgeCollection; onSelect: (collection: string) => void }) {
  return <button type="button" className="knowledge-collection-card" onClick={() => onSelect(collection.name)}><span className="knowledge-collection-icon"><KnowledgeIcon name={collection.name === 'Policies' ? 'shield' : collection.name === 'Reports' ? 'chart' : collection.name === 'Operations' ? 'building' : 'folder'} size={17} /></span><span className="knowledge-collection-copy"><strong>{collection.name}</strong><small>{collection.description}</small></span><span className="knowledge-collection-count">{collection.sourceCount} sources</span><span className="knowledge-collection-updated">Updated {collection.updatedAt}</span><KnowledgeIcon name="chevron" size={15} /></button>
}