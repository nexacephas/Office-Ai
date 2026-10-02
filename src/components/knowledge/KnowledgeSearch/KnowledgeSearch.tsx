import { useState, type FormEvent } from 'react'
import KnowledgeIcon from '../KnowledgeIcon'
import './KnowledgeSearch.css'

const examples = ['What is the procedure for requesting annual leave?', 'Which documents are required for procurement approval?', 'What is our process for handling incoming correspondence?', 'When is the quarterly report due?']
type Props = { value: string; searching: boolean; onChange: (value: string) => void; onAsk: (question: string) => void }

export default function KnowledgeSearch({ value, searching, onChange, onAsk }: Props) {
  const [exampleIndex, setExampleIndex] = useState(0)
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (value.trim()) onAsk(value.trim()) }
  function rotateExample() { setExampleIndex((current) => (current + 1) % examples.length); onChange(examples[(exampleIndex + 1) % examples.length]) }
  return <section className="knowledge-search-panel" id="knowledge-ask"><div className="knowledge-search-heading"><span><KnowledgeIcon name="book" size={17} /> Ask your organization</span><small>Answers grounded in authorized workplace sources</small></div><form className="knowledge-search-form" onSubmit={submit}><textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder="Ask a question about your workplace..." aria-label="Ask a question about your workplace" rows={2} /><div className="knowledge-search-footer"><button type="button" className="knowledge-example-button" onClick={rotateExample}><KnowledgeIcon name="sparkles" size={15} /> Try an example</button><button type="submit" className="knowledge-primary-button" disabled={!value.trim() || searching}>{searching ? <><span className="knowledge-mini-spinner" /> Searching...</> : <>Ask OfficePilot <KnowledgeIcon name="arrow" size={15} /></>}</button></div></form><div className="knowledge-search-examples"><span>Questions you can ask</span>{examples.map((example) => <button type="button" key={example} onClick={() => { onChange(example); onAsk(example) }}>{example}</button>)}</div></section>
}