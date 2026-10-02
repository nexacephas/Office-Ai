import './ConversionResult.css'

type Props = {
  result: {
    originalName: string
    convertedName: string
    originalType: string
    convertedType: string
    sizeLabel: string
    pages: number
    createdAt: string
  }
  onDownload: () => void
  onSaveToDocuments: () => void
  onAskAI: () => void
  onSummarize: () => void
  onCreateTask: () => void
}

export default function ConversionResult({ result, onDownload, onSaveToDocuments, onAskAI, onSummarize, onCreateTask }: Props) {
  return (
    <section className="conversion-result-panel">
      <div className="result-header">
        <div>
          <span>RESULT</span>
          <h3>{result.convertedName}</h3>
        </div>
        <div className="result-status success">Ready</div>
      </div>

      <div className="result-details">
        <div>
          <label>Original</label>
          <strong>{result.originalName}</strong>
        </div>
        <div>
          <label>Output</label>
          <strong>{result.convertedType}</strong>
        </div>
        <div>
          <label>Size</label>
          <strong>{result.sizeLabel}</strong>
        </div>
        <div>
          <label>Pages</label>
          <strong>{result.pages}</strong>
        </div>
      </div>

      <div className="result-actions">
        <button type="button" className="convert-action-button" onClick={onDownload}>Download</button>
        <button type="button" className="convert-secondary-button" onClick={onSaveToDocuments}>Save to Documents</button>
        <button type="button" className="convert-secondary-button" onClick={onAskAI}>Ask AI</button>
        <button type="button" className="convert-secondary-button" onClick={onSummarize}>Summarize</button>
        <button type="button" className="convert-secondary-button" onClick={onCreateTask}>Create task</button>
      </div>
    </section>
  )
}
