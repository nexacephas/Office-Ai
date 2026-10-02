import { useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import './Summarize.css'
import { createMockSummaryResult, defaultFocus, focusOptions, recentDocuments, summaryHistory, summaryStyles } from './summarizeData'
import type { ActionItem, DocumentOption, SummaryFocus, SummaryLength, SummaryResult, SummaryStyle } from './summarizeTypes'

function SummaryIcon({ name, size = 16 }: { name: string; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true as const }
  const icons: Record<string, ReactNode> = {
    upload: <><path d="M12 16V5" /><path d="m7 10 5-5 5 5" /><path d="M5 19v1h14v-1" /></>,
    file: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v6h6" /><path d="M9 13h6M9 17h6" /></>,
    sparkles: <><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" /><path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    copy: <><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></>,
    download: <><path d="M12 3v12m-5-5 5 5 5-5" /><path d="M5 20h14" /></>,
    save: <><path d="M5 3h11l4 4v14H5z" /><path d="M9 3v6h6V3M8 19h8" /></>,
    arrows: <><path d="M7 7h10v10" /><path d="M17 7 7 17" /></>,
    link: <><path d="M10 13a5 5 0 0 0 7.1 0l2-2A5 5 0 0 0 12 4l-1.1 1.1" /><path d="M14 11a5 5 0 0 0-7.1 0l-2 2A5 5 0 0 0 12 20l1.1-1.1" /></>,
    doc: <><path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" /><path d="M14 2v6h6" /><path d="M9 13h6M9 17h6" /></>,
    chevron: <path d="m7 10 5 5 5-5" />, 
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    search: <><circle cx="11" cy="11" r="6" /><path d="m20 20-4.2-4.2" /></>,
    trash: <><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    caret: <><path d="m9 18 6-6-6-6" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    people: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2" /><path d="M3 18c1-2.5 3.6-4 6-4s5 1.5 6 4" /><path d="M15 18c.7-1.3 2-2.2 4-2.4" /></>,
    list: <><path d="M9 6h11M9 12h11M9 18h11" /><circle cx="4" cy="6" r="1" fill="currentColor" /><circle cx="4" cy="12" r="1" fill="currentColor" /><circle cx="4" cy="18" r="1" fill="currentColor" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
  }
  return <svg {...common}>{icons[name] ?? icons.file}</svg>
}

const focusLabels = focusOptions
const focusKeyMap: Record<string, keyof SummaryFocus> = {
  'Key points': 'keyPoints',
  Decisions: 'decisions',
  'Action items': 'actionItems',
  Deadlines: 'deadlines',
  'Names & people': 'people',
  Dates: 'dates',
  Numbers: 'numbers',
  Risks: 'risks',
  Recommendations: 'recommendations',
  Requirements: 'requirements',
}

export default function SummarizePage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [documents, setDocuments] = useState<DocumentOption[]>(recentDocuments)
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null)
  const [style, setStyle] = useState<SummaryStyle>('executive')
  const [length, setLength] = useState<SummaryLength>('standard')
  const [focus, setFocus] = useState<SummaryFocus>(defaultFocus)
  const [instruction, setInstruction] = useState('')
  const [status, setStatus] = useState<'empty' | 'document-selected' | 'generating' | 'generated' | 'saving' | 'saved' | 'error'>('empty')
  const [summary, setSummary] = useState<SummaryResult | null>(null)
  const [toast, setToast] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [compareOpen, setCompareOpen] = useState(false)

  const selectedDocument = useMemo(() => documents.find((document) => document.id === selectedDocumentId) ?? null, [documents, selectedDocumentId])

  function selectDocument(document: DocumentOption) {
    setSelectedDocumentId(document.id)
    setStatus('document-selected')
    setSummary(null)
    setAnswer('')
    setQuestion('')
  }

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const newDocument: DocumentOption = {
      id: `uploaded-${Date.now()}`,
      name: file.name,
      type: `${file.type || 'Document'} upload`,
      sizeLabel: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      updatedAt: 'Uploaded just now',
      pages: 8,
      category: file.name.toLowerCase().endsWith('.pdf') ? 'PDF' : file.name.toLowerCase().endsWith('.docx') ? 'DOCX' : 'TXT',
      sentencePreview: 'OfficePilot has received your uploaded file and is ready to analyze the most important information.',
      previewText: `Uploaded document: ${file.name}\n\nOfficePilot has received your uploaded file and is ready to analyze the most important information.\n\nThe summary workflow is prepared for document-grounded analysis and will use the selected document as the source of truth for decisions, key points, and follow-up actions.`,
    }

    setDocuments((current) => [newDocument, ...current])
    setSelectedDocumentId(newDocument.id)
    setStatus('document-selected')
    setSummary(null)
  }

  function handleFocusToggle(label: keyof SummaryFocus) {
    setFocus((current) => ({ ...current, [label]: !current[label] }))
  }

  function generateSummary() {
    if (!selectedDocument) {
      setStatus('error')
      return
    }

    setStatus('generating')
    setSummary(null)
    setAnswer('')
    const timer = window.setTimeout(() => {
      const generated = createMockSummaryResult(selectedDocument.id, style)
      setSummary(generated)
      setStatus('generated')
      setToast('Summary ready')
      window.clearTimeout(timer)
    }, 1500)
  }

  function handleTryAgain() {
    setStatus('document-selected')
    setSummary(null)
  }

  function handleSaveSummary() {
    setStatus('saving')
    const timer = window.setTimeout(() => {
      setStatus('saved')
      setToast('Summary saved')
      window.clearTimeout(timer)
    }, 900)
  }

  function createTask(item: ActionItem) {
    setToast(`Task created: ${item.title}`)
  }

  function createAllTasks() {
    if (!summary) return
    setToast(`${summary.actionItems.length} tasks created from this summary.`)
  }

  function copySummary() {
    if (!summary) return
    navigator.clipboard?.writeText(summary.executiveSummary).then(() => setToast('Summary copied')).catch(() => setToast('Copy unavailable'))
  }

  function openRelatedRoute(route: string) {
    navigate(route)
  }

  function handleAskQuestion() {
    if (!selectedDocument || !question.trim()) return
    const lower = question.toLowerCase()
    if (lower.includes('deadline')) {
      setAnswer('The main deadlines are October 3 for the Q3 statistics submission, October 5 for the departmental review, and October 10 for the next coordination meeting.')
      return
    }
    if (lower.includes('responsible') || lower.includes('owner')) {
      setAnswer('The Planning Team is responsible for the statistics submission, while the Admin Unit is tracking pending correspondence and the Operations Lead is confirming ownership for open reports.')
      return
    }
    if (lower.includes('decision')) {
      setAnswer('The main decisions were the updated reporting procedure taking effect on October 5, the need for revised statistics before the next review, and the requirement to resolve outstanding correspondence before the deadline.')
      return
    }
    setAnswer('The document emphasizes three priorities: timely reporting, completing outstanding correspondence, and confirming accountability for unresolved actions.')
  }

  return (
    <main className="summarize-page">
      <header className="summarize-page-header">
        <div>
          <span>DOCUMENT UNDERSTANDING</span>
          <h1>Summarize</h1>
          <p>Turn long documents into clear summaries, key points, decisions, and actions.</p>
        </div>
        <button type="button" className="summarize-primary-button" onClick={() => fileInputRef.current?.click()}>
          <SummaryIcon name="file" size={15} />
          Select document
        </button>
        <input ref={fileInputRef} type="file" className="summarize-file-input" onChange={handleUpload} />
      </header>

      <div className="summarize-layout">
        <aside className="summarize-config-panel">
          <section className="summarize-panel">
            <div className="summarize-panel-header">
              <h2>What would you like to summarize?</h2>
            </div>

            {!selectedDocument ? (
              <div className="summarize-upload-zone" onClick={() => fileInputRef.current?.click()}>
                <div className="summarize-upload-badge"><SummaryIcon name="upload" size={20} /></div>
                <strong>Drop a document here</strong>
                <span>PDF, DOCX, PPTX, TXT and supported image documents</span>
                <small>Supported file types</small>
              </div>
            ) : (
              <div className="summarize-document-card">
                <div className="summarize-document-card-top">
                  <span className="summarize-doc-icon"><SummaryIcon name="file" size={17} /></span>
                  <div>
                    <strong>{selectedDocument.name}</strong>
                    <span>{selectedDocument.category} • {selectedDocument.sizeLabel}</span>
                    <small>Uploaded {selectedDocument.updatedAt}</small>
                  </div>
                </div>
                <div className="summarize-document-actions">
                  <button type="button" className="summarize-secondary-button" onClick={() => setPreviewOpen(true)}>View original document</button>
                  <button type="button" className="summarize-link-button" onClick={() => setSelectedDocumentId(null)}>Remove</button>
                </div>
              </div>
            )}

            <div className="summarize-choose-doc-wrapper">
              <button type="button" className="summarize-secondary-button summarize-full-width" onClick={() => fileInputRef.current?.click()}>
                <SummaryIcon name="upload" size={15} />
                Upload document
              </button>
              <div className="summarize-divider"><span>or</span></div>
              <div className="summarize-row-label">Choose from Documents</div>
            </div>
          </section>

          {!selectedDocument && (
            <section className="summarize-panel">
              <div className="summarize-panel-header narrowly">
                <h3>Recent documents</h3>
              </div>
              <div className="summarize-recent-list">
                {documents.map((document) => (
                  <button type="button" key={document.id} className="summarize-recent-item" onClick={() => selectDocument(document)}>
                    <div className="summarize-doc-icon small"><SummaryIcon name="file" size={15} /></div>
                    <div className="summarize-recent-copy">
                      <strong>{document.name}</strong>
                      <span>{document.category} • {document.updatedAt}</span>
                    </div>
                    <span className="summarize-mini-action">Summarize</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {selectedDocument && (
            <>
              <section className="summarize-panel">
                <div className="summarize-panel-header">
                  <h3>How should OfficePilot summarize it?</h3>
                </div>
                <div className="summarize-option-list">
                  {summaryStyles.map((option) => (
                    <button
                      type="button"
                      key={option.id}
                      className={`summarize-option-card ${style === option.id ? 'is-selected' : ''}`}
                      onClick={() => setStyle(option.id)}
                    >
                      <strong>{option.title}</strong>
                      <small>{option.description}</small>
                    </button>
                  ))}
                </div>
              </section>

              <section className="summarize-panel">
                <div className="summarize-panel-header">
                  <h3>Summary length</h3>
                </div>
                <div className="summarize-length-row">
                  {(['short', 'standard', 'detailed'] as SummaryLength[]).map((option) => (
                    <button type="button" key={option} className={`summarize-length-pill ${length === option ? 'is-selected' : ''}`} onClick={() => setLength(option)}>
                      {option}
                    </button>
                  ))}
                </div>
              </section>

              <section className="summarize-panel">
                <div className="summarize-panel-header">
                  <h3>What should I focus on?</h3>
                </div>
                <div className="summarize-focus-list">
                  {focusLabels.map((label) => {
                    const key = focusKeyMap[label]
                    const isEnabled = focus[key] ?? false
                    return (
                      <button type="button" key={label} className={`summarize-focus-chip ${isEnabled ? 'is-selected' : ''}`} onClick={() => handleFocusToggle(key)}>
                        {label}
                      </button>
                    )
                  })}
                </div>
              </section>

              <section className="summarize-panel">
                <div className="summarize-panel-header">
                  <h3>Anything specific you want me to look for?</h3>
                </div>
                <textarea className="summarize-instruction-box" value={instruction} onChange={(event) => setInstruction(event.target.value)} placeholder="e.g. Focus on deadlines, responsibilities, and anything that requires management approval." />
              </section>

              <button type="button" className="summarize-action-button" onClick={generateSummary}>
                <SummaryIcon name="sparkles" size={15} />
                {status === 'generating' ? 'Summarizing…' : 'Summarize document'}
              </button>
            </>
          )}
        </aside>

        <section className="summarize-results-panel">
          {!selectedDocument ? (
            <div className="summarize-empty-state">
              <div className="summarize-empty-icon"><SummaryIcon name="sparkles" size={22} /></div>
              <h2>Understand your documents faster</h2>
              <p>Select a document and let OfficePilot extract the information that matters.</p>
              <button type="button" className="summarize-primary-button" onClick={() => fileInputRef.current?.click()}>
                <SummaryIcon name="file" size={15} />
                Select document
              </button>
            </div>
          ) : status === 'generating' ? (
            <div className="summarize-loading-state">
              <div className="summarize-loading-indicator" />
              <h2>OfficePilot is reading your document...</h2>
              <div className="summarize-loading-steps">
                <span>Analyzing content...</span>
                <span>Extracting key information...</span>
                <span>Preparing your summary...</span>
              </div>
            </div>
          ) : status === 'error' ? (
            <div className="summarize-error-state">
              <h2>We couldn’t summarize this document.</h2>
              <button type="button" className="summarize-primary-button" onClick={handleTryAgain}>Try again</button>
            </div>
          ) : summary ? (
            <div className="summarize-result-content">
              <header className="summarize-result-header">
                <div>
                  <span>SUMMARY</span>
                  <h2>{selectedDocument.name}</h2>
                </div>
                <div className="summarize-result-actions">
                  <button type="button" className="summarize-secondary-button" onClick={generateSummary}><SummaryIcon name="sparkles" size={14} />Regenerate</button>
                  <button type="button" className="summarize-secondary-button" onClick={copySummary}><SummaryIcon name="copy" size={14} />Copy</button>
                  <button type="button" className="summarize-secondary-button" onClick={handleSaveSummary}><SummaryIcon name="save" size={14} />Save</button>
                  <button type="button" className="summarize-secondary-button" onClick={() => setToast('Download started')}><SummaryIcon name="download" size={14} />Download</button>
                </div>
              </header>

              <div className="summarize-section-block">
                <div className="summarize-section-heading">
                  <h3>Executive summary</h3>
                </div>
                <p className="summarize-executive-summary">{summary.executiveSummary}</p>
              </div>

              <div className="summarize-grid-two">
                <div className="summarize-section-block">
                  <div className="summarize-section-heading">
                    <h3>Key points</h3>
                  </div>
                  <ol className="summarize-key-points">
                    {summary.keyPoints.map((point, index) => (
                      <li key={`${point}-${index}`}>
                        <span>{index + 1}</span>
                        <p>{point}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="summarize-section-block">
                  <div className="summarize-section-heading">
                    <h3>Action items</h3>
                  </div>
                  <div className="summarize-action-list">
                    {summary.actionItems.map((item) => (
                      <div className="summarize-action-item" key={item.id}>
                        <div>
                          <strong>{item.title}</strong>
                          <small>Owner: {item.owner}</small>
                          <small>Due: {item.due}</small>
                          <small>Priority: {item.priority}</small>
                        </div>
                        <button type="button" className="summarize-mini-button" onClick={() => createTask(item)}>Create Task</button>
                      </div>
                    ))}
                  </div>
                  <button type="button" className="summarize-inline-action" onClick={createAllTasks}>Create All Tasks</button>
                </div>
              </div>

              <div className="summarize-grid-two">
                <div className="summarize-section-block">
                  <div className="summarize-section-heading">
                    <h3>Important dates</h3>
                  </div>
                  <div className="summarize-date-list">
                    {summary.deadlines.map((deadline) => (
                      <div className="summarize-date-item" key={deadline.id}>
                        <span className="summarize-date-badge">{deadline.date}</span>
                        <p>{deadline.title}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="summarize-section-block">
                  <div className="summarize-section-heading">
                    <h3>Decisions</h3>
                  </div>
                  {summary.decisions.length ? (
                    <ul className="summarize-bullet-list">
                      {summary.decisions.map((decision) => <li key={decision}>{decision}</li>)}
                    </ul>
                  ) : (
                    <p className="summarize-empty-inline">No specific decisions were identified in this document.</p>
                  )}
                </div>
              </div>

              <div className="summarize-grid-two">
                <div className="summarize-section-block">
                  <div className="summarize-section-heading">
                    <h3>People & organizations</h3>
                  </div>
                  <div className="summarize-entity-list">
                    {summary.people.map((person) => (
                      <div className="summarize-entity-item" key={person.id}>
                        <strong>{person.name}</strong>
                        <small>Mentioned {person.mentions} times</small>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="summarize-section-block">
                  <div className="summarize-section-heading">
                    <h3>Risks identified</h3>
                  </div>
                  <ul className="summarize-bullet-list">
                    {summary.risks.map((risk) => <li key={risk}>{risk}</li>)}
                  </ul>
                </div>
              </div>

              <div className="summarize-grid-two">
                <div className="summarize-section-block">
                  <div className="summarize-section-heading">
                    <h3>Recommendations</h3>
                  </div>
                  <ul className="summarize-bullet-list">
                    {summary.recommendations.map((recommendation) => <li key={recommendation}>{recommendation}</li>)}
                  </ul>
                </div>

                <div className="summarize-section-block">
                  <div className="summarize-section-heading">
                    <h3>Sources</h3>
                  </div>
                  <div className="summarize-source-list">
                    {summary.sources.map((source) => (
                      <button type="button" key={source.id} className="summarize-source-item" onClick={() => setPreviewOpen(true)}>
                        <strong>{source.page}</strong>
                        <span>{source.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="summarize-question-panel">
                <h3>Have a question about this document?</h3>
                <div className="summarize-question-row">
                  <input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask a follow-up question..." />
                  <button type="button" className="summarize-primary-button" onClick={handleAskQuestion}>Ask OfficePilot</button>
                </div>
                {answer && <div className="summarize-question-answer">{answer}</div>}
                <div className="summarize-question-examples">
                  <button type="button" onClick={() => setQuestion('What are the main deadlines?')}>What are the main deadlines?</button>
                  <button type="button" onClick={() => setQuestion('Who is responsible for the pending actions?')}>Who is responsible for the pending actions?</button>
                  <button type="button" onClick={() => setQuestion('What decisions were made?')}>What decisions were made?</button>
                </div>
              </div>

              <div className="summarize-section-block summarize-compare-section">
                <div className="summarize-section-heading action-row">
                  <h3>Comparison</h3>
                  <button type="button" className="summarize-secondary-button" onClick={() => setCompareOpen((current) => !current)}>
                    {compareOpen ? 'Hide comparison' : 'Compare with original'}
                  </button>
                </div>
                {compareOpen && (
                  <div className="summarize-compare-grid">
                    <div>
                      <h4>Original document</h4>
                      <pre>{selectedDocument.previewText}</pre>
                    </div>
                    <div>
                      <h4>AI summary</h4>
                      <pre>{summary.executiveSummary}</pre>
                    </div>
                  </div>
                )}
              </div>

              <div className="summarize-grid-two summary-lower-grid">
                <div className="summarize-section-block">
                  <div className="summarize-section-heading">
                    <h3>Related work</h3>
                  </div>
                  <div className="summarize-related-list">
                    {summary.relatedWork.map((item) => (
                      <button type="button" key={item.id} className="summarize-related-item" onClick={() => openRelatedRoute(item.route)}>
                        <span className="summarize-related-type">{item.type}</span>
                        <strong>{item.label}</strong>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="summarize-section-block">
                  <div className="summarize-section-heading">
                    <h3>Recent summaries</h3>
                  </div>
                  <div className="summarize-history-list">
                    {summaryHistory.map((entry) => (
                      <div className="summarize-history-item" key={entry.id}>
                        <div>
                          <strong>{entry.documentTitle}</strong>
                          <small>{entry.generatedAt}</small>
                        </div>
                        <div className="summarize-history-actions">
                          <button type="button">Open</button>
                          <button type="button">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </div>

      {previewOpen && selectedDocument && (
        <div className="summarize-modal-backdrop" onClick={() => setPreviewOpen(false)}>
          <div className="summarize-modal" onClick={(event) => event.stopPropagation()}>
            <header className="summarize-modal-header">
              <div>
                <span>DOCUMENT PREVIEW</span>
                <h3>{selectedDocument.name}</h3>
              </div>
              <button type="button" className="summarize-close-button" onClick={() => setPreviewOpen(false)}><SummaryIcon name="close" size={14} /></button>
            </header>
            <div className="summarize-modal-meta">
              <span>{selectedDocument.type}</span>
              <span>{selectedDocument.sizeLabel}</span>
              <span>{selectedDocument.pages} pages</span>
            </div>
            <div className="summarize-preview-box">
              <pre>{selectedDocument.previewText}</pre>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="summarize-toast">{toast}</div>}
    </main>
  )
}
