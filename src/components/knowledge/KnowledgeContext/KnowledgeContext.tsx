import { useNavigate } from 'react-router-dom'
import KnowledgeIcon from '../KnowledgeIcon'
import './KnowledgeContext.css'

type Props = { onManageAccess: () => void; onViewSources: () => void }

export default function KnowledgeContext({ onManageAccess, onViewSources }: Props) {
  const navigate = useNavigate()
  return <aside className="knowledge-context"><div className="knowledge-context-heading"><span><KnowledgeIcon name="shield" size={16} /></span><h2>How OfficePilot uses Knowledge</h2></div><p>OfficePilot searches authorized organizational sources to answer questions and provides the documents or sections used to generate its answers.</p><div className="knowledge-context-permission"><KnowledgeIcon name="lock" size={14} /> Results respect your organization's access permissions.</div><div className="knowledge-context-actions"><button type="button" onClick={onViewSources}>View Knowledge Sources <KnowledgeIcon name="arrow" size={14} /></button><button type="button" onClick={() => { onManageAccess(); navigate('/settings/organization') }}>Manage Access</button></div></aside>
}