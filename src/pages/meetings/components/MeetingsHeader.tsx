import MeetingIcon from './MeetingIcon'
import './MeetingsHeader.css'

export default function MeetingsHeader({ onSchedule, onPrepare }: { onSchedule: () => void; onPrepare: () => void }) {
  return <header className="meetings-header"><div><span className="meetings-eyebrow">WORKSPACE</span><h1>Meetings</h1><p>Plan meetings, prepare with context, capture decisions, and keep follow-ups on track.</p></div><div className="meetings-header-actions"><button type="button" className="meetings-ai-button" onClick={onPrepare}><MeetingIcon name="sparkles" size={16} />Prepare with AI</button><button type="button" className="meetings-primary-button" onClick={onSchedule}><MeetingIcon name="plus" size={17} />Schedule Meeting</button></div></header>
}