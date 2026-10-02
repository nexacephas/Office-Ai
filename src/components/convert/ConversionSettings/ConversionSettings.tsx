import type { ConversionSettingsState } from '../../../pages/ai/convert/convertTypes'
import './ConversionSettings.css'

type Props = {
  selectedTool: { id: string; title: string }
  settings: ConversionSettingsState
  onChange: (next: ConversionSettingsState) => void
}

export default function ConversionSettings({ selectedTool, settings, onChange }: Props) {
  const update = (key: keyof ConversionSettingsState, value: string | boolean) => {
    onChange({ ...settings, [key]: value })
  }

  return (
    <div className="conversion-settings-panel">
      <div className="settings-panel-header">
        <h3>{selectedTool.title}</h3>
        <span>Ready to convert</span>
      </div>

      <div className="settings-row">
        <label>Output format</label>
        <select value={settings.outputFormat} onChange={(event) => update('outputFormat', event.target.value)}>
          <option value="DOCX">DOCX</option>
          <option value="PDF">PDF</option>
          <option value="XLSX">XLSX</option>
        </select>
      </div>

      <div className="settings-row">
        <label>Processing mode</label>
        <select value={settings.mode ?? 'High quality'} onChange={(event) => update('mode', event.target.value)}>
          <option value="Editable document">Editable document</option>
          <option value="High quality">High quality</option>
          <option value="Fastest">Fastest</option>
          <option value="Balanced">Balanced</option>
        </select>
      </div>

      {selectedTool.id === 'pdf-to-word' || selectedTool.id === 'word-to-pdf' ? (
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={Boolean(settings.preserveLayout)}
            onChange={(event) => update('preserveLayout', event.target.checked)}
          />
          Preserve original layout
        </label>
      ) : null}

      {selectedTool.id === 'pdf-to-excel' ? (
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={Boolean(settings.detectTables)}
            onChange={(event) => update('detectTables', event.target.checked)}
          />
          Detect tables and structured fields
        </label>
      ) : null}

      {selectedTool.id === 'ocr-scan' ? (
        <div className="settings-row">
          <label>Language</label>
          <select value={settings.language ?? 'English'} onChange={(event) => update('language', event.target.value)}>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
          </select>
        </div>
      ) : null}
    </div>
  )
}
