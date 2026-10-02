import { useState } from 'react'
import type { Conversation } from '../assistantTypes'
import AssistantIcon from './AssistantIcon'
import './ConversationSidebar.css'

interface ConversationSidebarProps {
  conversations: Conversation[]
  activeId: string | null
  search: string
  onSearchChange: (value: string) => void
  onSelect: (id: string) => void
  onNew: () => void
  onRename: (id: string, title: string) => void
  onArchive: (id: string) => void
  onDelete: (id: string) => void
  onClear: (id: string) => void
  onClose?: () => void
  mobile?: boolean
}

function ConversationItem({ conversation, active, onSelect, onRename, onArchive, onDelete, onClear }: { conversation: Conversation; active: boolean; onSelect: () => void; onRename: (title: string) => void; onArchive: () => void; onDelete: () => void; onClear: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [title, setTitle] = useState(conversation.title)

  function saveRename() {
    if (title.trim()) onRename(title.trim())
    setRenaming(false)
    setMenuOpen(false)
  }

  return <article className={`conversation-item ${active ? 'is-active' : ''}`}>
    {renaming ? <form className="conversation-rename-form" onSubmit={(event) => { event.preventDefault(); saveRename() }}><input autoFocus aria-label="Conversation title" value={title} onChange={(event) => setTitle(event.target.value)} /><button type="submit" aria-label="Save title"><AssistantIcon name="check" size={14} /></button><button type="button" aria-label="Cancel rename" onClick={() => { setTitle(conversation.title); setRenaming(false) }}><AssistantIcon name="close" size={14} /></button></form> : <><button type="button" className="conversation-item-select" onClick={onSelect}><span className="conversation-item-title">{conversation.title}</span><small>{conversation.updatedAt}</small></button><button type="button" className="conversation-menu-trigger" aria-label={`Conversation actions for ${conversation.title}`} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><AssistantIcon name="more" size={16} /></button>{menuOpen && <><button type="button" className="conversation-menu-dismiss" aria-label="Close conversation menu" onClick={() => setMenuOpen(false)} /><div className="conversation-item-menu" role="menu"><button type="button" role="menuitem" onClick={() => { setRenaming(true); setMenuOpen(false) }}>Rename</button><button type="button" role="menuitem" onClick={() => { onClear(); setMenuOpen(false) }}>Clear conversation</button><button type="button" role="menuitem" onClick={() => { onArchive(); setMenuOpen(false) }}>{conversation.archived ? 'Unarchive' : 'Archive'}</button><button type="button" role="menuitem" className="is-danger" onClick={() => { onDelete(); setMenuOpen(false) }}>Delete</button></div></>}</>}
  </article>
}

export default function ConversationSidebar({ conversations, activeId, search, onSearchChange, onSelect, onNew, onRename, onArchive, onDelete, onClear, onClose, mobile = false }: ConversationSidebarProps) {
  const activeConversations = conversations.filter((conversation) => !conversation.archived)
  const archivedConversations = conversations.filter((conversation) => conversation.archived)
  const query = search.trim().toLowerCase()
  const filtered = activeConversations.filter((conversation) => conversation.title.toLowerCase().includes(query))
  const filteredArchived = archivedConversations.filter((conversation) => conversation.title.toLowerCase().includes(query))

  return <aside className={`conversation-sidebar ${mobile ? 'is-mobile-drawer' : ''}`} aria-label="Conversation history">
    <header className="conversation-sidebar-header"><div><span>WORKSPACE AI</span><h2>Conversations</h2></div>{mobile && <button type="button" className="conversation-sidebar-close" aria-label="Close conversation history" onClick={onClose}><AssistantIcon name="close" /></button>}</header>
    <button type="button" className="conversation-new-button" onClick={onNew}><AssistantIcon name="plus" size={16} />New conversation</button>
    <label className="conversation-search"><AssistantIcon name="search" size={15} /><input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search conversations..." aria-label="Search conversations" />{search && <button type="button" aria-label="Clear conversation search" onClick={() => onSearchChange('')}><AssistantIcon name="close" size={13} /></button>}</label>
    <div className="conversation-sidebar-list">{filtered.length ? filtered.map((conversation) => <ConversationItem key={conversation.id} conversation={conversation} active={activeId === conversation.id} onSelect={() => { onSelect(conversation.id); onClose?.() }} onRename={(title) => onRename(conversation.id, title)} onArchive={() => onArchive(conversation.id)} onDelete={() => onDelete(conversation.id)} onClear={() => onClear(conversation.id)} />) : <p className="conversation-sidebar-empty">No conversations match your search.</p>}{filteredArchived.length > 0 && <><span className="conversation-archive-label">ARCHIVED</span>{filteredArchived.map((conversation) => <ConversationItem key={conversation.id} conversation={conversation} active={activeId === conversation.id} onSelect={() => { onSelect(conversation.id); onClose?.() }} onRename={(title) => onRename(conversation.id, title)} onArchive={() => onArchive(conversation.id)} onDelete={() => onDelete(conversation.id)} onClear={() => onClear(conversation.id)} />)}</>}</div>
    <footer className="conversation-sidebar-footer"><span className="conversation-online-dot" /><span>OfficePilot</span><small>Ready to help</small></footer>
  </aside>
}