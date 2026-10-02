import './ConversionAI.css'

export default function ConversionAI() {
  return (
    <section className="ai-panel">
      <div className="ai-panel-header">
        <div>
          <span>AI ASSISTANT</span>
          <h3>Smart summary</h3>
        </div>
      </div>

      <div className="ai-summary-box">
        <p>
          This conversion extracted the key action items, deadlines, and legal pointers from the original document.
        </p>
        <ul>
          <li>Three approvals are still pending.</li>
          <li>Budget review is due Friday at 3:00 PM.</li>
          <li>Legal notes were highlighted for sign-off.</li>
        </ul>
      </div>
    </section>
  )
}
