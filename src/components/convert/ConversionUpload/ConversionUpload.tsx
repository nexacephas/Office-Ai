import './ConversionUpload.css'

type Props = {
  selectedTool: { title: string }
  onBrowse: () => void
}

export default function ConversionUpload({ selectedTool, onBrowse }: Props) {
  return (
    <div className="conversion-upload-box" onClick={onBrowse}>
      <div className="upload-icon">⇪</div>
      <strong>Drop your file here</strong>
      <span>or browse from your device</span>
      <small>{selectedTool.title} • PDF files up to 50 MB</small>
    </div>
  )
}
