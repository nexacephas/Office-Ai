import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { AppIcon } from './DocumentGlyph'
import './DocumentHeader.css'

interface DocumentHeaderProps {
  onUpload: () => void
}

export default function DocumentHeader({ onUpload }: DocumentHeaderProps) {
  const navigate = useNavigate()
  const [prompt, setPrompt] = useState('')

  function askOfficePilot() {
    navigate('/ai', { state: { prompt: prompt.trim() || 'Help me find something in my documents.' } })
  }

  return (
    <header className="documents-header">
      <div className="documents-header__top">
        <div className="documents-header__copy">
          <span className="documents-eyebrow">YOUR WORKSPACE</span>
          <h1>Documents</h1>
          <p>Organize, find, understand, and work with your office documents.</p>
        </div>
        <button type="button" className="documents-primary-button" onClick={onUpload}><AppIcon name="upload" /><span>Upload document</span></button>
      </div>
      <form className="documents-ai-search" onSubmit={(event) => { event.preventDefault(); askOfficePilot() }}>
        <span className="documents-ai-search__icon"><AppIcon name="sparkles" size={18} /></span>
        <label className="documents-ai-search__content">
          <span>Need something from your documents?</span>
          <input value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ask OfficePilot to find, summarize, or compare a document..." aria-label="Ask OfficePilot about your documents" />
        </label>
        <button type="submit" className="documents-ai-search__button">Ask OfficePilot<AppIcon name="arrow" size={16} /></button>
      </form>
    </header>
  )
}