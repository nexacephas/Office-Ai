import './RegistryTabs.css'

type Props = {
  tabs: readonly string[]
  activeTab: string
  onChange: (tab: string) => void
}

export default function RegistryTabs({ tabs, activeTab, onChange }: Props) {
  return (
    <div className="registry-tabs" role="tablist" aria-label="Registry tabs">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={tab === activeTab}
          className={tab === activeTab ? 'registry-tab active' : 'registry-tab'}
          onClick={() => onChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
