import './OCRSection.css'

export default function OCRSection() {
  return (
    <section className="ocr-panel">
      <div className="ocr-panel-header">
        <div>
          <span>OCR</span>
          <h3>Document recognition</h3>
        </div>
        <button type="button" className="convert-primary-button">Run OCR</button>
      </div>

      <div className="ocr-options">
        <div>
          <strong>Language</strong>
          <small>English</small>
        </div>
        <div>
          <strong>Output</strong>
          <small>Searchable PDF</small>
        </div>
        <div>
          <strong>Confidence</strong>
          <small>98.4%</small>
        </div>
      </div>
    </section>
  )
}
