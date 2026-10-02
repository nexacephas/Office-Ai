import { useMemo, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ConversionAI from '../../../components/convert/ConversionAI/ConversionAI'
import BatchConversion from '../../../components/convert/BatchConversion/BatchConversion'
import ConversionHistory from '../../../components/convert/ConversionHistory/ConversionHistory'
import ConversionProgress from '../../../components/convert/ConversionProgress/ConversionProgress'
import ConversionResult from '../../../components/convert/ConversionResult/ConversionResult'
import ConversionSettings from '../../../components/convert/ConversionSettings/ConversionSettings'
import ConversionTools from '../../../components/convert/ConversionTools/ConversionTools'
import ConversionUpload from '../../../components/convert/ConversionUpload/ConversionUpload'
import ConvertHeader from '../../../components/convert/ConvertHeader/ConvertHeader'
import EmptyConvert from '../../../components/convert/EmptyConvert/EmptyConvert'
import OCRSection from '../../../components/convert/OCRSection/OCRSection'
import ProcessingQueue from '../../../components/convert/ProcessingQueue/ProcessingQueue'
import RecentConversions from '../../../components/convert/RecentConversions/RecentConversions'
import SelectedFile from '../../../components/convert/SelectedFile/SelectedFile'
import { conversionTools, defaultSettingsByTool, exampleHistory, processingQueue, recentConversions } from './convertData'
import type { BatchItem, ConversionHistoryItem, ConversionResult as ConversionResultType, ConversionSettingsState, ConversionToolId, UploadedFileMeta } from './convertTypes'
import './Convert.css'

const fallbackFile: UploadedFileMeta = {
  id: 'doc-management-report',
  name: 'Management_Report_Q3.pdf',
  type: 'PDF',
  sizeLabel: '4.8 MB',
  pages: 18,
  category: 'PDF',
}

export default function ConvertPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const initialTool = (searchParams.get('tool') as ConversionToolId) ?? 'pdf-to-word'
  const [selectedToolId, setSelectedToolId] = useState<ConversionToolId>(initialTool)
  const [selectedFile, setSelectedFile] = useState<UploadedFileMeta | null>(fallbackFile)
  const [settings, setSettings] = useState<ConversionSettingsState>(defaultSettingsByTool[initialTool])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [result, setResult] = useState<ConversionResultType | null>(null)
  const [history, setHistory] = useState<ConversionHistoryItem[]>(exampleHistory)
  const [queue] = useState(processingQueue)
  const [batchList, setBatchList] = useState<BatchItem[]>([
    { id: 'batch-1', file: 'Management_Report_Q3.pdf', inputType: 'PDF', outputType: 'DOCX', status: 'Queued' },
    { id: 'batch-2', file: 'Budget_Review.xlsx', inputType: 'XLSX', outputType: 'PDF', status: 'Ready' },
    { id: 'batch-3', file: 'Board_Deck.pptx', inputType: 'PPTX', outputType: 'PDF', status: 'Queued' },
  ])
  const [historyFilter, setHistoryFilter] = useState<'All' | 'Completed' | 'Processing' | 'Failed'>('All')
  const [historySearch, setHistorySearch] = useState('')
  const [toast, setToast] = useState('')

  const selectedTool = useMemo(
    () => conversionTools.find((tool) => tool.id === selectedToolId) ?? conversionTools[0],
    [selectedToolId],
  )

  function handleToolSelect(toolId: ConversionToolId) {
    setSelectedToolId(toolId)
    setSettings(defaultSettingsByTool[toolId])
    setIsProcessing(false)
    setIsComplete(false)
    setResult(null)
  }

  function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const nextFile: UploadedFileMeta = {
      id: `upload-${Date.now()}`,
      name: file.name,
      type: file.name.split('.').pop()?.toUpperCase() ?? 'FILE',
      sizeLabel: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      pages: 8,
      category: file.name.toLowerCase().endsWith('.pdf') ? 'PDF' : file.name.toLowerCase().endsWith('.docx') ? 'DOCX' : file.name.toLowerCase().endsWith('.xlsx') ? 'XLSX' : file.name.toLowerCase().endsWith('.pptx') ? 'PPTX' : 'TXT',
    }

    setSelectedFile(nextFile)
    setIsComplete(false)
    setResult(null)
  }

  function handleRemoveFile() {
    setSelectedFile(null)
    setResult(null)
    setIsComplete(false)
  }

  function handleConvert() {
    if (!selectedFile) return
    setIsProcessing(true)
    setIsComplete(false)

    window.setTimeout(() => {
      const nextResult: ConversionResultType = {
        id: `result-${Date.now()}`,
        originalName: selectedFile.name,
        convertedName: selectedFile.name.replace(/\.[^.]+$/, '') + `.${selectedTool.output.toLowerCase() === 'docx' ? 'docx' : selectedTool.output.toLowerCase() === 'xlsx' ? 'xlsx' : 'pdf'}`,
        originalType: selectedFile.type,
        convertedType: selectedTool.output,
        sizeLabel: selectedTool.output === 'DOCX' ? '4.2 MB' : selectedTool.output === 'XLSX' ? '3.7 MB' : '2.9 MB',
        pages: selectedFile.pages ?? 12,
        createdAt: 'Today',
      }
      setResult(nextResult)
      setIsProcessing(false)
      setIsComplete(true)
      setHistory((current) => [{
        id: `history-${Date.now()}`,
        file: selectedFile.name,
        conversion: selectedTool.title,
        status: 'Completed',
        date: 'Today',
        size: nextResult.sizeLabel,
        outputType: selectedTool.output,
      }, ...current])
      setToast('Conversion complete')
    }, 1800)
  }

  function handleDownload() {
    setToast('Download started')
  }

  function handleSaveToDocuments() {
    setToast('Saved to Documents')
  }

  function handleCreateTask() {
    navigate('/tasks')
  }

  function handleAskAI() {
    navigate('/ai')
  }

  function handleSummarize() {
    navigate('/ai/summarize')
  }

  function removeBatchItem(itemId: string) {
    setBatchList((current) => current.filter((batch) => batch.id !== itemId))
  }

  const filteredHistory = history.filter((item) => {
    if (historyFilter !== 'All' && item.status !== historyFilter) return false
    if (!historySearch) return true
    return `${item.file} ${item.conversion}`.toLowerCase().includes(historySearch.toLowerCase())
  })

  return (
    <main className="convert-page">
      <ConvertHeader />

      <section className="convert-tools-section">
        <div className="convert-section-heading">
          <h2>What do you need to do?</h2>
        </div>
        <ConversionTools selectedToolId={selectedToolId} onSelect={handleToolSelect} />
      </section>

      {selectedFile || isProcessing || isComplete || result ? (
        <section className="convert-workspace-block">
          <div className="convert-workspace-header">
            <div>
              <span>ACTIVE CONVERSION</span>
              <h2>{selectedTool.title}</h2>
            </div>
            <button type="button" className="convert-secondary-button" onClick={() => setSelectedToolId('pdf-to-word')}>
              Reset
            </button>
          </div>

          <div className="convert-workspace-grid">
            <div className="convert-workspace-main">
              <ConversionUpload selectedTool={selectedTool} onBrowse={() => fileInputRef.current?.click()} />
              <input ref={fileInputRef} type="file" className="convert-hidden-input" onChange={handleUpload} />
              {selectedFile ? <SelectedFile file={selectedFile} onRemove={handleRemoveFile} /> : null}
              {!selectedFile && !isProcessing && !isComplete && !result ? (
                <div className="convert-empty-inline">Choose a document or drop a file to begin.</div>
              ) : null}
            </div>

            <div className="convert-workspace-settings">
              <ConversionSettings selectedTool={selectedTool} settings={settings} onChange={setSettings} />
              <button type="button" className="convert-primary-button" onClick={handleConvert}>
                Convert document
              </button>
            </div>
          </div>
        </section>
      ) : (
        <EmptyConvert />
      )}

      {isProcessing ? <ConversionProgress /> : null}

      {result && !isProcessing ? (
        <ConversionResult
          result={result}
          onDownload={handleDownload}
          onSaveToDocuments={handleSaveToDocuments}
          onAskAI={handleAskAI}
          onSummarize={handleSummarize}
          onCreateTask={handleCreateTask}
        />
      ) : null}

      <div className="convert-content-grid">
        <div className="convert-column-stack">
          <ProcessingQueue queue={queue} />
          <OCRSection />
          <BatchConversion batchList={batchList} onRemove={removeBatchItem} onConvert={() => setToast('Batch conversion started')} />
        </div>
        <div className="convert-column-stack">
          <RecentConversions items={recentConversions} />
          <ConversionHistory
            items={filteredHistory}
            filter={historyFilter}
            query={historySearch}
            onFilterChange={setHistoryFilter}
            onSearchChange={setHistorySearch}
          />
          <ConversionAI />
        </div>
      </div>

      {toast ? <div className="convert-toast">{toast}</div> : null}
    </main>
  )
}
