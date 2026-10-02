import { useState } from 'react'
import type { DocumentAction, DocumentRecord, DocumentView } from '../documentTypes'
import { AppIcon, DocumentTypeIcon, FolderGlyph } from './DocumentGlyph'
import './DocumentCollection.css'

interface DocumentCollectionProps {
  documents: DocumentRecord[]
  recentDocuments: DocumentRecord[]
  allDocuments: DocumentRecord[]
  selectedIds: string[]
  view: DocumentView
  activeFolder: string
  page: number
  pageCount: number
  totalCount: number
  loading: boolean
  loadError: boolean
  onRetry: () => void
  onOpen: (document: DocumentRecord) => void
  onAction: (document: DocumentRecord, action: DocumentAction) => void
  onToggleStar: (document: DocumentRecord) => void
  onSelect: (id: string, selected: boolean) => void
  onSelectAll: (selected: boolean) => void
  onFolderClick: (folder: string) => void
  onPageChange: (page: number) => void
  onBulkDownload: () => void
  onClearSelection: () => void
  onClearFilters: () => void
}

const actionLabels: Array<[DocumentAction, string]> = [
  ['ask', 'Ask AI'],
  ['summarize', 'Summarize'],
  ['extract', 'Extract information'],
  ['download', 'Download'],
  ['share', 'Share'],
  ['rename', 'Rename'],
  ['move', 'Move'],
  ['convert', 'Convert'],
  ['delete', 'Delete'],
]

function statusLabel(status: DocumentRecord['status']): string {
  if (status === 'processing') return 'Processing'
  if (status === 'failed') return 'Processing failed'
  return ''
}

function DocumentMenu({ document, onOpen, onAction }: { document: DocumentRecord; onOpen: () => void; onAction: (action: DocumentAction) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="document-menu-wrap">
      <button type="button" className="document-icon-button" aria-label={`More actions for ${document.name}`} aria-expanded={open} onClick={() => setOpen((current) => !current)}><AppIcon name="more" /></button>
      {open && <><button type="button" className="document-menu-dismiss" aria-label="Close document actions" onClick={() => setOpen(false)} /><div className="document-action-menu" role="menu">
        <button type="button" role="menuitem" onClick={() => { setOpen(false); onOpen() }}>Open / Preview</button>
        {document.status === 'failed' && <button type="button" role="menuitem" onClick={() => { setOpen(false); onAction('retry') }}>Retry processing</button>}
        {actionLabels.map(([action, label]) => <button type="button" role="menuitem" key={action} className={action === 'delete' ? 'is-danger' : ''} onClick={() => { setOpen(false); onAction(action) }}>{label}</button>)}
      </div></>}
    </div>
  )
}

function DocumentMeta({ document }: { document: DocumentRecord }) {
  return <span className="document-meta-line">{document.type} <i /> {document.owner} <i /> Modified {document.modifiedLabel} <i /> {document.size}</span>
}

