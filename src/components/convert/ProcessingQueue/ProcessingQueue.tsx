import './ProcessingQueue.css'

type QueueItem = {
  id: string
  file: string
  operation: string
  progress: number
  status: string
}

type Props = {
  queue: QueueItem[]
}

export default function ProcessingQueue({ queue }: Props) {
  return (
    <section className="processing-panel">
      <div className="processing-panel-header">
        <div>
          <span>QUEUE</span>
          <h3>In progress</h3>
        </div>
        <strong>{queue.length} active</strong>
      </div>

      <div className="processing-list">
        {queue.map((item) => (
          <div key={item.id} className="processing-item">
            <div className="processing-item-top">
              <strong>{item.file}</strong>
              <small>{item.progress}%</small>
            </div>
            <div className="processing-item-meta">
              <span>{item.operation}</span>
              <small>{item.status}</small>
            </div>
            <div className="mini-progress-bar">
              <span style={{ width: `${item.progress}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
