import { useState } from 'react'
import type { DocumentAction, DocumentRecord, DocumentType } from '../documentTypes'
import { documentFolders } from '../documentTypes'
import { AppIcon } from './DocumentGlyph'
import './DocumentActionDialog.css'

interface DocumentActionDialogProps {
  document: DocumentRecord
  action: DocumentAction
  documents: DocumentRecord[]
  onClose: () => void
  onConfirm: (value?: string) => void
}

const aiActionLabels: Partial<Record<DocumentAction, string>> = {
  summarize: 'Summary',
  ask: 'Ask this document',
  extract: 'Key information',
  dates: 'Important dates',
  'action-items': 'Action items',
  compare: 'Compare documents',
}

const actionTitles: Record<DocumentAction, string> = {
  summarize: 'Summary',
  ask: 'Ask this document',
  extract: 'Key information',
  dates: 'Important dates',
  'action-items': 'Action items',
  compare: 'Compare documents',
  share: 'Share document',
  convert: 'Convert document',
  delete: 'Delete document',
  rename: 'Rename document',
  move: 'Move document',
  retry: 'Retry processing',
  download: 'Download document',
}

function responseFor(document: DocumentRecord, action: DocumentAction): string {
  if (action === 'summarize') return `This document covers ${document.description.toLowerCase()}. ${document.preview}`
  if (action === 'extract') return `Reference: ${document.referenceNumber || 'Not listed'}\nOwner: ${document.owner}\nFolder: ${document.folder}\nFile: ${document.type} · ${document.size}`
  if (action === 'dates') return '• Modified: ' + document.modifiedLabel + '\n• Created: see document information\n• Follow-up: confirm the next review date with the document owner.'
  if (action === 'action-items') return '• Confirm the responsible owner for each open item.\n• Share the approved version with relevant stakeholders.\n• Review progress at the next department meeting.'
  if (action === 'compare') return 'The selected documents cover related office operations. The comparison highlights differences in dates, named owners, and follow-up actions for your review.'
  return `I found the main points in ${document.name}. This demo answer is based on the document preview and is not a live AI response.`
}

export default function DocumentActionDialog({ document, action, documents, onClose, onConfirm }: DocumentActionDialogProps) {
  const [value, setValue] = useState(() => action === 'rename' ? document.name : action === 'convert' ? document.type === 'PDF' ? 'DOCX' : 'PDF' : '')
  const [didAsk, setDidAsk] = useState(false)
  const [shared, setShared] = useState(false)
  const label = aiActionLabels[action]
  const isAiAction = Boolean(label)
  const response = responseFor(document, action)
  const title = actionTitles[action]
  const comparedDocument = documents.find((item) => item.id === value)

  return (
    <div className="document-dialog-layer document-action-layer">
      <button type="button" className="document-dialog-backdrop" aria-label="Close document action" onClick={onClose} />
      <section className="document-action-dialog" role="dialog" aria-modal="true" aria-labelledby="document-action-title">
        <header className="document-action-header"><span className="document-action-icon"><AppIcon name={isAiAction ? 'sparkles' : action === 'delete' ? 'trash' : action === 'share' ? 'share' : action === 'convert' ? 'refresh' : 'file'} size={18} /></span><div><span className="documents-eyebrow">{isAiAction ? 'OFFICEPILOT AI · DEMO' : 'DOCUMENT ACTION'}</span><h2 id="document-action-title">{title}</h2></div><button type="button" className="document-icon-button" aria-label="Close dialog" onClick={onClose}><AppIcon name="close" /></button></header>
        <div className="document-action-body">
          <p className="document-action-document-name">{document.name}</p>
          {action === 'rename' && <label className="document-action-field"><span>Document name</span><input autoFocus value={value} onChange={(event) => setValue(event.target.value)} /></label>}
          {action === 'move' && <label className="document-action-field"><span>Move to folder</span><select autoFocus value={value || document.folder} onChange={(event) => setValue(event.target.value)}>{documentFolders.map((folder) => <option key={folder}>{folder}</option>)}</select></label>}
          {action === 'share' && <><p className="document-action-copy">Share a workspace link with a colleague. This demo does not send an email.</p><label className="document-action-field"><span>Work email</span><input autoFocus type="email" required placeholder="name@organization.com" value={value} onChange={(event) => setValue(event.target.value)} /></label>{shared && <p className="document-action-success" role="status">Demo share link created for {value}.</p>}</>}
          {action === 'convert' && <><p className="document-action-copy">Choose an output format. The original document will remain unchanged.</p><label className="document-action-field"><span>Convert to</span><select autoFocus value={value || (document.type === 'PDF' ? 'DOCX' : 'PDF')} onChange={(event) => setValue(event.target.value)}>{(['PDF', 'DOCX', 'XLSX', 'PPTX'] as DocumentType[]).filter((type) => type !== document.type).map((type) => <option key={type}>{type}</option>)}</select></label></>}
          {action === 'compare' && <><label className="document-action-field"><span>Compare with</span><select value={value} onChange={(event) => setValue(event.target.value)}><option value="">Choose a document</option>{documents.filter((item) => item.id !== document.id && item.status === 'ready').map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>{comparedDocument && <div className="document-ai-response"><span>DEMO RESPONSE</span><p>Compared with {comparedDocument.name}: {response}</p></div>}</>}
          {action === 'ask' && <label className="document-action-field"><span>Your question</span><textarea autoFocus rows={3} value={value} onChange={(event) => setValue(event.target.value)} placeholder="What would you like to know?" /></label>}
          {isAiAction && action !== 'ask' && action !== 'compare' && <div className="document-ai-response"><span>DEMO RESPONSE</span><p>{response}</p></div>}
          {action === 'ask' && didAsk && <div className="document-ai-response"><span>DEMO RESPONSE</span><p>{responseFor(document, 'ask')}<br /><br />Question: {value}</p></div>}
          {action === 'delete' && <div className="document-delete-warning"><AppIcon name="trash" size={17} /><p>This removes the document from the current mock workspace. This action cannot be undone.</p></div>}
          {action === 'move' && <p className="document-action-copy">The document will appear in the selected folder in this demo.</p>}
          {action === 'retry' && <div className="document-action-copy">OfficePilot will try processing this file again. This demo will update its processing state locally.</div>}
          {action === 'share' && shared && <p className="document-action-success" role="status">Shared access has been added in this demo.</p>}
        </div>
        <footer className="document-action-footer"><button type="button" className="document-secondary-button" onClick={onClose}>{isAiAction ? 'Done' : 'Cancel'}</button>{(!isAiAction || action === 'ask') && <button type="button" className={`documents-primary-button ${action === 'delete' ? 'is-danger' : ''}`} disabled={(action === 'rename' && !value.trim()) || (action === 'compare' && !value) || (action === 'ask' && !value.trim()) || (action === 'share' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))} onClick={() => {
          if (action === 'ask' && !didAsk) { setDidAsk(true); return }
          if (action === 'share' && !shared) { setShared(true); return }
          onConfirm(value || undefined)
        }}>{action === 'delete' ? 'Delete document' : action === 'rename' ? 'Save name' : action === 'move' ? 'Move document' : action === 'share' ? shared ? 'Done' : 'Share document' : action === 'convert' ? 'Convert document' : action === 'retry' ? 'Retry processing' : action === 'ask' ? 'Ask OfficePilot' : 'Done'}</button>}</footer>
      </section>
    </div>
  )
}