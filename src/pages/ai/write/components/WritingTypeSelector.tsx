import type { WritingType } from '../writerTypes'
import { writingTypes } from '../writerData'
import WriterIcon from './WriterIcon'
import './WritingTypeSelector.css'

export default function WritingTypeSelector({ selected, onSelect }: { selected: WritingType; onSelect: (type: WritingType) => void }) {
  return <section className="writing-type-section" aria-labelledby="writing-type-heading"><div className="writing-section-heading"><div><h2 id="writing-type-heading">What do you want to write?</h2><p>Choose a starting point; you can refine the format later.</p></div><span>DOCUMENT TYPE</span></div><div className="writing-type-list">{writingTypes.map((type) => <button type="button" key={type.id} className={`writing-type-card ${selected === type.id ? 'is-active' : ''}`} aria-pressed={selected === type.id} onClick={() => onSelect(type.id)}><span className="writing-type-icon"><WriterIcon name={type.icon} size={17} /></span><span><strong>{type.title}</strong><small>{type.description}</small></span></button>)}</div></section>
}