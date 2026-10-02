import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './AIChat.css'
import { createMockResponse, loadSeedConversations, quickActions, suggestedPrompts } from './assistantData'
import type { AssistantAction, AttachmentChip, ChatMessage, Conversation, SourceReference } from './assistantTypes'
import AssistantIcon from './components/AssistantIcon'
import ConversationSidebar from './components/ConversationSidebar'
import ChatMessageView from './components/ChatMessage'
import AIComposer from './components/AIComposer'
import AssistantContextPanel from './components/AssistantContextPanel'

interface FailedRequest {
  conversationId: string
  prompt: string
}

function timeLabel(): string {
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date())
}

function messageId(): string {
  return `message-${crypto.randomUUID()}`
}

export default function AIChat() {
  const navigate = useNavigate()
  const location = useLocation()
  const routePrompt = (location.state as { prompt?: string } | null)?.prompt ?? ''
  const routeConversationId = 'route-prompt-conversation'
  const [conversations, setConversations] = useState<Conversation[]>(() => routePrompt ? [{ id: routeConversationId, title: routePrompt.slice(0, 36), updatedAt: 'Just now', messages: [] }, ...loadSeedConversations()] : loadSeedConversations())
  const [activeId, setActiveId] = useState<string | null>(() => routePrompt ? routeConversationId : null)
  const [conversationSearch, setConversationSearch] = useState('')
  const [createdActionIds, setCreatedActionIds] = useState<string[]>([])
  const [activeContext, setActiveContext] = useState<SourceReference | undefined>()
  const [composerPrefill, setComposerPrefill] = useState(routePrompt)
  const [thinkingId, setThinkingId] = useState<string | null>(null)
  const [failedRequest, setFailedRequest] = useState<FailedRequest | null>(null)
  const [toast, setToast] = useState('')
  const [historyOpen, setHistoryOpen] = useState(false)
  const [contextOpen, setContextOpen] = useState(false)
  const [composerSeed, setComposerSeed] = useState(0)
  const activeConversation = conversations.find((conversation) => conversation.id === activeId) ?? null
  const activeMessages = activeConversation?.messages ?? []
  const isThinking = Boolean(activeId && thinkingId === activeId)
  const sourceContext = activeContext ?? [...activeMessages].reverse().find((message) => message.sources?.length)?.sources?.[0]
  const showEmptyState = !activeConversation || activeMessages.length === 0

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2800)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    if (!routePrompt) return
    navigate('/ai', { replace: true, state: null })
  }, [routePrompt, navigate])

  function createConversation() {
    const conversation: Conversation = { id: `conversation-${crypto.randomUUID()}`, title: 'New conversation', updatedAt: 'Just now', messages: [] }
    setConversations((current) => [conversation, ...current])
    setActiveId(conversation.id)
    setFailedRequest(null)
    setComposerPrefill('')
    setComposerSeed((value) => value + 1)
  }

  function updateConversation(conversationId: string, update: (conversation: Conversation) => Conversation) {
    setConversations((current) => current.map((conversation) => conversation.id === conversationId ? update(conversation) : conversation))
  }

  function completeResponse(conversationId: string, prompt: string, useContext: boolean) {
    window.setTimeout(() => {
      const response = createMockResponse(prompt, messageId())
      if (!useContext) response.sources = []
      updateConversation(conversationId, (conversation) => ({ ...conversation, updatedAt: timeLabel(), messages: [...conversation.messages, response] }))
      setThinkingId((current) => current === conversationId ? null : current)
      setFailedRequest(null)
    }, 650)
  }

  function sendMessage(prompt: string, attachments: AttachmentChip[], useContext: boolean) {
    const text = prompt.trim() || (attachments.length ? `Please review ${attachments.map((item) => item.name).join(', ')}.` : '')
    if (!text) return
    let conversationId = activeId
    if (!conversationId) {
      const created: Conversation = { id: `conversation-${crypto.randomUUID()}`, title: text.slice(0, 36), updatedAt: 'Just now', messages: [] }
      conversationId = created.id
      setConversations((current) => [created, ...current])
      setActiveId(created.id)
    }
    const id = conversationId
    const userMessage: ChatMessage = { id: messageId(), role: 'user', content: text, timestamp: timeLabel(), attachments: attachments.map((item) => ({ ...item })) }
    updateConversation(id, (conversation) => ({
      ...conversation,
      title: conversation.title === 'New conversation' ? text.slice(0, 36) : conversation.title,
      updatedAt: timeLabel(),
      messages: [...conversation.messages, userMessage],
    }))
    setFailedRequest(null)
    setThinkingId(id)
    setActiveContext(undefined)
    if (/simulate (an )?error/i.test(text)) {
      window.setTimeout(() => {
        setThinkingId(null)
        setFailedRequest({ conversationId: id, prompt: text })
      }, 500)
      return
    }
    completeResponse(id, text, useContext)
  }

  function retryFailedRequest() {
    if (!failedRequest) return
    setThinkingId(failedRequest.conversationId)
    setFailedRequest(null)
    completeResponse(failedRequest.conversationId, failedRequest.prompt, true)
  }

  function handleAction(message: ChatMessage, action: AssistantAction) {
    if (action.kind === 'navigate' && action.route) {
      navigate(action.route)
      return
    }
    if (action.kind === 'create-task') {
      setCreatedActionIds((current) => current.includes(action.id) ? current : [...current, action.id])
      setToast(`Task created: ${action.taskTitle ?? 'Follow-up task'}`)
      return
    }
    if (action.kind === 'copy') {
      const draft = message.blocks?.find((block) => block.type === 'draft')?.text ?? message.content
      try {
        navigator.clipboard.writeText(draft).then(() => setToast('Draft copied to clipboard.')).catch(() => setToast('Clipboard access is unavailable.'))
      } catch {
        setToast('Clipboard access is unavailable.')
      }
      return
    }
    if (action.kind === 'ask') {
      setComposerPrefill(`Tell me more about: ${message.content}`)
      setComposerSeed((value) => value + 1)
      setToast('Add a follow-up question in the composer.')
    }
  }

  function addSuggestion(prompt: string) {
    sendMessage(prompt, [], true)
  }

  function handleQuickAction(prompt: string) {
    sendMessage(prompt, [], true)
  }

  function renameConversation(conversationId: string, title: string) {
    updateConversation(conversationId, (conversation) => ({ ...conversation, title }))
  }

  function archiveConversation(conversationId: string) {
    const restoring = conversations.find((conversation) => conversation.id === conversationId)?.archived ?? false
    updateConversation(conversationId, (conversation) => ({ ...conversation, archived: !conversation.archived }))
    if (activeId === conversationId) setActiveId(null)
    setToast(restoring ? 'Conversation restored.' : 'Conversation archived.')
  }

  function deleteConversation(conversationId: string) {
    setConversations((current) => current.filter((conversation) => conversation.id !== conversationId))
    if (activeId === conversationId) setActiveId(null)
    setToast('Conversation deleted.')
  }

  function clearConversation(conversationId: string) {
    updateConversation(conversationId, (conversation) => ({ ...conversation, messages: [] }))
    setFailedRequest(null)
    setToast('Conversation cleared.')
  }

  return <main className="ai-assistant-page">
    <header className="ai-page-header"><div><span>WORKPLACE INTELLIGENCE</span><h1>AI Assistant</h1><p>Your workplace assistant for finding information, understanding documents, and getting work done.</p></div><div className="ai-page-header-status"><span className="ai-ready-indicator" /><div><strong>OfficePilot</strong><small>{isThinking ? 'Thinking…' : 'Ready to help'}</small></div></div></header>
    <div className="ai-workspace-shell">
      <ConversationSidebar conversations={conversations} activeId={activeId} search={conversationSearch} onSearchChange={setConversationSearch} onSelect={(id) => { setActiveId(id); setFailedRequest(null); setActiveContext(undefined) }} onNew={createConversation} onRename={renameConversation} onArchive={archiveConversation} onDelete={deleteConversation} onClear={clearConversation} />
      <section className="ai-chat-main" aria-label="OfficePilot conversation">
        <header className="ai-chat-header"><div className="ai-chat-header-leading"><button type="button" className="ai-panel-toggle" aria-label="Open conversations" onClick={() => setHistoryOpen(true)}><AssistantIcon name="menu" size={18} /></button><div><span>{activeConversation?.title ?? 'Workplace assistant'}</span><small><i />{isThinking ? 'Thinking…' : 'Using workplace context'}</small></div></div><div className="ai-chat-header-actions"><button type="button" className="ai-panel-toggle" aria-label="Open context panel" onClick={() => setContextOpen(true)}><AssistantIcon name="grid" size={17} /></button><button type="button" className="ai-new-inline-button" onClick={createConversation}><AssistantIcon name="plus" size={15} />New</button></div></header>
        <div className={`ai-chat-scroll ${showEmptyState ? 'is-empty' : ''}`}>
          {showEmptyState ? <div className="ai-empty-state"><span className="ai-empty-mark"><AssistantIcon name="sparkles" size={21} /></span><h2>How can I help with your work?</h2><p>Ask me to find information, work with documents, draft something, or help you decide what to do next.</p><div className="ai-suggested-prompts">{suggestedPrompts.map((prompt) => <button type="button" key={prompt} onClick={() => addSuggestion(prompt)}>{prompt}<AssistantIcon name="arrow" size={14} /></button>)}</div></div> : <div className="ai-message-list">{activeMessages.map((message) => <ChatMessageView key={message.id} message={message} createdActionIds={createdActionIds} onAction={(_messageId, action) => handleAction(message, action)} onSuggestion={addSuggestion} onSource={(source) => setActiveContext(source)} />)}{isThinking && <div className="ai-thinking" role="status"><span className="ai-assistant-avatar"><AssistantIcon name="sparkles" size={15} /></span><div><strong>OfficePilot is thinking...</strong><span><i /><i /><i /></span></div></div>}{failedRequest?.conversationId === activeId && <div className="ai-error-state" role="alert"><p>Something went wrong while processing your request.</p><button type="button" onClick={retryFailedRequest}><AssistantIcon name="refresh" size={14} />Try again</button></div>}</div>}
        </div>
        {showEmptyState && <div className="ai-quick-actions" aria-label="Quick actions">{quickActions.map((item) => <button type="button" key={item.label} onClick={() => handleQuickAction(item.prompt)}><AssistantIcon name={item.icon} size={15} />{item.label}</button>)}</div>}
        <AIComposer key={`${location.key}-${composerSeed}`} initialValue={composerPrefill} thinking={isThinking} onSend={(text, attachments, useContext) => { setComposerPrefill(''); sendMessage(text, attachments, useContext) }} />
      </section>
      <AssistantContextPanel context={sourceContext} onSummarize={() => { setComposerPrefill(`Summarize ${sourceContext?.title ?? 'this document'}`); setComposerSeed((value) => value + 1) }} onAsk={() => { setComposerPrefill(`Tell me more about ${sourceContext?.title ?? 'this'}`); setComposerSeed((value) => value + 1) }} />
    </div>
    {historyOpen && <><button type="button" className="ai-mobile-backdrop" aria-label="Close conversations" onClick={() => setHistoryOpen(false)} /><ConversationSidebar conversations={conversations} activeId={activeId} search={conversationSearch} onSearchChange={setConversationSearch} onSelect={(id) => { setActiveId(id); setFailedRequest(null); setActiveContext(undefined) }} onNew={() => { createConversation(); setHistoryOpen(false) }} onRename={renameConversation} onArchive={archiveConversation} onDelete={deleteConversation} onClear={clearConversation} mobile onClose={() => setHistoryOpen(false)} /> </>}
    {contextOpen && <><button type="button" className="ai-mobile-backdrop" aria-label="Close context panel" onClick={() => setContextOpen(false)} /><AssistantContextPanel context={sourceContext} onSummarize={() => { setComposerPrefill(`Summarize ${sourceContext?.title ?? 'this document'}`); setComposerSeed((value) => value + 1); setContextOpen(false) }} onAsk={() => { setComposerPrefill(`Tell me more about ${sourceContext?.title ?? 'this'}`); setComposerSeed((value) => value + 1); setContextOpen(false) }} mobile onClose={() => setContextOpen(false)} /></>}
    {toast && <div className="ai-toast" role="status"><AssistantIcon name="check" size={14} />{toast}</div>}
  </main>
}