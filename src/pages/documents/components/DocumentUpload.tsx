import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, DragEvent, KeyboardEvent } from 'react'
import { AppIcon } from './DocumentGlyph'
import './DocumentUpload.css'

interface DocumentUploadProps {
  onClose: () => void
  onUploaded: (file: File) => void
}

const supportedFormats = ['pdf', 'docx', 'xlsx', 'pptx', 'jpg', 'png']

export default function DocumentUpload({ onClose, onUploaded }: DocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<number | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [complete, setComplete] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current)
  }, [])

  function selectFile(selected: File | undefined) {
    if (!selected) return
    const extension = selected.name.split('.').pop()?.toLowerCase() ?? ''
    if (!supportedFormats.includes(extension)) {
      setError('This file type is not supported. Choose a PDF, Office file, or image.')
      return
    }
    if (selected.size > 25 * 1024 * 1024) {
      setError('This demo supports files up to 25 MB.')
      return
    }
    setFile(selected)
    setError('')
    setComplete(false)
    setProgress(0)
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    selectFile(event.target.files?.[0])
    event.target.value = ''
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragging(false)
    selectFile(event.dataTransfer.files[0])
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      inputRef.current?.click()
    }
  }

  function startUpload() {
    if (!file || uploading) return
    setUploading(true)
    setError('')
    let nextProgress = 0
    timerRef.current = window.setInterval(() => {
      nextProgress = Math.min(100, nextProgress + 10)
      setProgress(nextProgress)
      if (nextProgress >= 100) {
        if (timerRef.current !== null) window.clearInterval(timerRef.current)
        timerRef.current = null
        onUploaded(file)
        setUploading(false)
        setComplete(true)
      }
    }, 100)
  }

  return (
    <div className="document-dialog-layer document-upload-layer">
      <button type="button" className="document-dialog-backdrop" aria-label="Close upload dialog" onClick={uploading ? undefined : onClose} />
      <section className="document-upload-dialog" role="dialog" aria-modal="true" aria-labelledby="document-upload-title">
        <header className="document-upload-header"><div><span className="documents-eyebrow">YOUR WORKSPACE</span><h2 id="document-upload-title">Upload your document</h2><p>Add a file to the OfficePilot document workspace.</p></div><button type="button" className="document-icon-button" aria-label="Close upload dialog" disabled={uploading} onClick={onClose}><AppIcon name="close" /></button></header>
        <div className="document-upload-body">
          <input ref={inputRef} className="document-upload-input" type="file" accept=".pdf,.docx,.xlsx,.pptx,.jpg,.jpeg,.png" onChange={handleInputChange} aria-label="Browse for a document" />
          {!complete ? <div className={`document-dropzone ${dragging ? 'is-dragging' : ''} ${file ? 'has-file' : ''}`} role="button" tabIndex={uploading ? -1 : 0} aria-label="Choose a document or drop it here" onClick={() => !uploading && inputRef.current?.click()} onKeyDown={handleKeyDown} onDragOver={(event) => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={handleDrop}>
            <span className="document-dropzone-icon"><AppIcon name={file ? 'file' : 'upload'} size={22} /></span>
            {file ? <><strong>{file.name}</strong><p>{(file.size / (1024 * 1024)).toFixed(file.size > 1024 * 1024 ? 1 : 2)} MB · Ready to upload</p></> : <><strong>Drag and drop files here</strong><p>or <span>browse from your computer</span></p></>}
            {!file && <small>PDF, DOCX, XLSX, PPTX, JPG, PNG · Up to 25 MB</small>}
            {file && !uploading && <span className="document-change-file">Choose a different file</span>}
          </div> : <div className="document-upload-complete"><span><AppIcon name="check" size={20} /></span><strong>Document added to your workspace</strong><p>OfficePilot is processing {file?.name} now.</p><small>This demo does not store or upload files to a server.</small></div>}
          {error && <p className="document-upload-error" role="alert">{error}</p>}
          {uploading && <div className="document-upload-progress" role="status"><div><span>Adding document</span><strong>{progress}%</strong></div><span className="document-progress-track"><i style={{ width: `${progress}%` }} /></span><small>Your file is being prepared in this demo.</small></div>}
          <div className="document-upload-note"><AppIcon name="sparkles" size={16} /><p>OfficePilot can help make supported documents searchable and ready for AI actions.</p></div>
        </div>
        <footer className="document-upload-footer"><button type="button" className="document-secondary-button" disabled={uploading} onClick={onClose}>{complete ? 'Close' : 'Cancel'}</button>{!complete && <button type="button" className="documents-primary-button" disabled={!file || uploading} onClick={startUpload}>{uploading ? 'Uploading…' : 'Upload document'}<AppIcon name="upload" size={16} /></button>}</footer>
      </section>
    </div>
  )
}