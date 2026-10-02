import KnowledgeIcon from '../KnowledgeIcon'
import './KnowledgeError.css'

export default function KnowledgeError({ onRetry, onDocuments }: { onRetry: () => void; onDocuments: () => void }) {
  return <div className="knowledge-error" role="alert"><span><KnowledgeIcon name="info" size={20} /></span><h2>Knowledge search couldn't be completed.</h2><p>Try again or search your Documents workspace.</p><div><button type="button" onClick={onRetry}><KnowledgeIcon name="refresh" size={14} /> Retry</button><button type="button" onClick={onDocuments}>Search Documents</button></div></div>
}