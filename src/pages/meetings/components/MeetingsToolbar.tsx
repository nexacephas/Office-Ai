import { useState } from 'react'
import type { Meeting, MeetingDateFilter, MeetingSort, MeetingStatus, MeetingType } from '../meetingTypes'
import MeetingIcon from './MeetingIcon'
import './MeetingsToolbar.css'

interface MeetingsToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  type: MeetingType | 'all'
  onTypeChange: (value: MeetingType | 'all') => void
  status: MeetingStatus | 'all'
  onStatusChange: (value: MeetingStatus | 'all') => void
  department: string
  onDepartmentChange: (value: string) => void
  departments: string[]
  preparation: Meeting['preparationStatus'] | 'all'
  onPreparationChange: (value: Meeting['preparationStatus'] | 'all') => void
  date: MeetingDateFilter
  onDateChange: (value: MeetingDateFilter) => void
  organizer: string
  onOrganizerChange: (value: string) => void
  organizers: string[]
  sort: MeetingSort
  onSortChange: (value: MeetingSort) => void
  onReset: () => void
}

function FilterFields(props: MeetingsToolbarProps) {
  return <>
    <label className="meeting-filter-select"><span>Date</span><select aria-label="Filter meetings by date" value={props.date} onChange={(event) => props.onDateChange(event.target.value as MeetingDateFilter)}><option value="any">Any date</option><option value="today">Today</option><option value="week">This week</option><option value="month">This month</option></select><MeetingIcon name="chevron" size={13} /></label>
    <label className="meeting-filter-select"><span>Organizer</span><select aria-label="Filter by organizer" value={props.organizer} onChange={(event) => props.onOrganizerChange(event.target.value)}><option>All organizers</option>{props.organizers.map((organizer) => <option key={organizer}>{organizer}</option>)}</select><MeetingIcon name="chevron" size={13} /></label>
    <label className="meeting-filter-select"><span>Department</span><select aria-label="Filter by department" value={props.department} onChange={(event) => props.onDepartmentChange(event.target.value)}><option>All departments</option>{props.departments.map((department) => <option key={department}>{department}</option>)}</select><MeetingIcon name="chevron" size={13} /></label>
    <label className="meeting-filter-select"><span>Type</span><select aria-label="Filter by meeting type" value={props.type} onChange={(event) => props.onTypeChange(event.target.value as MeetingType | 'all')}><option value="all">All types</option><option value="in-person">In-person</option><option value="virtual">Virtual</option><option value="hybrid">Hybrid</option></select><MeetingIcon name="chevron" size={13} /></label>
    <label className="meeting-filter-select"><span>Status</span><select aria-label="Filter by status" value={props.status} onChange={(event) => props.onStatusChange(event.target.value as MeetingStatus | 'all')}><option value="all">All statuses</option><option value="draft">Draft</option><option value="upcoming">Upcoming</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select><MeetingIcon name="chevron" size={13} /></label>
    <label className="meeting-filter-select"><span>Preparation</span><select aria-label="Filter by preparation status" value={props.preparation} onChange={(event) => props.onPreparationChange(event.target.value as Meeting['preparationStatus'] | 'all')}><option value="all">Any status</option><option value="needs-preparation">Needs preparation</option><option value="ready">Ready</option><option value="prepared">Prepared</option><option value="completed">Completed</option></select><MeetingIcon name="chevron" size={13} /></label>
  </>
}

export default function MeetingsToolbar(props: MeetingsToolbarProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const filterCount = Number(props.organizer !== 'All organizers') + Number(props.department !== 'All departments') + Number(props.type !== 'all') + Number(props.status !== 'all') + Number(props.preparation !== 'all') + Number(props.date !== 'any')
  return <section className="meetings-toolbar" aria-label="Search and filter meetings"><label className="meetings-search"><MeetingIcon name="search" size={17} /><input type="search" value={props.search} onChange={(event) => props.onSearchChange(event.target.value)} placeholder="Search meetings..." aria-label="Search meetings" />{props.search && <button type="button" aria-label="Clear search" onClick={() => props.onSearchChange('')}><MeetingIcon name="close" size={15} /></button>}</label><div className="meetings-filter-controls"><FilterFields {...props} /><label className="meeting-sort-select"><MeetingIcon name="sort" size={14} /><span className="sr-only">Sort meetings</span><select aria-label="Sort meetings" value={props.sort} onChange={(event) => props.onSortChange(event.target.value as MeetingSort)}><option value="upcoming">Upcoming</option><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="completed">Recently completed</option></select><MeetingIcon name="chevron" size={13} /></label>{(filterCount > 0 || props.search) && <button type="button" className="meeting-reset" onClick={props.onReset}>Reset</button>}</div><div className="meetings-mobile-filter-row"><button type="button" className="meetings-mobile-filter-button" aria-expanded={sheetOpen} onClick={() => setSheetOpen(true)}><MeetingIcon name="filter" size={15} />Filters{filterCount > 0 && <span>{filterCount}</span>}</button><label className="meeting-sort-select"><MeetingIcon name="sort" size={14} /><select aria-label="Sort meetings" value={props.sort} onChange={(event) => props.onSortChange(event.target.value as MeetingSort)}><option value="upcoming">Upcoming</option><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="completed">Recently completed</option></select><MeetingIcon name="chevron" size={13} /></label>{(filterCount > 0 || props.search) && <button type="button" className="meeting-reset" onClick={props.onReset}>Reset</button>}</div>{sheetOpen && <div className="meeting-filter-sheet-layer"><button type="button" className="meeting-filter-backdrop" aria-label="Close filters" onClick={() => setSheetOpen(false)} /><section className="meeting-filter-sheet" role="dialog" aria-modal="true" aria-labelledby="meeting-filter-title"><header><div><span className="meetings-eyebrow">REFINE VIEW</span><h2 id="meeting-filter-title">Filters</h2></div><button type="button" className="meeting-icon-button" aria-label="Close filters" onClick={() => setSheetOpen(false)}><MeetingIcon name="close" /></button></header><div className="meeting-filter-sheet-fields"><FilterFields {...props} /></div><footer><button type="button" className="meeting-reset" onClick={props.onReset}>Reset all</button><button type="button" className="meetings-primary-button" onClick={() => setSheetOpen(false)}>Show results</button></footer></section></div>}</section>
}