import KnowledgeIcon from '../KnowledgeIcon'
import type { KnowledgeAnswer as KnowledgeAnswerRecord } from '../../../pages/knowledge/knowledgeTypes'
import KnowledgeSources from '../KnowledgeSources/KnowledgeSources'
import './KnowledgeAnswer.css'

type Props = { answer: KnowledgeAnswerRecord | null; searching: boolean; onOpenSource: (id: string) => void; onAskAbout: (name: string) => void }

export default function KnowledgeAnswer({ answer, searching, onOpenSource, onAskAbout }: Props) {
  if (searching) return <section className="knowledge-answer knowledge-answer-loading" aria-live="polite"><span className="knowledge-answer-label"><KnowledgeIcon name="sparkles" size={16} /> KNOWLEDGE ANSWER</span><div className="knowledge-answer-searching"><span className="knowledge-search-pulse" /><div><strong>Searching authorized knowledge...</strong><small>Checking relevant policies, procedures, and workplace sources.</small></div></div><div className="knowledge-answer-loading-lines"><i /><i /><i /></div></section>
  if (!answer) return null
  return <section className="knowledge-answer" aria-live="polite"><div className="knowledge-answer-label"><KnowledgeIcon name="sparkles" size={16} /> KNOWLEDGE ANSWER <span>Based on authorized sources</span></div><div className="knowledge-answer-question"><small>YOUR QUESTION</small><h2>{answer.question}</h2></div><div className="knowledge-answer-copy"><h3>Answer</h3><p>{answer.answer}</p></div><div className="knowledge-answer-source-block"><div className="knowledge-answer-source-heading"><h3>Sources</h3><span>{answer.sources.length} internal sources</span></div><KnowledgeSources sources={answer.sources} onOpen={onOpenSource} onAsk={onAskAbout} /></div></section>
}