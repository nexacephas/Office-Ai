import './EmptyRegistry.css'

export default function EmptyRegistry() {
  return (
    <div className="registry-empty-state">
      <div className="empty-badge">No entries</div>
      <h3>No files match this registry view.</h3>
      <p>Try changing the current filters or register a new file to begin a fresh entry.</p>
      <button type="button" className="primary-button">Register file</button>
    </div>
  )
}
