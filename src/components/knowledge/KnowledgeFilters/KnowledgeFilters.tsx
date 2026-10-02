import type { KnowledgeFiltersState } from '../../../pages/knowledge/knowledgeTypes'
import KnowledgeIcon from '../KnowledgeIcon'
import './KnowledgeFilters.css'

type Props = { query: string; filters: KnowledgeFiltersState; collections: string[]; filtersOpen: boolean; hasFilters: boolean; onQuery: (query: string) => void; onChange: (filters: KnowledgeFiltersState) => void; onToggle: () => void; onClear: () => void }
const filterDefinitions = [
  ['department', 'Department', ['All departments', 'HR', 'Finance', 'Administration', 'Operations']],
  ['documentType', 'Document type', ['All types', 'Policy', 'Procedure', 'Guideline', 'Report', 'Template', 'Manual']],
  ['updated', 'Date updated', ['Any time', 'Last 7 days', 'Last 30 days', 'Older']],
  ['owner', 'Owner', ['Anyone', 'You', 'Naomi L.', 'Miriam K.', 'Daniel O.']],
  ['status', 'Status', ['Ready', 'Processing', 'Needs Review', 'Failed', 'Archived', 'All statuses']],
] as const

export default function KnowledgeFilters({ query, filters, collections, filtersOpen, hasFilters, onQuery, onChange, onToggle, onClear }: Props) {
  function select(field: keyof KnowledgeFiltersState, value: string) { onChange({ ...filters, [field]: value } as KnowledgeFiltersState) }
  return <section className="knowledge-filters"><div className="knowledge-source-search"><KnowledgeIcon name="search" size={16} /><input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Search knowledge sources..." aria-label="Search knowledge sources" /><button type="button" className="knowledge-filter-toggle" aria-expanded={filtersOpen} onClick={onToggle}><KnowledgeIcon name="filter" size={16} /> Filters</button></div><div className={`knowledge-filter-options${filtersOpen ? ' is-open' : ''}`}><header><strong>Filter sources</strong><button type="button" onClick={onToggle} aria-label="Close filters"><KnowledgeIcon name="close" size={16} /></button></header><label><span>Collection</span><select value={filters.collection} onChange={(event) => select('collection', event.target.value)}><option>All collections</option>{collections.map((collection) => <option key={collection}>{collection}</option>)}</select></label>{filterDefinitions.map(([field, label, options]) => <label key={field}><span>{label}</span><select value={filters[field]} onChange={(event) => select(field, event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>)}<label><span>Sort</span><select value={filters.sort} onChange={(event) => select('sort', event.target.value)}><option>Relevance</option><option>Recently updated</option><option>Newest</option><option>Oldest</option></select></label>{hasFilters && <button type="button" className="knowledge-clear-filters" onClick={onClear}>Clear filters</button>}<button type="button" className="knowledge-filter-done" onClick={onToggle}>Done</button></div></section>
}