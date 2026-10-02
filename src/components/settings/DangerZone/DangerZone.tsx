import SettingsIcon from '../SettingsIcon'
import './DangerZone.css'

export type DangerAction = 'deactivate' | 'delete'

export default function DangerZone({ onAction }: { onAction: (action: DangerAction) => void }) {
  return <section className="settings-danger-zone"><header><span>DANGER ZONE</span><h2>Account actions</h2><p>These actions affect access to your personal OfficePilot account.</p></header><div className="settings-danger-row"><div><strong>Deactivate account</strong><small>Temporarily disable your account. Access can be restored by an administrator.</small></div><button type="button" onClick={() => onAction('deactivate')}>Deactivate</button></div><div className="settings-danger-row"><div><strong>Delete account</strong><small>Permanently remove your account and personal data. This cannot be undone.</small></div><button type="button" onClick={() => onAction('delete')}><SettingsIcon name="trash" size={14} /> Delete account</button></div></section>
}