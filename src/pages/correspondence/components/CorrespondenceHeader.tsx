import { useNavigate } from 'react-router-dom'
import CorrespondenceIcon from './CorrespondenceIcon'
import './CorrespondenceHeader.css'

interface CorrespondenceHeaderProps {
  onNew: () => void
}

export default function CorrespondenceHeader({ onNew }: CorrespondenceHeaderProps) {
  const navigate = useNavigate()
  return (
    <header className="correspondence-header">
      <div><span className="correspondence-eyebrow">OFFICE COMMUNICATIONS</span><h1>Correspondence</h1><p>Track incoming and outgoing communication, responses, references, and follow-ups.</p></div>
      <div className="correspondence-header-actions">
        <button type="button" className="correspondence-ai-button" onClick={() => navigate('/ai/write', { state: { prompt: 'Draft formal workplace correspondence.' } })}><CorrespondenceIcon name="sparkles" size={16} />Draft with AI</button>
        <button type="button" className="correspondence-primary-button" onClick={onNew}><CorrespondenceIcon name="plus" size={17} />New Correspondence</button>
      </div>
    </header>
  )
}