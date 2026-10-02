import SettingsSection from '../SettingsSection/SettingsSection'
import './UsageSettings.css'

const usage = [{ label: 'AI requests', value: 2840, limit: 5000, unit: 'requests' }, { label: 'Document processing', value: 716, limit: 1200, unit: 'documents' }, { label: 'OCR pages', value: 620, limit: 1000, unit: 'pages' }, { label: 'Document storage', value: 18.4, limit: 50, unit: 'GB' }, { label: 'Conversions', value: 164, limit: 500, unit: 'conversions' }]

export default function UsageSettings() {
  return <SettingsSection eyebrow="PLAN" title="Usage" description="A concise view of current workspace consumption against plan limits."><div className="usage-period"><span>Current billing period</span><strong>October 1 – October 31, 2026</strong></div><div className="usage-list">{usage.map((item) => { const percent = Math.min(100, Math.round((item.value / item.limit) * 100)); return <div className="usage-meter" key={item.label}><div className="usage-meter-heading"><strong>{item.label}</strong><span>{item.value.toLocaleString()} / {item.limit.toLocaleString()} {item.unit}</span></div><div className="usage-track" role="progressbar" aria-label={item.label} aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${percent}%` }} /></div><small>{percent}% of included usage</small></div> })}</div></SettingsSection>
}