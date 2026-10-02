import { useState, type FormEvent } from 'react'
import type { InviteMemberValues } from '../MembersSettings/MembersSettings'
import type { WorkspaceMember } from '../../../pages/settings/settingsTypes'
import SettingsIcon from '../SettingsIcon'
import './InviteMember.css'

type Props = { onClose: () => void; onSubmit: (values: InviteMemberValues) => void }

export default function InviteMember({ onClose, onSubmit }: Props) {
  const [values, setValues] = useState<InviteMemberValues>({ name: '', email: '', department: '', role: 'Member' })
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); onSubmit(values) }
  return <div className="settings-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className="invite-member-modal" role="dialog" aria-modal="true" aria-labelledby="invite-member-title"><header><div><span>WORKSPACE ACCESS</span><h2 id="invite-member-title">Invite member</h2></div><button type="button" aria-label="Close invite form" onClick={onClose}><SettingsIcon name="close" /></button></header><form onSubmit={submit}><label className="settings-field"><span>Name</span><input required value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} /></label><label className="settings-field"><span>Email</span><input required type="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} /></label><label className="settings-field"><span>Department</span><input required value={values.department} onChange={(event) => setValues({ ...values, department: event.target.value })} /></label><label className="settings-field"><span>Role</span><select value={values.role} onChange={(event) => setValues({ ...values, role: event.target.value as WorkspaceMember['role'] })}><option>Manager</option><option>Member</option><option>Viewer</option></select></label><p>Invitation is simulated for this frontend preview.</p><footer><button type="button" className="settings-button-secondary" onClick={onClose}>Cancel</button><button type="submit" className="settings-button-primary">Send invitation</button></footer></form></section></div>
}