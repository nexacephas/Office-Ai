import { conversionTools } from '../../../pages/ai/convert/convertData'
import ConversionToolCard from '../ConversionToolCard/ConversionToolCard'
import './ConversionTools.css'

type Props = {
  selectedToolId: string
  onSelect: (toolId: any) => void
}

export default function ConversionTools({ selectedToolId, onSelect }: Props) {
  return (
    <div className="conversion-tools-grid">
      {conversionTools.map((tool) => (
        <ConversionToolCard
          key={tool.id}
          title={tool.title}
          description={tool.description}
          selected={tool.id === selectedToolId}
          icon={tool.icon}
          onClick={() => onSelect(tool.id)}
        />
      ))}
    </div>
  )
}