export default function DocumentCollection({ documents, recentDocuments, allDocuments, selectedIds, view, activeFolder, page, pageCount, totalCount, loading, loadError, onRetry, onOpen, onAction, onToggleStar, onSelect, onSelectAll, onFolderClick, onPageChange, onBulkDownload, onClearSelection, onClearFilters }: DocumentCollectionProps) {
  const allCurrentSelected = documents.length > 0 && documents.every((document) => selectedIds.includes(document.id))
  const firstItem = totalCount === 0 ? 0 : (page - 1) * 8 + 1
  const lastItem = Math.min(page * 8, totalCount)

  return (
    <div className="document-collection">
      <section className="documents-recent-section" aria-labelledby="recent-documents-heading">
        <div className="documents-section-heading"><div><h2 id="recent-documents-heading">Recent documents</h2><p>Pick up where you left off.</p></div><span className="documents-section-count">{recentDocuments.length} recent</span></div>
        {recentDocuments.length ? <div className="documents-recent-strip">{recentDocuments.map((document) => <article className="documents-recent-card" key={document.id}>
          <button type="button" className="documents-recent-card__open" onClick={() => onOpen(document)} aria-label={`Open ${document.name}`}>
            <DocumentTypeIcon type={document.type} />
            <span className="documents-recent-card__text"><strong>{document.name}</strong><small>{document.description}</small><small>{document.modifiedLabel}</small></span>
          </button>
          <button type="button" className={`document-star-button ${document.starred ? 'is-starred' : ''}`} aria-label={`${document.starred ? 'Unstar' : 'Star'} ${document.name}`} aria-pressed={document.starred} onClick={() => onToggleStar(document)}><AppIcon name="star" size={16} filled={document.starred} /></button>
        </article>)}</div> : <p className="documents-inline-empty">No recent documents to show.</p>}
      </section>

      <section className="documents-folders-section" aria-labelledby="folders-heading">
        <div className="documents-section-heading"><div><h2 id="folders-heading">Folders</h2><p>Browse documents by team and purpose.</p></div><button type="button" className={`documents-folder-clear ${activeFolder ? '' : 'is-hidden'}`} onClick={() => onFolderClick(activeFolder)}>Clear folder</button></div>
        <div className="documents-folder-grid">{['Reports', 'Memos', 'Correspondence', 'Meetings', 'Policies', 'Projects', 'Templates', 'Other'].map((folder) => {
          const count = allDocuments.filter((document) => document.folder === folder).length
          return <button type="button" className={`documents-folder-card ${activeFolder === folder ? 'is-active' : ''}`} key={folder} aria-pressed={activeFolder === folder} onClick={() => onFolderClick(folder)}><span className="documents-folder-card__icon"><FolderGlyph /></span><span><strong>{folder}</strong><small>{count} {count === 1 ? 'document' : 'documents'}</small></span><AppIcon name="arrow" size={15} /></button>
        })}</div>
      </section>

      <section className="documents-all-section" aria-labelledby="all-documents-heading">
        <div className="documents-section-heading documents-all-heading"><div><h2 id="all-documents-heading">All documents</h2><p>{loading ? 'Loading your workspace...' : `${totalCount} ${totalCount === 1 ? 'document' : 'documents'} in this view`}</p></div>{selectedIds.length > 0 && <div className="documents-selection-bar"><span>{selectedIds.length} selected</span><button type="button" onClick={onBulkDownload}><AppIcon name="download" size={15} />Download</button><button type="button" onClick={onClearSelection}>Clear</button></div>}</div>

        {loading ? <div className="documents-loading" role="status"><span className="documents-spinner" />Loading documents</div> : loadError ? <div className="documents-state"><strong>Documents could not be loaded</strong><p>Try again in a moment.</p><button type="button" onClick={onRetry}>Retry</button></div> : totalCount === 0 ? <div className="documents-empty-state"><span className="documents-empty-icon"><AppIcon name="search" size={21} /></span><h3>No documents found</h3><p>Try changing your search or filters.</p><button type="button" onClick={onClearFilters}>Clear filters</button></div> : view === 'list' ? (
          <div className="documents-table-scroll"><table className="documents-table">
            <thead><tr><th className="documents-select-column"><input type="checkbox" aria-label="Select all documents on this page" checked={allCurrentSelected} onChange={(event) => onSelectAll(event.target.checked)} /></th><th>Document</th><th>Type</th><th>Owner</th><th>Folder</th><th>Modified</th><th>Size</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>{documents.map((document) => <tr key={document.id} className={selectedIds.includes(document.id) ? 'is-selected' : ''}>
              <td className="documents-select-column"><input type="checkbox" aria-label={`Select ${document.name}`} checked={selectedIds.includes(document.id)} onChange={(event) => onSelect(document.id, event.target.checked)} /></td>
              <td className="documents-name-cell"><div className="documents-name-wrap"><DocumentTypeIcon type={document.type} /><div className="documents-name-content"><button type="button" className="documents-name-button" onClick={() => onOpen(document)}>{document.name}</button><small>{document.description}</small>{document.status !== 'ready' && <span className={`document-processing-state state-${document.status}`}>{document.status === 'failed' && <AppIcon name="refresh" size={12} />}{statusLabel(document.status)}</span>}</div></div></td>
              <td><span className="documents-type-text">{document.type}</span></td><td>{document.owner}</td><td><span className="documents-folder-label"><FolderGlyph size={14} />{document.folder}</span></td><td><span className="documents-modified">{document.modifiedLabel}</span></td><td>{document.size}</td>
              <td className="documents-actions-cell"><button type="button" className={`document-star-button ${document.starred ? 'is-starred' : ''}`} aria-label={`${document.starred ? 'Unstar' : 'Star'} ${document.name}`} aria-pressed={document.starred} onClick={() => onToggleStar(document)}><AppIcon name="star" size={16} filled={document.starred} /></button><DocumentMenu document={document} onOpen={() => onOpen(document)} onAction={(action) => onAction(document, action)} /></td>
            </tr>)}</tbody>
          </table></div>
        ) : <div className="documents-grid-view">{documents.map((document) => <article className={`documents-grid-card ${selectedIds.includes(document.id) ? 'is-selected' : ''}`} key={document.id}>
          <div className="documents-grid-card__top"><label className="documents-row-select"><input type="checkbox" checked={selectedIds.includes(document.id)} onChange={(event) => onSelect(document.id, event.target.checked)} aria-label={`Select ${document.name}`} /><span /></label><DocumentTypeIcon type={document.type} large /><button type="button" className={`document-star-button ${document.starred ? 'is-starred' : ''}`} aria-label={`${document.starred ? 'Unstar' : 'Star'} ${document.name}`} aria-pressed={document.starred} onClick={() => onToggleStar(document)}><AppIcon name="star" size={16} filled={document.starred} /></button></div>
          {document.status !== 'ready' && <span className={`document-processing-state state-${document.status}`}>{statusLabel(document.status)}</span>}
          <button type="button" className="documents-grid-card__name" onClick={() => onOpen(document)}>{document.name}</button><p>{document.description}</p><DocumentMeta document={document} /><div className="documents-grid-card__footer"><span className="documents-folder-label"><FolderGlyph size={14} />{document.folder}</span><DocumentMenu document={document} onOpen={() => onOpen(document)} onAction={(action) => onAction(document, action)} /></div>
        </article>)}</div>}

        {!loading && !loadError && totalCount > 0 && <footer className="documents-pagination"><span>Showing {firstItem}–{lastItem} of {totalCount}</span><div><button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => onPageChange(page - 1)}><AppIcon name="back" size={15} /></button><span>Page {page} of {pageCount}</span><button type="button" aria-label="Next page" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}><AppIcon name="arrow" size={15} /></button></div></footer>}
      </section>
    </div>
  )
}