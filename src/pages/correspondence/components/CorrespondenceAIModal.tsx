import type { CorrespondenceAIAction, CorrespondenceItem } from '../correspondenceTypes'
import CorrespondenceIcon from './CorrespondenceIcon'
import './CorrespondenceAIModal.css'

interface CorrespondenceAIModalProps {
  item: CorrespondenceItem
  action: Exclude<CorrespondenceAIAction, 'task' | 'documents' | 'forward'>
  onClose: () => void
}

const actionLabels = {
  summarize: 'Summary',
  extract: 'Key information',
  deadlines: 'Deadlines and dates',
  explain: 'Understand this correspondence',
}

function responseFor(item: CorrespondenceItem, action: CorrespondenceAIModalProps['action']): string {
  if (action === 'summarize') return `${item.sender} ${item.type === 'incoming' ? 'is requesting' : 'has sent'} ${item.preview.toLowerCase()} The next step is to review the request and coordinate a timely response.`
  if (action === 'extract') return `Sender: ${item.sender}\nRequest: ${item.subject}\nReference: ${item.referenceNumber}\nDepartment: ${item.department}\nPriority: ${item.priority}`
  if (action === 'deadlines') return item.responseDeadline ? `Response deadline: ${new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(`${item.responseDeadline}T12:00:00`))}\n\nRecommended: confirm the responsible owner and share the response before the due date.` : 'No response deadline is recorded. Consider confirming the expected response date with the sender.'
  return `This is ${item.type} correspondence from ${item.sender} to ${item.recipient}. It concerns ${item.subject.toLowerCase()}. ${item.message}`
}

export default function CorrespondenceAIModal({ item, action, onClose }: CorrespondenceAIModalProps) {
  return <div className="correspondence-dialog-layer correspondence-ai-modal-layer"><button type="button" className="correspondence-dialog-backdrop" aria-label="Close AI insight" onClick={onClose} /><section className="correspondence-ai-modal" role="dialog" aria-modal="true" aria-labelledby="correspondence-ai-title"><header><span className="correspondence-ai-mark"><CorrespondenceIcon name="sparkles" size={18} /></span><div><span className="correspondence-eyebrow">OFFICEPILOT AI · DEMO</span><h2 id="correspondence-ai-title">{actionLabels[action]}</h2></div><button type="button" className="correspondence-icon-button" aria-label="Close AI insight" onClick={onClose}><CorrespondenceIcon name="close" /></button></header><p className="correspondence-ai-source">{item.subject}</p><div className="correspondence-ai-output"><span>MOCK INSIGHT</span><p>{responseFor(item, action)}</p></div><footer><p>Generated from the correspondence preview. No AI service was called.</p><button type="button" className="correspondence-primary-button" onClick={onClose}>Done</button></footer></section></div>
}