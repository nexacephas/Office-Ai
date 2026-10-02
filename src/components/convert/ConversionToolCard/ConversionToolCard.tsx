import './ConversionToolCard.css'

type Props = {
  title: string
  description: string
  selected: boolean
  onClick: () => void
  icon: string
}

function ToolIcon({ name }: { name: string }) {
  const icons: Record<string, string> = {
    pdf: 'PDF',
    word: 'W',
    excel: 'X',
    ppt: 'P',
    image: 'IMG',
    ocr: 'OCR',
    merge: 'M',
    split: 'S',
    compress: 'C',
  }

  return <span className="tool-card-icon">{icons[name] ?? 'DOC'}</span>
}

export default function ConversionToolCard({ title, description, selected, onClick, icon }: Props) {
  return (
    <button type="button" className={`conversion-tool-card ${selected ? 'is-selected' : ''}`} onClick={onClick}>
      <div className="tool-card-top">
        <ToolIcon name={icon} />
        <span className="tool-card-arrow">→</span>
      </div>
      <strong>{title}</strong>
      <small>{description}</small>
    </button>
  )
}
