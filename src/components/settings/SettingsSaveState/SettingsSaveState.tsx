import SettingsIcon from '../SettingsIcon'
import type { SettingsSaveStatus } from '../../../pages/settings/settingsTypes'
import './SettingsSaveState.css'

export default function SettingsSaveState({ status }: { status: SettingsSaveStatus }) {
  if (status === 'idle') return null
  const text = status === 'editing' ? 'Unsaved changes' : status === 'saving' ? 'Saving changes...' : status === 'saved' ? 'Changes saved' : 'Changes could not be saved. Try again.'
  return <span className={`settings-save-state is-${status}`} role={status === 'error' ? 'alert' : 'status'}>{status === 'saved' && <SettingsIcon name="check" size={15} />}{text}</span>
}