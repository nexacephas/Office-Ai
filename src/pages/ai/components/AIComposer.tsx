import { useRef, useState } from 'react'
import type { ChangeEvent, KeyboardEvent } from 'react'
import type { AttachmentChip } from '../assistantTypes'
import AssistantIcon from './AssistantIcon'
import './AIComposer.css'

interface AIComposerProps {
  initialValue?: string
  thinking: boolean
  onSend: (text: string, attachments: AttachmentChip[], useContext: boolean) => void
}

function sizeLabel(bytes: number): string {
  return bytes > 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`
}

export default function AIComposer({ initialValue = '', thinking, onSend }: AIComposerProps) {
  const [value, setValue] = useState(initialValue)
  const [attachments, setAttachments] = useState<AttachmentChip[]>([])
  const [useContext, setUseContext] = useState(true)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const canSend = Boolean(value.trim() || attachments.length) && !thinking

  function addFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    setAttachments((current) => [...current, ...files.map((file) => ({ id: `attachment-${crypto.randomUUID()}`, name: file.name, type: file.name.split('.').pop()?.toUpperCase() ?? 'FILE', size: sizeLabel(file.size) }))])
    event.target.value = ''
  }

  function send() {
    if (!canSend) return
    onSend(value.trim(), attachments, useContext)
    setValue('')
    setAttachments([])
    if (inputRef.current) inputRef.current.style.height = 'auto'
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      send()
    }
  }

  return <div className="ai-composer-wrap"><div className="ai-composer"><input ref={fileRef} type="file" accept=".pdf,.docx,.xlsx,.pptx,.txt,.png,.jpg,.jpeg" multiple hidden onChange={addFiles} /><div className="ai-composer-attachments">{attachments.map((attachment) => <span className="ai-attachment-chip" key={attachment.id}><AssistantIcon name="file" size={13} /><strong>{attachment.name}</strong><small>{attachment.size}</small><button type="button" aria-label={`Remove ${attachment.name}`} onClick={() => setAttachments((current) => current.filter((item) => item.id !== attachment.id))}><AssistantIcon name="close" size={13} /></button></span>)}</div><textarea ref={inputRef} rows={1} value={value} onChange={(event) => { setValue(event.target.value); event.currentTarget.style.height = 'auto'; event.currentTarget.style.height = `${Math.min(event.currentTarget.scrollHeight, 160)}px` }} onKeyDown={handleKeyDown} placeholder="Ask OfficePilot anything about your work..." aria-label="Ask OfficePilot anything about your work" disabled={thinking} /><div className="ai-composer-controls"><div><button type="button" className="ai-composer-attach" onClick={() => fileRef.current?.click()} disabled={thinking}><AssistantIcon name="paperclip" size={16} />Attach</button><button type="button" className={`ai-use-context ${useContext ? 'is-active' : ''}`} aria-pressed={useContext} onClick={() => setUseContext((enabled) => !enabled)}><span />Use context</button></div><span className="ai-composer-hint">Shift + Enter for a new line</span><button type="button" className="ai-send-button" aria-label="Send message" disabled={!canSend} onClick={send}>{thinking ? <span className="ai-send-spinner" /> : <AssistantIcon name="send" size={16} />}</button></div></div><p className="ai-composer-disclaimer">OfficePilot can make mistakes. Verify important workplace information.</p></div>
}