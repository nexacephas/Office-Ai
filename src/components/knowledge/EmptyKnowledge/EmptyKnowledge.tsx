import KnowledgeIcon from '../KnowledgeIcon'
import './EmptyKnowledge.css'

type Props = { mode: 'sources' | 'results'; onAdd?: () => void; onDocuments?: () => void; onAssistant?: () => void }

export default function EmptyKnowledge({ mode, onAdd, onDocuments, onAssistant }: Props) {
  if (mode === 'sources') return <div className="empty-knowledge"><span><KnowledgeIcon name="book" size={23} /></span><h2>Your organization's knowledge is ready to be built.</h2><p>Add policies, procedures, reports, templates, and other trusted workplace documents.</p><button type="button" className="knowledge-primary-button" onClick={onAdd}><KnowledgeIcon name="plus" size={15} /> Add Knowledge Source</button></div>
  return <div className="empty-knowledge empty-knowledge-results"><span><KnowledgeIcon name="search" size={23} /></span><h2>No relevant knowledge found.</h2><p>Try a different question or explore your other workplace sources.</p><ul><li>Try a different question</li><li>Search documents instead</li><li>Ask the AI Assistant</li></ul><div><button type="button" onClick={onDocuments}>Search Documents</button><button type="button" onClick={onAssistant}>Ask AI Assistant</button></div></div>
}