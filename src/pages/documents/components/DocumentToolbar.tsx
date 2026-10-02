import type { DocumentScope, DocumentType, DocumentView, DocumentSort, DocumentDateFilter } from '../documentTypes'
import { AppIcon } from './DocumentGlyph'
import './DocumentToolbar.css'

interface DocumentToolbarProps {
  scope: DocumentScope
  onScopeChange: (scope: DocumentScope) => void
  query: string
  onQueryChange: (query: string) => void
  typeFilter: DocumentType | 'All types'
  onTypeChange: (type: DocumentType | 'All types') => void
  folderFilter: string
  onFolderChange: (folder: string) => void
  folderOptions: string[]
  dateFilter: DocumentDateFilter
  onDateChange: (date: DocumentDateFilter) => void
  sort: DocumentSort
  onSortChange: (sort: DocumentSort) => void
  view: DocumentView
  onViewChange: (view: DocumentView) => void
  onClearFilters: () => void
}

const scopes: DocumentScope[] = ['All', 'My documents', 'Shared with me', 'Recent', 'Starred']
const types: Array<DocumentType | 'All types'> = ['All types', 'PDF', 'DOCX', 'XLSX', 'PPTX', 'JPG', 'PNG']

export default function DocumentToolbar({ scope, onScopeChange, query, onQueryChange, typeFilter, onTypeChange, folderFilter, onFolderChange, folderOptions, dateFilter, onDateChange, sort, onSortChange, view, onViewChange, onClearFilters }: DocumentToolbarProps) {
  return (
    <section className="documents-toolbar" aria-label="Find and filter documents">
      <label className="documents-search">
        <AppIcon name="search" size={19} />
        <input type="search" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search documents by name, content, reference number..." aria-label="Search documents" />
        {query && <button type="button" aria-label="Clear search" onClick={() => onQueryChange('')}><AppIcon name="close" size={15} /></button>}
      </label>
      <div className="documents-scope-row" role="tablist" aria-label="Document collection">
        {scopes.map((item) => <button key={item} type="button" role="tab" aria-selected={scope === item} className={`documents-scope-tab ${scope === item ? 'is-active' : ''}`} onClick={() => onScopeChange(item)}>{item}{item === 'Starred' && <AppIcon name="star" size={13} />}</button>)}
      </div>
      <div className="documents-filter-row">
        <label className="documents-filter-select"><span>Type</span><select value={typeFilter} onChange={(event) => onTypeChange(event.target.value as DocumentType | 'All types')} aria-label="Filter by document type">{types.map((type) => <option key={type}>{type}</option>)}</select><AppIcon name="chevron" size={14} /></label>
        <label className="documents-filter-select"><span>Folder</span><select value={folderFilter} onChange={(event) => onFolderChange(event.target.value)} aria-label="Filter by folder"><option>All folders</option>{folderOptions.map((folder) => <option key={folder}>{folder}</option>)}</select><AppIcon name="chevron" size={14} /></label>
        <label className="documents-filter-select"><span>Date</span><select value={dateFilter} onChange={(event) => onDateChange(event.target.value as DocumentDateFilter)} aria-label="Filter by modified date"><option value="any">Any time</option><option value="week">Past 7 days</option><option value="month">Past 30 days</option></select><AppIcon name="chevron" size={14} /></label>
        <div className="documents-toolbar-spacer" />
        <label className="documents-sort-select"><AppIcon name="sort" size={15} /><span className="sr-only">Sort documents</span><select value={sort} onChange={(event) => onSortChange(event.target.value as DocumentSort)} aria-label="Sort documents"><option value="modified-desc">Most recent</option><option value="modified-asc">Oldest first</option><option value="name-asc">Name A-Z</option><option value="name-desc">Name Z-A</option><option value="size-desc">Largest first</option></select><AppIcon name="chevron" size={14} /></label>
        <div className="documents-view-toggle" role="group" aria-label="Document view">
          <button type="button" className={view === 'list' ? 'is-active' : ''} aria-label="List view" aria-pressed={view === 'list'} onClick={() => onViewChange('list')}><AppIcon name="list" size={17} /></button>
          <button type="button" className={view === 'grid' ? 'is-active' : ''} aria-label="Grid view" aria-pressed={view === 'grid'} onClick={() => onViewChange('grid')}><AppIcon name="grid" size={16} /></button>
        </div>
        {(query || scope !== 'All' || typeFilter !== 'All types' || folderFilter !== 'All folders' || dateFilter !== 'any') && <button type="button" className="documents-clear-filters" onClick={onClearFilters}>Clear</button>}
      </div>
    </section>
  )
}