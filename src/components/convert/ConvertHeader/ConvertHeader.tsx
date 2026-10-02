import './ConvertHeader.css'

export default function ConvertHeader() {
  return (
    <header className="convert-header">
      <div>
        <span>DOCUMENT PROCESSING</span>
        <h1>Convert</h1>
        <p>Convert, process, and prepare workplace documents for whatever comes next.</p>
      </div>
      <div className="convert-header-actions">
        <button type="button" className="convert-secondary-button">View recent conversions</button>
        <button type="button" className="convert-primary-button">Upload document</button>
      </div>
    </header>
  )
}
