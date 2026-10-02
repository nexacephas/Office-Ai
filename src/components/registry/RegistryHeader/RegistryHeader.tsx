import './RegistryHeader.css'

type Props = {
  onRegister: () => void
  onRecordMovement: () => void
}

export default function RegistryHeader({ onRegister, onRecordMovement }: Props) {
  return (
    <header className="registry-header">
      <div className="registry-header-copy">
        <span className="eyebrow">OFFICE REGISTRY</span>
        <h1>Files &amp; Registry</h1>
        <p>Track official files, references, movement, custody, and registry history.</p>
      </div>
      <div className="registry-header-actions">
        <button type="button" className="secondary-button" onClick={onRecordMovement}>Record Movement</button>
        <button type="button" className="primary-button" onClick={onRegister}>Register File</button>
      </div>
    </header>
  )
}
