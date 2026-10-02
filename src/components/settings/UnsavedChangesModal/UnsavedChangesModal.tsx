import { useState } from 'react'
import SettingsIcon from '../SettingsIcon'
import './UnsavedChangesModal.css'

type Props = { mode: 'unsaved' | 'danger'; title: string; description: string; confirmLabel: string; requiredPhrase?: string; onStay: () => void; onConfirm: () => void }

export default function UnsavedChangesModal({ mode, title, description, confirmLabel, requiredPhrase, onStay, onConfirm }: Props) {
  const [confirmation, setConfirmation] = useState('')
  return <div className="settings-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onStay() }}><section className="settings-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="settings-confirm-title"><button type="button" className="settings-modal-close" onClick={onStay} aria-label="Close dialog"><SettingsIcon name="close" size={18} /></button><span className={`settings-confirm-icon${mode === 'danger' ? ' is-danger' : ''}`}><SettingsIcon name={mode === 'danger' ? 'trash' : 'info'} size={20} /></span><h2 id="settings-confirm-title">{title}</h2><p>{description}</p>{requiredPhrase && <label className="settings-confirm-phrase">Type <strong>{requiredPhrase}</strong> to confirm<input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} autoComplete="off" /></label>}<div className="settings-modal-actions"><button type="button" className="settings-modal-cancel" onClick={onStay}>{mode === 'unsaved' ? 'Stay' : 'Cancel'}</button><button type="button" className={mode === 'danger' ? 'settings-modal-danger' : 'settings-modal-confirm'} disabled={Boolean(requiredPhrase && confirmation !== requiredPhrase)} onClick={onConfirm}>{confirmLabel}</button></div></section></div>
}