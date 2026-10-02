import './ApprovalTabs.css'

type Props = {
  tabs: readonly string[]
  activeTab: string
  onChange: (tab: string) => void
}

export default function ApprovalTabs({ tabs, activeTab, onChange }: Props) {
  return (
    <div className="approval-tabs" role="tablist" aria-label="Approval tabs">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={tab === activeTab}
          className={tab === activeTab ? 'approval-tab active' : 'approval-tab'}
          onClick={() => onChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
