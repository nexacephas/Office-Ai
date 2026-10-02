import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import KnowledgeHeader from '../../components/knowledge/KnowledgeHeader/KnowledgeHeader'
import KnowledgeSearch from '../../components/knowledge/KnowledgeSearch/KnowledgeSearch'
import SuggestedQuestions from '../../components/knowledge/SuggestedQuestions/SuggestedQuestions'
import KnowledgeAnswer from '../../components/knowledge/KnowledgeAnswer/KnowledgeAnswer'
import KnowledgeCollections from '../../components/knowledge/KnowledgeCollections/KnowledgeCollections'
import RecentKnowledge from '../../components/knowledge/RecentKnowledge/RecentKnowledge'
import KnowledgeContext from '../../components/knowledge/KnowledgeContext/KnowledgeContext'
import KnowledgeFilters from '../../components/knowledge/KnowledgeFilters/KnowledgeFilters'
import KnowledgeSourceTable from '../../components/knowledge/KnowledgeSourceTable/KnowledgeSourceTable'
import AddKnowledgeSource, { type AddKnowledgeValues } from '../../components/knowledge/AddKnowledgeSource/AddKnowledgeSource'
import KnowledgeProcessing from '../../components/knowledge/KnowledgeProcessing/KnowledgeProcessing'
import KnowledgeDetail from '../../components/knowledge/KnowledgeDetail/KnowledgeDetail'
import EmptyKnowledge from '../../components/knowledge/EmptyKnowledge/EmptyKnowledge'
import KnowledgeError from '../../components/knowledge/KnowledgeError/KnowledgeError'
import KnowledgeIcon from '../../components/knowledge/KnowledgeIcon'
import type { KnowledgeAnswer as KnowledgeAnswerRecord, KnowledgeCollection, KnowledgeFiltersState, KnowledgeSource } from './knowledgeTypes'
import { initialKnowledgeFilters, loadMockKnowledgeSources, mockCollections, searchMockKnowledge } from './knowledgeData'
import './Knowledge.css'

function isAccessible(source: KnowledgeSource): boolean {
  if (source.visibility === 'Organization') return true
  if (source.visibility === 'Only you') return source.owner === 'Cephas A.'
  return ['Operations', 'Transport Planning', 'Transport Planning & Coordination'].includes(source.department) || source.owner === 'Cephas A.'
}

function isWithinDays(updatedAt: string, days: number): boolean {
  const age = (Date.now() - Date.parse(`${updatedAt}T12:00:00`)) / 86_400_000
  return age >= 0 && age <= days
}

