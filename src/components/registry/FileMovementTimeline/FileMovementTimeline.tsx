import './FileMovementTimeline.css'

type EventItem = {
  id: string
  date: string
  movement: string
  from: string
  to: string
  person: string
  remarks: string
}

type Props = {
  events: EventItem[]
}

export default function FileMovementTimeline({ events }: Props) {
  return (
    <section className="detail-block timeline-block">
      <div className="detail-block-header">
        <h4>Movement History</h4>
      </div>

      <div className="timeline-list">
        {events.map((event) => (
          <div key={event.id} className="timeline-item">
            <div className="timeline-dot" />
            <div className="timeline-content">
              <strong>{event.date}</strong>
              <h5>{event.movement}</h5>
              <p>{event.from} → {event.to}</p>
              <small>{event.person}</small>
              <span>{event.remarks}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
