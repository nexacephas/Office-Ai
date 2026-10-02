import type { KnowledgeCollection } from '../../../pages/knowledge/knowledgeTypes'
import KnowledgeCollectionCard from '../KnowledgeCollectionCard/KnowledgeCollectionCard'
import './KnowledgeCollections.css'

type Props = { collections: KnowledgeCollection[]; loading: boolean; onSelect: (collection: string) => void }

export default function KnowledgeCollections({ collections, loading, onSelect }: Props) {
  return <section className="knowledge-collections" aria-label="Knowledge collections"><header><div><span>EXPLORE</span><h2>Knowledge collections</h2></div><button type="button" onClick={() => onSelect('All collections')}>View all</button></header>{loading ? <div className="knowledge-collection-skeletons">{Array.from({ length: 4 }, (_, index) => <i key={index} />)}</div> : <div className="knowledge-collection-grid">{collections.map((collection) => <KnowledgeCollectionCard key={collection.id} collection={collection} onSelect={onSelect} />)}</div>}</section>
}