export default function Knowledge() {
  const navigate = useNavigate()
  const { id: sourceId } = useParams()
  const [sources, setSources] = useState<KnowledgeSource[]>([])
  const [collections, setCollections] = useState<KnowledgeCollection[]>(mockCollections)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<KnowledgeAnswerRecord | null>(null)
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState(false)
  const [sourceQuery, setSourceQuery] = useState('')
  const [filters, setFilters] = useState<KnowledgeFiltersState>(initialKnowledgeFilters)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [processingSourceId, setProcessingSourceId] = useState<string | null>(null)
  const [processingStep, setProcessingStep] = useState(0)
  const [processingReady, setProcessingReady] = useState(false)
  const [removeTarget, setRemoveTarget] = useState<KnowledgeSource | null>(null)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let active = true
    loadMockKnowledgeSources().then((items) => {
      if (active) { setSources(items); setLoadError(false) }
    }).catch(() => {
      if (active) setLoadError(true)
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!processingSourceId) return
    const sourceIdToUpdate = processingSourceId
    const timers = [
      window.setTimeout(() => setProcessingStep(1), 650),
      window.setTimeout(() => setProcessingStep(2), 1300),
      window.setTimeout(() => setProcessingStep(3), 1950),
      window.setTimeout(() => {
        setSources((current) => current.map((source) => source.id === sourceIdToUpdate ? { ...source, status: 'Ready', pagesIndexed: Math.max(source.pagesIndexed, 12), sectionsIndexed: Math.max(source.sectionsIndexed, 18), lastIndexed: 'Just now' } : source))
        setProcessingReady(true)
      }, 2600),
    ]
    return () => timers.forEach(window.clearTimeout)
  }, [processingSourceId])

  useEffect(() => {
    if (!addOpen && !processingSourceId && !sourceId && !removeTarget) return
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAddOpen(false)
        setRemoveTarget(null)
        if (processingReady) setProcessingSourceId(null)
        if (sourceId) navigate('/knowledge')
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [addOpen, processingSourceId, processingReady, removeTarget, sourceId, navigate])

  const availableSources = sources.filter(isAccessible)
  const selectedSource = availableSources.find((source) => source.id === sourceId) ?? null
  const processingSource = sources.find((source) => source.id === processingSourceId) ?? null
  const recentSources = availableSources.slice().sort((first, second) => second.updatedAt.localeCompare(first.updatedAt)).slice(0, 4)
  const filteredSources = useMemo(() => {
    const search = sourceQuery.trim().toLowerCase()
    return availableSources.filter((source) => {
      if (filters.collection !== 'All collections' && source.collection !== filters.collection) return false
      if (filters.department !== 'All departments' && source.department !== filters.department) return false
      if (filters.documentType !== 'All types' && source.type !== filters.documentType) return false
      if (filters.owner !== 'Anyone' && (filters.owner === 'You' ? source.owner !== 'Cephas A.' : source.owner !== filters.owner)) return false
      if (filters.status !== 'All statuses' && source.status !== filters.status) return false
      if (filters.updated === 'Last 7 days' && !isWithinDays(source.updatedAt, 7)) return false
      if (filters.updated === 'Last 30 days' && !isWithinDays(source.updatedAt, 30)) return false
      if (filters.updated === 'Older' && isWithinDays(source.updatedAt, 30)) return false
      if (search && ![source.title, source.description, source.collection, source.type, source.department, source.owner, ...source.tags].some((value) => value.toLowerCase().includes(search))) return false
      return true
    }).sort((first, second) => {
      if (filters.sort === 'Oldest') return first.updatedAt.localeCompare(second.updatedAt)
      if (filters.sort === 'Newest' || filters.sort === 'Recently updated') return second.updatedAt.localeCompare(first.updatedAt)
      if (answer) {
        const rank = (source: KnowledgeSource) => answer.sources.findIndex((reference) => reference.documentId === source.id)
        return (rank(first) < 0 ? 100 : rank(first)) - (rank(second) < 0 ? 100 : rank(second))
      }
      return first.title.localeCompare(second.title)
    })
  }, [answer, availableSources, filters, sourceQuery])

  async function askKnowledge(value: string) {
    const trimmed = value.trim()
    if (!trimmed) return
    setQuestion(trimmed)
    setAnswer(null)
    setSearchError(false)
    setSearching(true)
    try {
      const result = await searchMockKnowledge(trimmed, availableSources)
      setAnswer(result)
    } catch {
      setSearchError(true)
    } finally {
      setSearching(false)
    }
  }

  function openSource(source: KnowledgeSource) {
    navigate(`/knowledge/${source.id}`)
  }

  function askAboutDocument(title: string) {
    setQuestion(`What should I know about ${title}?`)
    void askKnowledge(`What should I know about ${title}?`)
    document.getElementById('knowledge-ask')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function openDocument(source: KnowledgeSource) {
    navigate('/documents')
    setNotice(`${source.title} is available in your Documents workspace.`)
  }

  function beginProcessing(source: KnowledgeSource) {
    setSources((current) => current.map((item) => item.id === source.id ? { ...item, status: 'Processing', lastIndexed: 'Indexing in progress' } : item))
    setProcessingStep(0)
    setProcessingReady(false)
    setProcessingSourceId(source.id)
  }

  function addKnowledge(values: AddKnowledgeValues) {
    if (values.method === 'Add Collection' || values.method === 'Add Folder') {
      const collectionName = values.title.trim()
      if (collectionName) setCollections((current) => current.some((collection) => collection.name === collectionName) ? current : [...current, { id: `collection-${crypto.randomUUID()}`, name: collectionName, description: `${values.method === 'Add Folder' ? 'Folder' : 'Collection'} added to your knowledge workspace.`, sourceCount: 0, updatedAt: 'Today' }])
      setAddOpen(false)
      setNotice(`${values.method === 'Add Folder' ? 'Folder' : 'Collection'} added in this preview.`)
      return
    }
    const source: KnowledgeSource = {
      id: `knowledge-${crypto.randomUUID()}`, title: values.title, type: values.type, department: values.department, owner: 'Cephas A.', updatedAt: new Date().toISOString().slice(0, 10), addedAt: 'Just now', status: 'Processing', collection: values.collection, visibility: values.visibility, description: values.description || `${values.type} added to ${values.collection}.`, pagesIndexed: 0, sectionsIndexed: 0, lastIndexed: 'Uploading', relatedDocuments: [], relatedPolicies: [], relatedTasks: [], relatedCorrespondence: [], excerpt: values.description || `${values.title} added to organizational knowledge.`, tags: values.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    }
    setSources((current) => [source, ...current])
    setCollections((current) => current.map((collection) => collection.name === source.collection ? { ...collection, sourceCount: collection.sourceCount + 1, updatedAt: 'Today' } : collection))
    setAddOpen(false)
    setProcessingStep(0)
    setProcessingReady(false)
    setProcessingSourceId(source.id)
  }

  function clearFilters() {
    setSourceQuery('')
    setFilters(initialKnowledgeFilters)
  }

  function archiveSource(source: KnowledgeSource) {
    setSources((current) => current.map((item) => item.id === source.id ? { ...item, status: 'Archived' } : item))
    setNotice(`${source.title} archived from the active knowledge list.`)
  }

  function confirmRemove() {
    if (!removeTarget) return
    const removed = removeTarget
    setSources((current) => current.filter((source) => source.id !== removed.id))
    setCollections((current) => current.map((collection) => collection.name === removed.collection ? { ...collection, sourceCount: Math.max(0, collection.sourceCount - 1) } : collection))
    setRemoveTarget(null)
    setNotice(`${removed.title} was removed from Knowledge in this preview.`)
    if (sourceId === removed.id) navigate('/knowledge')
  }

  return <section className="knowledge-page">
    <KnowledgeHeader onAsk={() => document.getElementById('knowledge-ask')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} onAdd={() => setAddOpen(true)} />
    {notice && <div className="knowledge-notice" role="status"><span>{notice}</span><button type="button" onClick={() => setNotice('')}>Dismiss</button></div>}
    {loadError ? <KnowledgeError onRetry={() => { setLoading(true); setLoadError(false); void loadMockKnowledgeSources().then(setSources).catch(() => setLoadError(true)).finally(() => setLoading(false)) }} onDocuments={() => navigate('/documents')} /> : availableSources.length === 0 && !loading ? <EmptyKnowledge mode="sources" onAdd={() => setAddOpen(true)} /> : <>
      <div className="knowledge-hero-layout"><div className="knowledge-primary-column"><KnowledgeSearch value={question} searching={searching} onChange={setQuestion} onAsk={(value) => void askKnowledge(value)} /><SuggestedQuestions onAsk={(value) => void askKnowledge(value)} />{searchError && <KnowledgeError onRetry={() => void askKnowledge(question)} onDocuments={() => navigate('/documents')} />}{answer && !searchError && (answer.sources.length ? <KnowledgeAnswer answer={answer} searching={searching} onOpenSource={(id) => { const source = availableSources.find((item) => item.id === id); if (source) openSource(source) }} onAskAbout={askAboutDocument} /> : <EmptyKnowledge mode="results" onDocuments={() => navigate('/documents')} onAssistant={() => navigate('/ai')} />)}{searching && !answer && <KnowledgeAnswer answer={null} searching onOpenSource={() => undefined} onAskAbout={() => undefined} />}</div><aside className="knowledge-rail"><KnowledgeContext onManageAccess={() => setNotice('Organization access controls are shown in Settings.')} onViewSources={() => document.getElementById('knowledge-library')?.scrollIntoView({ behavior: 'smooth' })} /><RecentKnowledge sources={recentSources} onOpen={openSource} /></aside></div>
      <KnowledgeCollections collections={collections} loading={loading} onSelect={(collection) => { setFilters((current) => ({ ...current, collection })); document.getElementById('knowledge-library')?.scrollIntoView({ behavior: 'smooth' }) }} />
      <section className="knowledge-library" id="knowledge-library"><header className="knowledge-library-header"><div><span>MANAGE SOURCES</span><h2>Knowledge sources</h2><p>Trusted material used to ground answers in your organization.</p></div><div><span className="knowledge-library-count">{filteredSources.length} sources</span><button type="button" className="knowledge-secondary-button" onClick={() => setAddOpen(true)}><KnowledgeIcon name="plus" size={15} /> Add source</button></div></header><KnowledgeFilters query={sourceQuery} filters={filters} collections={[...new Set(collections.map((collection) => collection.name))]} filtersOpen={filtersOpen} hasFilters={Boolean(sourceQuery) || JSON.stringify(filters) !== JSON.stringify(initialKnowledgeFilters)} onQuery={setSourceQuery} onChange={setFilters} onToggle={() => setFiltersOpen((open) => !open)} onClear={clearFilters} />{!loading && filteredSources.length === 0 ? <EmptyKnowledge mode="results" onDocuments={() => navigate('/documents')} onAssistant={() => navigate('/ai')} /> : <KnowledgeSourceTable sources={filteredSources} loading={loading} onOpen={openDocument} onAsk={(source) => askAboutDocument(source.title)} onRefresh={beginProcessing} onDetails={openSource} onArchive={archiveSource} />}</section>
      <div className="knowledge-footer-note"><KnowledgeIcon name="shield" size={15} /> Knowledge results respect your organization's access permissions.</div>
    </>}
    {addOpen && <AddKnowledgeSource onClose={() => setAddOpen(false)} onSubmit={addKnowledge} />}
    {processingSource && <KnowledgeProcessing title={processingSource.title} step={processingStep} ready={processingReady} onClose={() => setProcessingSourceId(null)} />}
    {selectedSource && <KnowledgeDetail source={selectedSource} onClose={() => navigate('/knowledge')} onAsk={() => askAboutDocument(selectedSource.title)} onOpen={() => openDocument(selectedSource)} onRefresh={() => beginProcessing(selectedSource)} onRemove={() => setRemoveTarget(selectedSource)} onRelated={(kind, title) => { if (kind === 'documents') navigate('/documents'); else if (kind === 'tasks') navigate('/tasks'); else if (kind === 'correspondence') navigate('/correspondence'); else askAboutDocument(title) }} />}
    {removeTarget && <div className="knowledge-confirm-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setRemoveTarget(null) }}><section role="dialog" aria-modal="true" aria-labelledby="knowledge-remove-title"><span><KnowledgeIcon name="trash" size={19} /></span><h2 id="knowledge-remove-title">Remove from Knowledge?</h2><p><strong>{removeTarget.title}</strong> will no longer be used to answer organization knowledge questions. The original document will remain in Documents.</p><div><button type="button" onClick={() => setRemoveTarget(null)}>Cancel</button><button type="button" onClick={confirmRemove}>Remove from Knowledge</button></div></section></div>}
  </section>
}