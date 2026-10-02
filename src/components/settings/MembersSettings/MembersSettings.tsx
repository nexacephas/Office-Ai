import { useState } from 'react'
import type { WorkspaceMember } from '../../../pages/settings/settingsTypes'
import SettingsSection from '../SettingsSection/SettingsSection'
import MemberTable from '../MemberTable/MemberTable'
import InviteMember from '../InviteMember/InviteMember'
import SettingsIcon from '../SettingsIcon'
import './MembersSettings.css'

export type InviteMemberValues = { name: string; email: string; department: string; role: WorkspaceMember['role'] }
type Props = { members: WorkspaceMember[]; isAdmin: boolean; notice: string; onInvite: (values: InviteMemberValues) => void; onRoleChange: (id: string, role: WorkspaceMember['role']) => void; onToggleStatus: (member: WorkspaceMember) => void; onView: (member: WorkspaceMember) => void }

export default function MembersSettings({ members, isAdmin, notice, onInvite, onRoleChange, onToggleStatus, onView }: Props) {
  const [inviteOpen, setInviteOpen] = useState(false)
  return <><SettingsSection eyebrow="WORKSPACE · ADMIN ONLY" title="Members & Roles" description="Manage workspace access and keep responsibilities clear."><div className="members-toolbar"><div><strong>{members.length} members</strong><span>{members.filter((member) => member.status === 'Active').length} active · {members.filter((member) => member.status === 'Invited').length} invited</span></div>{isAdmin && <button type="button" className="settings-button-primary" onClick={() => setInviteOpen(true)}><SettingsIcon name="plus" size={15} /> Invite member</button>}</div>{!isAdmin && <div className="settings-admin-note">Read-only · Requires administrator permission to manage members.</div>}<MemberTable members={members} isAdmin={isAdmin} onRoleChange={onRoleChange} onToggleStatus={onToggleStatus} onView={onView} />{notice && <p className="settings-inline-message" role="status">{notice}</p>}</SettingsSection>{inviteOpen && <InviteMember onClose={() => setInviteOpen(false)} onSubmit={(values) => { onInvite(values); setInviteOpen(false) }} />}</>
}