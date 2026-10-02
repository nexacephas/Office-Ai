import { useMemo, useState } from 'react'
import './WriteStudio.css'
import WriterIcon from './components/WriterIcon'
import WritingTypeSelector from './components/WritingTypeSelector'
import { createMockDraft, recentDrafts, writingTemplates, writingTypes } from './writerData'
import type { DraftDocument, WritingAudience, WritingLength, WritingSettings, WritingTone, WritingType } from './writerTypes'

const toneOptions: WritingTone[] = ['professional', 'formal', 'concise', 'friendly', 'persuasive']
const lengthOptions: WritingLength[] = ['short', 'standard', 'detailed']
const audienceOptions: WritingAudience[] = ['internal', 'management', 'client', 'official', 'general']

function formatDateLabel() {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date())
}

export default function WriteStudio() {
  const [selectedType, setSelectedType] = useState<WritingType>('memo')
  const [brief, setBrief] = useState('Quarterly department update and action plan')
  const [title, setTitle] = useState('Quarterly Department Update')
  const [settings, setSettings] = useState<WritingSettings>({
    tone: 'professional',
    length: 'standard',
    audience: 'internal',
    language: 'English',
    useOrganizationStyle: true,
  })
  const [content, setContent] = useState(() => createMockDraft('memo', 'Quarterly department update and action plan', 'internal', formatDateLabel()).content)
  const [drafts, setDrafts] = useState<DraftDocument[]>(recentDrafts)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(writingTemplates[0].id)

  const activeTemplate = useMemo(
    () => writingTemplates.find((template) => template.id === selectedTemplateId) ?? writingTemplates[0],
    [selectedTemplateId],
  )

  function updateSetting<K extends keyof WritingSettings>(key: K, value: WritingSettings[K]) {
    setSettings((current) => ({ ...current, [key]: value }))
  }

  function handleTypeChange(type: WritingType) {
    setSelectedType(type)
    const matchingType = writingTypes.find((item) => item.id === type)
    if (!matchingType) return
    const matchingTemplate = writingTemplates.find((template) => template.type === type)
    if (matchingTemplate) {
      setSelectedTemplateId(matchingTemplate.id)
      setBrief(matchingTemplate.prompt)
      setTitle(matchingTemplate.title)
      const generated = createMockDraft(type, matchingTemplate.prompt, settings.audience, formatDateLabel())
      setContent(generated.content)
      return
    }
    setTitle(`${matchingType.title} Draft`)
    const generated = createMockDraft(type, brief || 'Department update', settings.audience, formatDateLabel())
    setContent(generated.content)
  }

  function handleApplyTemplate(templateId: string) {
    const template = writingTemplates.find((item) => item.id === templateId)
    if (!template) return
    setSelectedTemplateId(template.id)
    setSelectedType(template.type)
    setBrief(template.prompt)
    setTitle(template.title)
    const generated = createMockDraft(template.type, template.prompt, settings.audience, formatDateLabel())
    setContent(generated.content)
  }

  function handleGenerateDraft() {
    const generated = createMockDraft(selectedType, brief, settings.audience, formatDateLabel())
    const draft: DraftDocument = {
      id: `draft-${Date.now()}`,
      title: title.trim() || generated.title,
      type: selectedType,
      content,
      status: 'draft',
      updatedAt: 'Just now',
    }
    setDrafts((current) => [draft, ...current.filter((item) => item.id !== draft.id)].slice(0, 5))
  }

  const templateMatches = writingTemplates.filter((template) => template.type === selectedType)

  return (
    <main className="writer-studio-page">
      <header className="writer-page-header">
        <div>
          <span>OFFICE AI</span>
          <h1>Writing Studio</h1>
          <p>Draft polished workplace documents, letters, notices, reports, and follow-ups faster.</p>
        </div>
        <div className="writer-page-actions">
          <button type="button" className="writer-secondary-button">
            <WriterIcon name="copy" size={15} />
            Duplicate
          </button>
          <button type="button" className="writer-primary-button" onClick={handleGenerateDraft}>
            <WriterIcon name="sparkles" size={15} />
            Generate draft
          </button>
        </div>
      </header>

      <div className="writer-shell">
        <aside className="writer-sidebar">
          <WritingTypeSelector selected={selectedType} onSelect={handleTypeChange} />

          <section className="writer-panel">
            <div className="writer-panel-header">
              <div>
                <h3>Templates</h3>
                <p>Use a fast start for documents you write often.</p>
              </div>
            </div>

            <div className="writer-template-list">
              {templateMatches.length ? (
                templateMatches.map((template) => (
                  <button
                    type="button"
                    key={template.id}
                    className={`writer-template-card ${selectedTemplateId === template.id ? 'is-active' : ''}`}
                    onClick={() => handleApplyTemplate(template.id)}
                  >
                    <span className="writer-template-label">{template.category}</span>
                    <strong>{template.title}</strong>
                    <small>{template.description}</small>
                  </button>
                ))
              ) : (
                <div className="writer-empty-inline">No templates yet for this document type.</div>
              )}
            </div>
          </section>
        </aside>

        <section className="writer-editor-panel">
          <div className="writer-editor-toolbar">
            <div className="writer-toolbar-group">
              <button type="button" className="writer-tool-button" aria-label="Bold"><WriterIcon name="bold" size={15} /></button>
              <button type="button" className="writer-tool-button" aria-label="Italic"><WriterIcon name="italic" size={15} /></button>
              <button type="button" className="writer-tool-button" aria-label="Underline"><WriterIcon name="underline" size={15} /></button>
              <button type="button" className="writer-tool-button" aria-label="Align"><WriterIcon name="align" size={15} /></button>
            </div>
            <div className="writer-toolbar-group">
              <button type="button" className="writer-tool-button" aria-label="List"><WriterIcon name="bullet" size={15} /></button>
              <button type="button" className="writer-tool-button" aria-label="Numbered list"><WriterIcon name="numbered" size={15} /></button>
              <button type="button" className="writer-tool-button" aria-label="Insert link"><WriterIcon name="link" size={15} /></button>
            </div>
          </div>

          <div className="writer-form-grid">
            <label>
              <span>Document title</span>
              <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Enter document name" />
            </label>

            <label>
              <span>Language</span>
              <select value={settings.language} onChange={(event) => updateSetting('language', event.target.value)}>
                <option>English</option>
                <option>French</option>
                <option>Spanish</option>
                <option>Swahili</option>
              </select>
            </label>

            <label>
              <span>Tone</span>
              <select value={settings.tone} onChange={(event) => updateSetting('tone', event.target.value as WritingTone)}>
                {toneOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <label>
              <span>Length</span>
              <select value={settings.length} onChange={(event) => updateSetting('length', event.target.value as WritingLength)}>
                {lengthOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <label>
              <span>Audience</span>
              <select value={settings.audience} onChange={(event) => updateSetting('audience', event.target.value as WritingAudience)}>
                {audienceOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="writer-toggle-row">
              <span>Use organisation style</span>
              <input
                type="checkbox"
                checked={settings.useOrganizationStyle}
                onChange={(event) => updateSetting('useOrganizationStyle', event.target.checked)}
              />
            </label>
          </div>

          <div className="writer-brief-box">
            <label>
              <span>Brief</span>
              <textarea value={brief} onChange={(event) => setBrief(event.target.value)} placeholder="Describe the purpose of the document" />
            </label>
          </div>

          <div className="writer-editor-card">
            <div className="writer-editor-header">
              <div className="writer-editor-title">
                <WriterIcon name="writing" size={15} />
                <span>{title || 'Untitled draft'}</span>
              </div>
              <div className="writer-editor-meta">
                <span>{activeTemplate.title}</span>
                <span>{settings.tone}</span>
              </div>
            </div>

            <textarea value={content} onChange={(event) => setContent(event.target.value)} className="writer-editor-area" />
          </div>
        </section>

        <aside className="writer-context-panel">
          <section className="writer-panel">
            <div className="writer-panel-header">
              <div>
                <h3>Recent drafts</h3>
                <p>Continue where you left off.</p>
              </div>
            </div>

            <div className="writer-draft-list">
              {drafts.map((draft) => (
                <button type="button" key={draft.id} className="writer-draft-item" onClick={() => { setTitle(draft.title); setContent(draft.content); setSelectedType(draft.type) }}>
                  <span className="writer-draft-type"><WriterIcon name={writingTypes.find((type) => type.id === draft.type)?.icon ?? 'file'} size={14} /></span>
                  <span>
                    <strong>{draft.title}</strong>
                    <small>{draft.updatedAt}</small>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="writer-panel">
            <div className="writer-panel-header">
              <div>
                <h3>Smart suggestions</h3>
                <p>Recommended next steps for this draft.</p>
              </div>
            </div>

            <ul className="writer-suggestion-list">
              <li><WriterIcon name="check" size={14} />Open with a clear purpose statement</li>
              <li><WriterIcon name="check" size={14} />Add a decision or action owner</li>
              <li><WriterIcon name="check" size={14} />Keep the closing concise and direct</li>
            </ul>
          </section>
        </aside>
      </div>
    </main>
  )
}
