import { useState } from 'react'
import type { CorrespondenceItem } from '../correspondenceTypes'
import CorrespondenceIcon from './CorrespondenceIcon'
import './AIDraftingModal.css'

interface AIDraftingModalProps {
  item?: CorrespondenceItem
  initialPrompt: string
  onClose: () => void
  onUseDraft: (draft: string) => void
}

function draftFor(item: CorrespondenceItem | undefined, prompt: string, variation: number): string {
  const greeting = item?.sender ? `Dear ${item.sender},` : 'Dear Colleagues,'
  const content = item
    ? `Thank you for your correspondence regarding ${item.subject.toLowerCase()}. We acknowledge receipt and are reviewing the information with the relevant team. ${item.responseDeadline ? 'We will provide the requested update by the indicated response date.' : 'We will follow up with the relevant team and share an update shortly.'}`
    : `This is in reference to your request. ${prompt ? `Regarding ${prompt.replace(/[.]+$/, '')}, ` : ''}we are reviewing the details with the relevant team and will provide a complete update shortly. Please let us know if any additional information is required in the meantime.`
  return `${greeting}\n\n${variation > 0 ? 'Further to our review, ' : ''}${content}\n\nKind regards,\nTransport Planning & Coordination`
}

export default function AIDraftingModal({ item, initialPrompt, onClose, onUseDraft }: AIDraftingModalProps) {
  const [prompt, setPrompt] = useState(initialPrompt)
  const [draft, setDraft] = useState('')
  const [generating, setGenerating] = useState(false)
  const [editing, setEditing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [variation, setVariation] = useState(0)

  function generate(nextVariation = variation) {
    setGenerating(true)
    window.setTimeout(() => {
      setDraft(draftFor(item, prompt, nextVariation))
      setGenerating(false)
      setEditing(false)
    }, 550)
  }

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(draft)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return <div className="correspondence-dialog-layer correspondence-ai-draft-layer"><button type="button" className="correspondence-dialog-backdrop" aria-label="Close AI drafting" onClick={onClose} /><section className="correspondence-ai-draft-modal" role="dialog" aria-modal="true" aria-labelledby="correspondence-ai-draft-title"><header><span className="correspondence-ai-mark"><CorrespondenceIcon name="sparkles" size={18} /></span><div><span className="correspondence-eyebrow">OFFICEPILOT AI · DEMO</span><h2 id="correspondence-ai-draft-title">Draft with OfficePilot</h2></div><button type="button" className="correspondence-icon-button" aria-label="Close AI drafting" onClick={onClose}><CorrespondenceIcon name="close" /></button></header><div className="correspondence-ai-draft-body"><label className="correspondence-ai-prompt"><span>What would you like to communicate?</span><textarea rows={3} value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Draft a formal response acknowledging receipt of the quarterly transport report and request the missing vehicle utilization data." /></label><button type="button" className="correspondence-primary-button" disabled={!prompt.trim() || generating} onClick={() => generate()}>{generating ? <><span className="correspondence-spinner small" />Generating draft…</> : <><CorrespondenceIcon name="sparkles" size={15} />{draft ? 'Regenerate Draft' : 'Generate Draft'}</>}</button>{draft && <div className="correspondence-generated-draft"><div className="correspondence-generated-heading"><div><strong>Draft response</strong><small>Mock AI draft · Review before use</small></div><div><button type="button" className="correspondence-text-action" onClick={() => { setEditing((value) => !value); setCopied(false) }}>{editing ? 'Done editing' : 'Edit'}</button><button type="button" className="correspondence-text-action" onClick={copyDraft}><CorrespondenceIcon name="copy" size={14} />{copied ? 'Copied' : 'Copy'}</button></div></div><textarea aria-label="Generated correspondence draft" rows={8} readOnly={!editing} value={draft} onChange={(event) => setDraft(event.target.value)} /></div>}</div><footer><p>Mock draft for review. No AI service was called.</p>{draft && <div><button type="button" className="correspondence-secondary-button" disabled={generating} onClick={() => { const nextVariation = variation + 1; setVariation(nextVariation); generate(nextVariation) }}>Regenerate</button><button type="button" className="correspondence-primary-button" onClick={() => onUseDraft(draft)}>Use Draft</button></div>}</footer></section></div>
}