import './RelatedWork.css'

type Props = {
  file: {
    relatedDocument: string
    relatedCorrespondence: string
    relatedTask: string
    relatedMeeting: string
  }
}

const items = [
  { label: 'Related Documents', value: 'relatedDocument' },
  { label: 'Related Correspondence', value: 'relatedCorrespondence' },
  { label: 'Related Tasks', value: 'relatedTask' },
  { label: 'Related Meetings', value: 'relatedMeeting' },
] as const

export default function RelatedWork({ file }: Props) {
  return (
    <section className="related-work-panel">
      <div className="detail-block-header">
        <h4>Related Work</h4>
      </div>
      <div className="related-list">
        {items.map((item) => (
          <button key={item.label} type="button" className="related-item">
            <span>{item.label}</span>
            <strong>{file[item.value]}</strong>
          </button>
        ))}
      </div>
    </section>
  )
}
