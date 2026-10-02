import './BatchConversion.css'

type BatchItem = {
  id: string
  file: string
  inputType: string
  outputType: string
  status: 'Queued' | 'Ready'
}

type Props = {
  batchList: BatchItem[]
  onRemove: (id: string) => void
  onConvert: () => void
}

export default function BatchConversion({ batchList, onRemove, onConvert }: Props) {
  return (
    <section className="batch-panel">
      <div className="batch-panel-header">
        <div>
          <span>BATCH</span>
          <h3>Bulk conversion</h3>
        </div>
        <button type="button" className="convert-primary-button" onClick={onConvert}>Convert all</button>
      </div>

      <div className="batch-list">
        {batchList.map((item) => (
          <div key={item.id} className="batch-item">
            <div>
              <strong>{item.file}</strong>
              <small>{item.inputType} → {item.outputType}</small>
            </div>
            <div className="batch-item-meta">
              <span>{item.status}</span>
              <button type="button" onClick={() => onRemove(item.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
