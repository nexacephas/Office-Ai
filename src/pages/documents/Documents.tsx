import { useEffect, useState } from 'react'
import './Documents.css'
import { loadMockDocuments } from './documentData'
import { documentFolders } from './documentTypes'
import type { DocumentAction, DocumentDateFilter, DocumentRecord, DocumentScope, DocumentSort, DocumentType, DocumentView } from './documentTypes'
import DocumentHeader from './components/DocumentHeader'
import DocumentToolbar from './components/DocumentToolbar'
import DocumentCollection from './components/DocumentCollection'
import DocumentPreview from './components/DocumentPreview'
import DocumentActionDialog from './components/DocumentActionDialog'
import DocumentUpload from './components/DocumentUpload'

interface ActionRequest {
  documentId: string
  action: DocumentAction
}

const pageSize = 8

function currentDateString(): string {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function sizeInKilobytes(size: string): number {
  const amount = Number.parseFloat(size)
  return size.toLowerCase().includes('mb') ? amount * 1024 : amount
}

function isWithinDays(date: string, today: string, days: number): boolean {
  const age = (Date.parse(`${today}T12:00:00`) - Date.parse(`${date}T12:00:00`)) / 86400000
  return age >= 0 && age <= days
}

function documentTypeFromFile(file: File): DocumentType {
  const extension = file.name.split('.').pop()?.toLowerCase()
  if (extension === 'jpeg') return 'JPG'
  if (extension === 'docx' || extension === 'xlsx' || extension === 'pptx' || extension === 'jpg' || extension === 'png') return extension.toUpperCase() as DocumentType
  return 'PDF'
}

function formatFileSize(bytes: number): string {
  return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`
}

export default function Documents() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [scope, setScope] = useState<DocumentScope>('All')
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<DocumentType | 'All types'>('All types')
  const [folderFilter, setFolderFilter] = useState('All folders')
  const [dateFilter, setDateFilter] = useState<DocumentDateFilter>('any')
  const [sort, setSort] = useState<DocumentSort>('modified-desc')
  const [view, setView] = useState<DocumentView>('list')
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null)
  const [actionRequest, setActionRequest] = useState<ActionRequest | null>(null)
  const [uploadOpen, setUploadOpen] = useState(false)
  const today = currentDateString()

  useEffect(() => {
    let active = true
    loadMockDocuments()
      .then((result) => {
        if (active) {
          setDocuments(result)
          setLoadError(false)
        }
      })
      .catch(() => {
        if (active) setLoadError(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!activeDocumentId && !actionRequest && !uploadOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDocumentId(null)
        setActionRequest(null)
        setUploadOpen(false)
      }
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [activeDocumentId, actionRequest, uploadOpen])

  const activeDocument = documents.find((document) => document.id === activeDocumentId) ?? null
  const actionDocument = documents.find((document) => document.id === actionRequest?.documentId) ?? null
  const recentDocuments = documents.filter((document) => document.status === 'ready').slice().sort((first, second) => second.modifiedAt.localeCompare(first.modifiedAt)).slice(0, 4)

  const filteredDocuments = documents.filter((document) => {
    if (scope === 'My documents' && document.owner !== 'You') return false
    if (scope === 'Shared with me' && !document.sharedWithMe) return false
    if (scope === 'Recent' && !isWithinDays(document.modifiedAt, today, 7)) return false
    if (scope === 'Starred' && !document.starred) return false
    if (typeFilter !== 'All types' && document.type !== typeFilter) return false
    if (folderFilter !== 'All folders' && document.folder !== folderFilter) return false
    if (dateFilter !== 'any') {
      const ageLimit = dateFilter === 'week' ? 7 : 30
      if (!isWithinDays(document.modifiedAt, today, ageLimit)) return false
    }
    const searchValue = query.trim().toLowerCase()
    if (searchValue && ![document.name, document.description, document.referenceNumber, document.preview, document.owner, document.folder].some((value) => value.toLowerCase().includes(searchValue))) return false
    return true
  }).sort((first, second) => {
    if (sort === 'modified-asc') return first.modifiedAt.localeCompare(second.modifiedAt)
    if (sort === 'name-asc') return first.name.localeCompare(second.name)
    if (sort === 'name-desc') return second.name.localeCompare(first.name)
    if (sort === 'size-desc') return sizeInKilobytes(second.size) - sizeInKilobytes(first.size)
    return second.modifiedAt.localeCompare(first.modifiedAt)
  })

  const totalCount = filteredDocuments.length
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize))
  const currentPage = Math.min(page, pageCount)
  const pageDocuments = filteredDocuments.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  function clearFilters() {
    setScope('All')
    setQuery('')
    setTypeFilter('All types')
    setFolderFilter('All folders')
    setDateFilter('any')
    setPage(1)
    setSelectedIds([])
  }

  function toggleStar(document: DocumentRecord) {
    setDocuments((current) => current.map((item) => item.id === document.id ? { ...item, starred: !item.starred } : item))
  }

  function downloadDocument(document: DocumentRecord) {
    const blob = new Blob([`${document.name}\n${document.referenceNumber}\n\n${document.preview}`], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = window.document.createElement('a')
    link.href = url
    link.download = `${document.name.replace(/\.[^.]+$/, '')}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  function handleAction(document: DocumentRecord, action: DocumentAction) {
    if (action === 'download') {
      downloadDocument(document)
      return
    }
    if (action === 'retry') {
      setDocuments((current) => current.map((item) => item.id === document.id ? { ...item, status: 'processing' } : item))
      window.setTimeout(() => setDocuments((current) => current.map((item) => item.id === document.id ? { ...item, status: 'ready', modifiedLabel: 'Just now', modifiedAt: currentDateString() } : item)), 1400)
      return
    }
    setActionRequest({ documentId: document.id, action })
  }

  function confirmAction(value?: string) {
    if (!actionRequest) return
    const { documentId, action } = actionRequest
    if (action === 'delete') {
      setDocuments((current) => current.filter((item) => item.id !== documentId))
      setSelectedIds((current) => current.filter((id) => id !== documentId))
      if (activeDocumentId === documentId) setActiveDocumentId(null)
    } else if (action === 'rename' && value) {
      setDocuments((current) => current.map((item) => item.id === documentId ? { ...item, name: value.trim() } : item))
    } else if (action === 'move' && value) {
      setDocuments((current) => current.map((item) => item.id === documentId ? { ...item, folder: value } : item))
    } else if (action === 'share') {
      setDocuments((current) => current.map((item) => item.id === documentId ? { ...item, sharedWithMe: true } : item))
    } else if (action === 'convert' && value) {
      setDocuments((current) => current.map((item) => item.id === documentId ? { ...item, type: value as DocumentType, name: `${item.name.replace(/\.[^.]+$/, '')}.${value.toLowerCase()}` } : item))
    } else if (action === 'retry') {
      handleAction(documents.find((item) => item.id === documentId)!, 'retry')
    }
    setActionRequest(null)
  }

  function selectDocument(id: string, selected: boolean) {
    setSelectedIds((current) => selected ? [...new Set([...current, id])] : current.filter((item) => item !== id))
  }

  function selectAllOnPage(selected: boolean) {
    setSelectedIds((current) => selected ? [...new Set([...current, ...pageDocuments.map((item) => item.id)])] : current.filter((id) => !pageDocuments.some((item) => item.id === id)))
  }

  function downloadSelected() {
    const selected = documents.filter((item) => selectedIds.includes(item.id))
    const content = selected.map((item) => `${item.name}\n${item.referenceNumber}\n${item.preview}`).join('\n\n---\n\n')
    const url = URL.createObjectURL(new Blob([content], { type: 'text/plain' }))
    const link = window.document.createElement('a')
    link.href = url
    link.download = 'officepilot-selected-documents.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  function addUploadedDocument(file: File) {
    const type = documentTypeFromFile(file)
    const created: DocumentRecord = {
      id: `doc-${crypto.randomUUID()}`,
      name: file.name,
      description: 'Uploaded to your workspace',
      referenceNumber: `UPLOAD-${new Date().getFullYear()}-${String(documents.length + 1).padStart(3, '0')}`,
      type,
      owner: 'You',
      folder: 'Other',
      modifiedAt: today,
      modifiedLabel: 'Just now',
      createdAt: today,
      size: formatFileSize(file.size),
      starred: false,
      sharedWithMe: false,
      status: 'processing',
      preview: 'This uploaded document is being prepared for searchable text and AI actions.',
    }
    setDocuments((current) => [created, ...current])
    setScope('All')
    setFolderFilter('All folders')
    setTypeFilter('All types')
    setDateFilter('any')
    setQuery('')
    setPage(1)
    window.setTimeout(() => setDocuments((current) => current.map((item) => item.id === created.id ? { ...item, status: file.name.toLowerCase().includes('fail') ? 'failed' : 'ready', modifiedLabel: 'Just now' } : item)), 2400)
  }

  function retryLoad() {
    setLoading(true)
    setLoadError(false)
    loadMockDocuments().then(setDocuments).catch(() => setLoadError(true)).finally(() => setLoading(false))
  }

  return (
    <main className="documents-page">
      <DocumentHeader onUpload={() => setUploadOpen(true)} />

      <div className="documents-stat-strip" aria-label="Document summary">
        <div><strong>1,248</strong><span>Documents</span></div><div><strong>36</strong><span>Recent</span></div><div><strong>8</strong><span>Shared with me</span></div><div><strong>12</strong><span>Starred</span></div>
      </div>

      <DocumentToolbar
        scope={scope}
        onScopeChange={(value) => { setScope(value); setPage(1) }}
        query={query}
        onQueryChange={(value) => { setQuery(value); setPage(1) }}
        typeFilter={typeFilter}
        onTypeChange={(value) => { setTypeFilter(value); setPage(1) }}
        folderFilter={folderFilter}
        onFolderChange={(value) => { setFolderFilter(value); setPage(1) }}
        folderOptions={[...documentFolders]}
        dateFilter={dateFilter}
        onDateChange={(value) => { setDateFilter(value); setPage(1) }}
        sort={sort}
        onSortChange={setSort}
        view={view}
        onViewChange={setView}
        onClearFilters={clearFilters}
      />

      <DocumentCollection
        documents={pageDocuments}
        recentDocuments={recentDocuments}
        allDocuments={documents}
        selectedIds={selectedIds}
        view={view}
        activeFolder={folderFilter === 'All folders' ? '' : folderFilter}
        page={currentPage}
        pageCount={pageCount}
        totalCount={totalCount}
        loading={loading}
        loadError={loadError}
        onRetry={retryLoad}
        onOpen={(document) => setActiveDocumentId(document.id)}
        onAction={handleAction}
        onToggleStar={toggleStar}
        onSelect={selectDocument}
        onSelectAll={selectAllOnPage}
        onFolderClick={(folder) => { setFolderFilter((current) => current === folder ? 'All folders' : folder); setPage(1) }}
        onPageChange={setPage}
        onBulkDownload={downloadSelected}
        onClearSelection={() => setSelectedIds([])}
        onClearFilters={clearFilters}
      />

      {activeDocument && <DocumentPreview document={activeDocument} onClose={() => setActiveDocumentId(null)} onAction={(action) => handleAction(activeDocument, action)} />}
      {actionRequest && actionDocument && <DocumentActionDialog document={actionDocument} action={actionRequest.action} documents={documents} onClose={() => setActionRequest(null)} onConfirm={confirmAction} />}
      {uploadOpen && <DocumentUpload onClose={() => setUploadOpen(false)} onUploaded={addUploadedDocument} />}
    </main>
  )
}