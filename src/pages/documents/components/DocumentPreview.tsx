import type { DocumentAction, DocumentRecord } from '../documentTypes'
import { AppIcon, DocumentTypeIcon } from './DocumentGlyph'
import './DocumentPreview.css'

interface DocumentPreviewProps {
  document: DocumentRecord
  onClose: () => void
  onAction: (action: DocumentAction) => void
}

const aiActions: Array<[DocumentAction, string]> = [
  ['summarize', 'Summarize'],
  ['ask', 'Ask questions'],
  ['extract', 'Extract key information'],
  ['dates', 'Find dates'],
  ['action-items', 'Find action items'],
  ['compare', 'Compare with another document'],
]

export default function DocumentPreview({ document, onClose, onAction }: DocumentPreviewProps) {
  const title = document.name.replace(/\.[^.]+$/, '')
  return (
    <div className="document-dialog-layer">
      <button type="button" className="document-dialog-backdrop" aria-label="Close document preview" onClick={onClose} />
      <section className="document-preview-dialog" role="dialog" aria-modal="true" aria-labelledby="document-preview-title">
        <header className="document-preview-header">
          <div className="document-preview-heading"><DocumentTypeIcon type={document.type} /><div><h2 id="document-preview-title">{document.name}</h2><p>{document.type} · {document.size} · Modified {document.modifiedLabel}</p></div></div>
          <div className="document-preview-header-actions"><button type="button" className="document-secondary-button" onClick={() => onAction('download')}><AppIcon name="download" size={16} /><span>Download</span></button><button type="button" className="document-icon-button" aria-label="Close document preview" onClick={onClose}><AppIcon name="close" /></button></div>
        </header>
        <div className="document-preview-body">
          <div className="document-preview-canvas" aria-label="Document preview">
            {document.status === 'processing' ? <div className="document-preview-state"><span className="documents-spinner" /><strong>Document is processing</strong><p>OfficePilot is preparing a searchable preview.</p></div> : document.status === 'failed' ? <div className="document-preview-state is-failed"><AppIcon name="refresh" size={22} /><strong>Preview isn’t ready yet</strong><p>Text recognition didn’t finish. You can retry document processing from the actions menu.</p></div> : <article className="document-paper">
              <div className="document-paper__brand"><span>OFFICEPILOT AI</span><span>{document.referenceNumber}</span></div>
              <div className="document-paper__rule" />
              <span className="document-paper__type">{document.folder.toUpperCase()} · {document.type}</span>
              <h3>{title}</h3>
              <p className="document-paper__subtitle">{document.description}</p>
              <section><h4>Overview</h4><p>{document.preview}</p></section>
              <section><h4>Key considerations</h4><p>Review the recommendations with the relevant team leads and confirm any outstanding actions before the next reporting period.</p><ul><li>Confirm owners and due dates for open actions.</li><li>Share the latest approved version with stakeholders.</li><li>Record decisions in the department workspace.</li></ul></section>
              <div className="document-paper__footer"><span>{document.owner === 'You' ? 'Office workspace' : `Shared by ${document.owner}`}</span><span>Page 1 of 4</span></div>
            </article>}
          </div>
          <aside className="document-preview-sidebar">
            <section className="document-preview-ai"><div className="document-preview-section-title"><span className="document-ai-mark"><AppIcon name="sparkles" size={16} /></span><div><h3>AI actions</h3><p>Work with this document</p></div></div><div className="document-preview-ai-actions">{aiActions.map(([action, label]) => <button key={action} type="button" onClick={() => onAction(action)}>{label}<AppIcon name="arrow" size={14} /></button>)}</div></section>
            <section className="document-preview-info"><h3>Document information</h3><dl><div><dt>Type</dt><dd>{document.type}</dd></div><div><dt>Size</dt><dd>{document.size}</dd></div><div><dt>Owner</dt><dd>{document.owner}</dd></div><div><dt>Created</dt><dd>{new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${document.createdAt}T12:00:00`))}</dd></div><div><dt>Modified</dt><dd>{document.modifiedLabel}</dd></div><div><dt>Folder</dt><dd>{document.folder}</dd></div></dl></section>
          </aside>
        </div>
      </section>
    </div>
  )
}