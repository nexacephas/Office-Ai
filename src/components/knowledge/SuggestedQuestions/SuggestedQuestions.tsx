import { suggestionQuestions } from '../../../pages/knowledge/knowledgeData'
import './SuggestedQuestions.css'

export default function SuggestedQuestions({ onAsk }: { onAsk: (question: string) => void }) {
  return <section className="suggested-questions"><h2>Try asking</h2><div>{suggestionQuestions.map((question) => <button key={question} type="button" onClick={() => onAsk(question)}>{question}</button>)}</div></section>
}