import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import './Tasks.css'
import { loadMockTasks } from './taskData'
import type { Task, TaskPriority, TaskStatus } from './taskTypes'
import TaskCard from './components/TaskCard'
import TaskDetailPanel from './components/TaskDetailPanel'
import CreateTaskModal from './components/CreateTaskModal'

type OverviewFilter = 'my' | 'assigned' | 'today' | 'overdue' | null
type DueFilter = 'All' | 'Today' | 'This Week' | 'Overdue'
type SortOption = 'due' | 'priority' | 'created' | 'title'

const statuses: Array<TaskStatus | 'All'> = ['All', 'To Do', 'In Progress', 'Waiting', 'Completed']
const priorities: Array<TaskPriority | 'All'> = ['All', 'Low', 'Medium', 'High']
const dueOptions: DueFilter[] = ['All', 'Today', 'This Week', 'Overdue']
const currentUser = 'Cephas'

function addActivity(task: Task, message: string): Task {
  return { ...task, activity: [{ id: `activity-${Date.now()}`, dateLabel: 'Today', message }, ...task.activity] }
}

function isOverdue(task: Task, today: string): boolean {
  return task.status !== 'Completed' && task.dueDate < today
}

function formatUpcomingDate(dateString: string, today: string): string {
  const difference = Math.round((new Date(`${dateString}T12:00:00`).getTime() - new Date(`${today}T12:00:00`).getTime()) / 86400000)
  if (difference === 1) return 'Tomorrow'
  if (difference <= 7) return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date(`${dateString}T12:00:00`))
  return 'Next week'
}

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true as const }
  const shapes: Record<string, ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    filter: <><path d="M4 6h16M7 12h10m-7 6h4" /><circle cx="8" cy="6" r="1" fill="currentColor" /><circle cx="15" cy="12" r="1" fill="currentColor" /></>,
    sort: <><path d="M8 6h12M8 12h9M8 18h6" /><path d="m4 7 2-2 2 2M6 5v14" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    chevron: <><path d="m7 10 5 5 5-5" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    file: <><path d="M13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10z" /><path d="M13 3v7h7M8 15h8M8 18h6" /></>,
    sparkles: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
  }
  return <svg {...common}>{shapes[name] ?? null}</svg>
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [overviewFilter, setOverviewFilter] = useState<OverviewFilter>(null)
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'All'>('All')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'All'>('All')
  const [dueFilter, setDueFilter] = useState<DueFilter>('All')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('due')
  const [filtersOpen, setFiltersOpen] = useState(true)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [assistantMessage, setAssistantMessage] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const [currentDate] = useState(() => new Date())
  const today = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`

  useEffect(() => {
    let active = true
    loadMockTasks()
      .then((loadedTasks) => {
        if (active) {
          setTasks(loadedTasks)
          setLoadError(false)
        }
      })
      .catch(() => {
        if (active) setLoadError(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!selectedTaskId && !isCreateOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedTaskId(null)
        setIsCreateOpen(false)
        setEditingTask(null)
      }
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [selectedTaskId, isCreateOpen])

  const selectedTask = tasks.find((task) => task.id === selectedTaskId) ?? null
  const overdueCount = tasks.filter((task) => isOverdue(task, today)).length
  const dueTodayCount = tasks.filter((task) => task.status !== 'Completed' && task.dueDate === today).length
  const needsAttentionCount = tasks.filter((task) => task.status !== 'Completed' && task.dueDate <= today).length

  const normalizedSearch = search.trim().toLowerCase()
  const weekEnd = new Date(`${today}T12:00:00`)
  weekEnd.setDate(weekEnd.getDate() + (7 - weekEnd.getDay()))
  const weekEndString = `${weekEnd.getFullYear()}-${String(weekEnd.getMonth() + 1).padStart(2, '0')}-${String(weekEnd.getDate()).padStart(2, '0')}`
  const priorityRank: Record<TaskPriority, number> = { High: 0, Medium: 1, Low: 2 }
  const visibleTasks = tasks.filter((task) => {
    if (overviewFilter === 'my' && task.assignee !== currentUser) return false
    if (overviewFilter === 'assigned' && task.createdBy !== currentUser) return false
    if (overviewFilter === 'today' && (task.status === 'Completed' || task.dueDate !== today)) return false
    if (overviewFilter === 'overdue' && !isOverdue(task, today)) return false
    if (statusFilter !== 'All' && task.status !== statusFilter) return false
    if (priorityFilter !== 'All' && task.priority !== priorityFilter) return false
    if (dueFilter === 'Today' && task.dueDate !== today) return false
    if (dueFilter === 'This Week' && (task.dueDate < today || task.dueDate > weekEndString)) return false
    if (dueFilter === 'Overdue' && !isOverdue(task, today)) return false
    if (normalizedSearch && ![task.title, task.description, task.assignee, task.status, task.priority].some((value) => value.toLowerCase().includes(normalizedSearch))) return false
    return true
  }).sort((first, second) => {
    if (sort === 'priority') return priorityRank[first.priority] - priorityRank[second.priority] || first.dueDate.localeCompare(second.dueDate)
    if (sort === 'created') return second.createdDate.localeCompare(first.createdDate)
    if (sort === 'title') return first.title.localeCompare(second.title)
    return first.dueDate.localeCompare(second.dueDate)
  })
  const upcomingTasks = tasks.filter((task) => task.status !== 'Completed' && task.dueDate > today).sort((first, second) => first.dueDate.localeCompare(second.dueDate)).slice(0, 3)

  function updateTask(taskId: string, update: (task: Task) => Task) {
    setTasks((currentTasks) => currentTasks.map((task) => task.id === taskId ? update(task) : task))
  }

  function changeStatus(task: Task, status: TaskStatus) {
    if (task.status !== status) updateTask(task.id, (current) => addActivity({ ...current, status }, `You changed status to ${status}`))
  }

  function toggleComplete(task: Task) {
    changeStatus(task, task.status === 'Completed' ? 'To Do' : 'Completed')
  }

  function toggleSubtask(taskId: string, subtaskId: string) {
    updateTask(taskId, (task) => ({ ...task, subtasks: task.subtasks.map((subtask) => subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask) }))
  }

  function saveTask(values: { title: string; description: string; status: TaskStatus; priority: TaskPriority; dueDate: string; assignee: string; relatedDocument: string; notes: string }) {
    if (editingTask) {
      updateTask(editingTask.id, (task) => addActivity({ ...task, ...values, relatedDocument: values.relatedDocument.trim() || undefined }, 'You updated task details'))
      setEditingTask(null)
      setSelectedTaskId(editingTask.id)
    } else {
      const created: Task = {
        id: `task-${crypto.randomUUID()}`,
        ...values,
        relatedDocument: values.relatedDocument.trim() || undefined,
        createdDate: today,
        createdBy: currentUser,
        subtasks: [],
        activity: [{ id: `activity-${Date.now()}`, dateLabel: 'Today', message: 'Task was created' }],
      }
      setTasks((currentTasks) => [created, ...currentTasks])
      setOverviewFilter(null)
      setStatusFilter('All')
      setPriorityFilter('All')
      setDueFilter('All')
      setSearch('')
      setSelectedTaskId(created.id)
    }
    setIsCreateOpen(false)
  }

  function deleteTask(task: Task) {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) return
    setTasks((currentTasks) => currentTasks.filter((current) => current.id !== task.id))
    setSelectedTaskId(null)
  }

  function startEdit(task: Task) {
    setEditingTask(task)
    setIsCreateOpen(true)
  }

  function toggleOverview(filter: Exclude<OverviewFilter, null>) {
    setOverviewFilter((current) => current === filter ? null : filter)
    if (filter === 'today' || filter === 'overdue') setDueFilter('All')
  }

  function prioritizeTasks() {
    setOverviewFilter(null)
    setStatusFilter('All')
    setPriorityFilter('All')
    setDueFilter('All')
    setSort('priority')
    setAssistantMessage('Your highest-priority work is now at the top of the list.')
  }

  function resetFilters() {
    setOverviewFilter(null)
    setStatusFilter('All')
    setPriorityFilter('All')
    setDueFilter('All')
    setSearch('')
  }

  return (
    <main className="tasks-page">
      <header className="tasks-header">
        <div className="tasks-header__copy"><span className="tasks-eyebrow">YOUR WORKSPACE</span><h1>Tasks</h1><p>Manage your work, deadlines, and follow-ups.</p></div>
        <div className="tasks-header__actions">
          <button type="button" className="tasks-quiet-action" onClick={() => searchRef.current?.focus()}><Icon name="search" /><span>Search</span></button>
          <button type="button" className={`tasks-quiet-action ${filtersOpen ? 'is-selected' : ''}`} onClick={() => setFiltersOpen((open) => !open)} aria-expanded={filtersOpen}><Icon name="filter" /><span>Filter</span></button>
          <label className="tasks-sort-control"><Icon name="sort" /><span className="sr-only">Sort tasks</span><select value={sort} onChange={(event) => setSort(event.target.value as SortOption)} aria-label="Sort tasks"><option value="due">Due date</option><option value="priority">Priority</option><option value="created">Recently added</option><option value="title">Title</option></select><Icon name="chevron" size={15} /></label>
          <button type="button" className="tasks-create-button" onClick={() => { setEditingTask(null); setIsCreateOpen(true) }}><Icon name="plus" /><span>Create Task</span></button>
        </div>
      </header>

      <nav className="tasks-overview" aria-label="Task overview filters">
        <button type="button" className={`tasks-overview__item ${overviewFilter === 'my' ? 'is-active' : ''}`} onClick={() => toggleOverview('my')} aria-pressed={overviewFilter === 'my'}><span className="tasks-overview__label">My Tasks</span><strong>{tasks.filter((task) => task.assignee === currentUser && task.status !== 'Completed').length}</strong></button>
        <button type="button" className={`tasks-overview__item ${overviewFilter === 'assigned' ? 'is-active' : ''}`} onClick={() => toggleOverview('assigned')} aria-pressed={overviewFilter === 'assigned'}><span className="tasks-overview__label">Assigned by Me</span><strong>{tasks.filter((task) => task.createdBy === currentUser && task.status !== 'Completed').length}</strong></button>
        <button type="button" className={`tasks-overview__item ${overviewFilter === 'today' ? 'is-active' : ''}`} onClick={() => toggleOverview('today')} aria-pressed={overviewFilter === 'today'}><span className="tasks-overview__label">Due Today</span><strong>{dueTodayCount}</strong></button>
        <button type="button" className={`tasks-overview__item tasks-overview__item--overdue ${overviewFilter === 'overdue' ? 'is-active' : ''}`} onClick={() => toggleOverview('overdue')} aria-pressed={overviewFilter === 'overdue'}><span className="tasks-overview__label">Overdue</span><strong>{overdueCount}</strong></button>
      </nav>

      <section className={`tasks-filter-panel ${filtersOpen ? 'is-open' : ''}`} aria-label="Filter tasks">
        <label className="tasks-search-field"><Icon name="search" size={17} /><input ref={searchRef} type="search" placeholder="Search tasks..." value={search} onChange={(event) => setSearch(event.target.value)} />{search && <button type="button" aria-label="Clear search" onClick={() => setSearch('')}><Icon name="close" size={15} /></button>}</label>
        <div className="tasks-filter-selects">
          <label><span>Status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as TaskStatus | 'All')} aria-label="Filter by status">{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
          <label><span>Priority</span><select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value as TaskPriority | 'All')} aria-label="Filter by priority">{priorities.map((priority) => <option key={priority}>{priority}</option>)}</select></label>
          <label><span>Due</span><select value={dueFilter} onChange={(event) => setDueFilter(event.target.value as DueFilter)} aria-label="Filter by due date">{dueOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
        </div>
      </section>

      <div className="tasks-workspace">
        <section className="tasks-list-section" aria-labelledby="task-list-heading">
          <div className="tasks-list-heading"><div><h2 id="task-list-heading">Your work</h2><p>{loading ? 'Loading tasks...' : `${visibleTasks.length} ${visibleTasks.length === 1 ? 'task' : 'tasks'} to review`}</p></div><span className="tasks-list-date"><Icon name="calendar" size={16} />{new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(currentDate)}</span></div>
          {loading ? <div className="tasks-loading" role="status"><span className="tasks-spinner" />Loading your tasks</div> : loadError ? <div className="tasks-state-message" role="alert"><strong>Tasks could not be loaded</strong><span>Please try again.</span><button type="button" onClick={() => { setLoadError(false); setLoading(true); loadMockTasks().then(setTasks).catch(() => setLoadError(true)).finally(() => setLoading(false)) }}>Retry</button></div> : visibleTasks.length === 0 ? <div className="tasks-empty-state"><span className="tasks-empty-state__icon"><Icon name="check" size={22} /></span><h3>No tasks found</h3><p>Try changing your filters or create a new task.</p><div><button type="button" className="tasks-create-button" onClick={() => { setEditingTask(null); setIsCreateOpen(true) }}><Icon name="plus" />Create Task</button><button type="button" className="tasks-reset-button" onClick={resetFilters}>Clear filters</button></div></div> : <div className="tasks-list">{visibleTasks.map((task) => <TaskCard key={task.id} task={task} today={today} overdue={isOverdue(task, today)} onOpen={() => setSelectedTaskId(task.id)} onToggleComplete={() => toggleComplete(task)} onEdit={() => startEdit(task)} onDelete={() => deleteTask(task)} onStatusChange={(status) => changeStatus(task, status)} />)}</div>}
        </section>

        <aside className="tasks-side-column" aria-label="Task assistance and upcoming work">
          <section className="tasks-ai-panel"><div className="tasks-ai-panel__top"><span className="tasks-ai-icon"><Icon name="sparkles" size={17} /></span><span>OFFICEPILOT SUGGESTION</span></div><p>{assistantMessage || `${needsAttentionCount} ${needsAttentionCount === 1 ? 'task needs' : 'tasks need'} your attention today. ${overdueCount ? `${overdueCount} ${overdueCount === 1 ? 'task is' : 'tasks are'} overdue.` : 'Your deadlines are on track.'}`}</p><div className="tasks-ai-actions"><button type="button" onClick={prioritizeTasks}>Prioritize my tasks <Icon name="arrow" size={15} /></button><button type="button" onClick={() => { setOverviewFilter('overdue'); setDueFilter('All'); setAssistantMessage('Here are the tasks that have passed their due date.') }}>Show overdue tasks</button><button type="button" onClick={() => setAssistantMessage(`You have ${tasks.filter((task) => task.status !== 'Completed').length} open tasks: ${dueTodayCount} due today and ${overdueCount} overdue.`)}>Summarize my workload</button></div></section>
          <section className="tasks-upcoming-panel" aria-labelledby="upcoming-heading"><div className="tasks-side-heading"><div><h2 id="upcoming-heading">Coming up</h2><p>Next on your schedule</p></div><Icon name="calendar" size={17} /></div>{upcomingTasks.length ? <div className="tasks-upcoming-list">{upcomingTasks.map((task) => <button type="button" key={task.id} className="tasks-upcoming-item" onClick={() => setSelectedTaskId(task.id)}><span className="tasks-upcoming-date">{formatUpcomingDate(task.dueDate, today)}</span><span className="tasks-upcoming-title">{task.title}</span><span className="tasks-upcoming-arrow"><Icon name="arrow" size={15} /></span></button>)}</div> : <p className="tasks-upcoming-empty">Nothing scheduled next. You’re all caught up.</p>}</section>
        </aside>
      </div>

      {selectedTask && <TaskDetailPanel task={selectedTask} overdue={isOverdue(selectedTask, today)} onClose={() => setSelectedTaskId(null)} onEdit={() => startEdit(selectedTask)} onDelete={() => deleteTask(selectedTask)} onStatusChange={(status) => changeStatus(selectedTask, status)} onToggleSubtask={(subtaskId) => toggleSubtask(selectedTask.id, subtaskId)} onToggleComplete={() => toggleComplete(selectedTask)} />}
      {isCreateOpen && <CreateTaskModal task={editingTask} onClose={() => { setIsCreateOpen(false); setEditingTask(null) }} onSave={saveTask} />}
    </main>
  )
}