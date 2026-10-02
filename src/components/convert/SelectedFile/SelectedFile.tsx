import './SelectedFile.css'

type Props = {
  file: {
    name: string
    type: string
    sizeLabel: string
    pages?: number
  }
  onRemove: () => void
}

export default function SelectedFile({ file, onRemove }: Props) {
  return (
    <div className="selected-file-card">
      <div className="selected-file-icon">DOC</div>
      <div className="selected-file-meta">
        <strong>{file.name}</strong>
        <span>{file.type} • {file.sizeLabel}{file.pages ? ` • ${file.pages} pages` : ''}</span>
      </div>
      <button type="button" className="selected-file-remove" onClick={onRemove}>Remove</button>
    </div>
  )
}
