import './ConversionProgress.css'

const steps = [
  'Uploading document',
  'Recognizing content',
  'Converting file',
  'Formatting output',
]

export default function ConversionProgress() {
  return (
    <section className="conversion-progress-panel">
      <div className="conversion-progress-heading">
        <div>
          <span>PROCESSING</span>
          <h3>Conversion in progress</h3>
        </div>
        <strong>76%</strong>
      </div>

      <div className="progress-bar">
        <span style={{ width: '76%' }} />
      </div>

      <div className="progress-steps">
        {steps.map((step, index) => (
          <div key={step} className={`progress-step ${index <= 2 ? 'active' : ''}`}>
            <span>{index + 1}</span>
            <small>{step}</small>
          </div>
        ))}
      </div>
    </section>
  )
}
