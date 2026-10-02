import './RegistryActivity.css'

type Props = {
  files: Array<{
    status: string
    direction: string
  }>
}

export default function RegistryActivity({ files }: Props) {
  const totalRegisteredToday = files.length
  const filesReceived = files.filter((file) => file.direction === 'Incoming').length
  const filesDispatched = files.filter((file) => file.status === 'Dispatched').length
  const filesReturned = files.filter((file) => file.status === 'Returned').length
  const withStaff = files.filter((file) => file.status === 'With Staff').length

  return (
    <section className="registry-section-card">
      <div className="section-header">
        <span>REGISTRY ACTIVITY</span>
        <h3>Daily register</h3>
      </div>
      <div className="activity-grid">
        <div><strong>{totalRegisteredToday}</strong><span>Files registered today</span></div>
        <div><strong>{filesReceived}</strong><span>Files received</span></div>
        <div><strong>{filesDispatched}</strong><span>Files dispatched</span></div>
        <div><strong>{filesReturned}</strong><span>Files returned</span></div>
        <div><strong>{withStaff}</strong><span>Files with staff</span></div>
      </div>
    </section>
  )
}
