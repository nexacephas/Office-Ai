import './ConversionWorkspace.css'

type Props = {
  children: React.ReactNode
}

export default function ConversionWorkspace({ children }: Props) {
  return <div className="conversion-workspace-panel">{children}</div>
}
