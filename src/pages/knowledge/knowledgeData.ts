import type { KnowledgeAnswer, KnowledgeCollection, KnowledgeFiltersState, KnowledgeReference, KnowledgeSource } from './knowledgeTypes'

export const mockCollections: KnowledgeCollection[] = [
  { id: 'policies', name: 'Policies', description: 'Official organizational policies and directives.', sourceCount: 124, updatedAt: 'Today' },
  { id: 'procedures', name: 'Procedures', description: 'Approved operating procedures and workflows.', sourceCount: 86, updatedAt: 'Yesterday' },
  { id: 'guidelines', name: 'Guidelines', description: 'Practical guidance for consistent workplace decisions.', sourceCount: 53, updatedAt: 'Sep 30, 2026' },
  { id: 'reports', name: 'Reports', description: 'Reviewed reports, findings, and operational summaries.', sourceCount: 217, updatedAt: 'Sep 29, 2026' },
  { id: 'templates', name: 'Templates', description: 'Approved forms, letters, and reusable document formats.', sourceCount: 38, updatedAt: 'Sep 26, 2026' },
  { id: 'hr', name: 'HR', description: 'People policies, benefits, and staff procedures.', sourceCount: 72, updatedAt: 'Today' },
  { id: 'finance', name: 'Finance', description: 'Financial controls, procurement, and approvals.', sourceCount: 65, updatedAt: 'Sep 28, 2026' },
  { id: 'operations', name: 'Operations', description: 'Departmental knowledge for day-to-day delivery.', sourceCount: 94, updatedAt: 'Yesterday' },
  { id: 'administration', name: 'Administration', description: 'Administrative processes and organization-wide references.', sourceCount: 41, updatedAt: 'Sep 25, 2026' },
  { id: 'projects', name: 'Projects', description: 'Project plans, decisions, and implementation records.', sourceCount: 31, updatedAt: 'Sep 24, 2026' },
]

export const mockKnowledgeSources: KnowledgeSource[] = [
  { id: 'staff-leave-policy-2026', title: 'Staff Leave Policy 2026', type: 'Policy', department: 'HR', owner: 'Naomi L.', updatedAt: '2026-09-12', addedAt: 'Today', status: 'Ready', collection: 'Policies', visibility: 'Organization', description: 'Current policy for annual, sick, and special leave requests.', pagesIndexed: 18, sectionsIndexed: 42, lastIndexed: 'Today, 09:32 AM', relatedDocuments: ['Leave request form', 'Staff Handbook 2026'], relatedPolicies: ['Staff Handbook 2026'], relatedTasks: ['Review leave balance process'], relatedCorrespondence: ['HR leave circular'], excerpt: 'Staff should submit their leave request through their department supervisor before the requested leave period. Requests should include the dates, leave type, and handover plan.', page: 4, section: 'Annual leave requests', tags: ['leave', 'staff', 'HR'] },
  { id: 'hr-procedures-manual', title: 'HR Procedures Manual', type: 'Procedure', department: 'HR', owner: 'Miriam K.', updatedAt: '2026-09-10', addedAt: 'Yesterday', status: 'Ready', collection: 'Procedures', visibility: 'Department', description: 'Operational procedures for HR services and staff requests.', pagesIndexed: 76, sectionsIndexed: 112, lastIndexed: 'Sep 30, 2026', relatedDocuments: ['Staff Leave Policy 2026'], relatedPolicies: ['Staff Leave Policy 2026'], relatedTasks: ['Update HR service guide'], relatedCorrespondence: [], excerpt: 'The employee submits a completed leave form to their supervisor. HR verifies entitlement and records the approved dates in the staff register.', section: '3.2 Leave workflow', tags: ['HR', 'process'] },
  { id: 'procurement-procedure-manual', title: 'Procurement Procedure Manual', type: 'Procedure', department: 'Finance', owner: 'Daniel O.', updatedAt: '2026-09-28', addedAt: 'Yesterday', status: 'Ready', collection: 'Finance', visibility: 'Organization', description: 'Procurement thresholds, approvals, evaluation, and recordkeeping.', pagesIndexed: 98, sectionsIndexed: 143, lastIndexed: 'Sep 29, 2026', relatedDocuments: ['Procurement request template', 'Quarterly Procurement Report'], relatedPolicies: ['Procurement Policy 2026'], relatedTasks: ['Review procurement thresholds'], relatedCorrespondence: ['Procurement Committee notice'], excerpt: 'Requests above the departmental threshold must receive approval from the delegated authority before a purchase order is issued.', page: 12, section: '5.4 Approval thresholds', tags: ['procurement', 'approval', 'finance'] },
  { id: 'procurement-policy-2026', title: 'Procurement Policy 2026', type: 'Policy', department: 'Finance', owner: 'Daniel O.', updatedAt: '2026-09-20', addedAt: 'Sep 28, 2026', status: 'Ready', collection: 'Policies', visibility: 'Organization', description: 'Organization-wide procurement principles and delegated controls.', pagesIndexed: 42, sectionsIndexed: 68, lastIndexed: 'Sep 28, 2026', relatedDocuments: ['Procurement Procedure Manual'], relatedPolicies: [], relatedTasks: [], relatedCorrespondence: [], excerpt: 'Procurement decisions must be transparent, appropriately authorized, and supported by a complete audit record.', page: 8, section: 'Principles and controls', tags: ['policy', 'finance'] },
  { id: 'incoming-correspondence-procedure', title: 'Incoming Correspondence Procedure', type: 'Procedure', department: 'Administration', owner: 'Miriam K.', updatedAt: '2026-09-18', addedAt: 'Sep 30, 2026', status: 'Ready', collection: 'Procedures', visibility: 'Organization', description: 'Registration, routing, action assignment, and response tracking for incoming correspondence.', pagesIndexed: 26, sectionsIndexed: 39, lastIndexed: 'Sep 30, 2026', relatedDocuments: ['Correspondence register template'], relatedPolicies: ['Records Management Policy'], relatedTasks: ['Review correspondence turnaround targets'], relatedCorrespondence: ['FMT/TPC/2026/041'], excerpt: 'All incoming correspondence is date-stamped, assigned a reference number, and entered in the register before routing to the responsible department.', page: 6, section: '2.1 Receiving and registration', tags: ['correspondence', 'registry'] },
  { id: 'quarterly-transport-report', title: 'Quarterly Transport Report Q3 2026', type: 'Report', department: 'Operations', owner: 'Cephas A.', updatedAt: '2026-09-26', addedAt: 'Sep 29, 2026', status: 'Ready', collection: 'Reports', visibility: 'Organization', description: 'Reviewed service delivery and transport performance for Q3 2026.', pagesIndexed: 54, sectionsIndexed: 83, lastIndexed: 'Sep 29, 2026', relatedDocuments: ['Transport Operations Guidelines'], relatedPolicies: [], relatedTasks: ['Prepare Q4 transport report'], relatedCorrespondence: [], excerpt: 'The quarterly report is due to the Directorate on the fifth working day following quarter close.', page: 3, section: 'Reporting calendar', tags: ['transport', 'quarterly'] },
  { id: 'transport-operations-guidelines', title: 'Transport Operations Guidelines', type: 'Guideline', department: 'Operations', owner: 'Cephas A.', updatedAt: '2026-09-22', addedAt: '2 days ago', status: 'Processing', collection: 'Operations', visibility: 'Department', description: 'Practical operating guidance for transport planning teams.', pagesIndexed: 0, sectionsIndexed: 0, lastIndexed: 'Indexing in progress', relatedDocuments: [], relatedPolicies: [], relatedTasks: [], relatedCorrespondence: [], excerpt: 'Guidance for transport planning and service coordination.', tags: ['operations', 'transport'] },
  { id: 'staff-handbook-2026', title: 'Staff Handbook 2026', type: 'Policy', department: 'HR', owner: 'Naomi L.', updatedAt: '2026-10-02', addedAt: 'Today', status: 'Ready', collection: 'HR', visibility: 'Organization', description: 'Staff conduct, leave, working arrangements, and workplace standards.', pagesIndexed: 104, sectionsIndexed: 168, lastIndexed: 'Today, 08:46 AM', relatedDocuments: ['Staff Leave Policy 2026'], relatedPolicies: ['Staff Leave Policy 2026'], relatedTasks: [], relatedCorrespondence: [], excerpt: 'The handbook defines common people practices and links to current policy documents for authoritative guidance.', page: 9, section: 'Staff leave overview', tags: ['staff', 'HR'] },
  { id: 'correspondence-template', title: 'Official Correspondence Template', type: 'Template', department: 'Administration', owner: 'Miriam K.', updatedAt: '2026-09-16', addedAt: 'Sep 26, 2026', status: 'Needs Review', collection: 'Templates', visibility: 'Department', description: 'Standard template for formal external correspondence.', pagesIndexed: 0, sectionsIndexed: 0, lastIndexed: 'Needs review', relatedDocuments: [], relatedPolicies: [], relatedTasks: [], relatedCorrespondence: [], excerpt: 'Standard format for official letters and outgoing responses.', tags: ['template', 'correspondence'] },
  { id: 'records-management-policy', title: 'Records Management Policy', type: 'Policy', department: 'Administration', owner: 'Miriam K.', updatedAt: '2026-08-30', addedAt: 'Sep 24, 2026', status: 'Ready', collection: 'Policies', visibility: 'Organization', description: 'Retention, classification, and secure handling of organizational records.', pagesIndexed: 37, sectionsIndexed: 59, lastIndexed: 'Sep 1, 2026', relatedDocuments: ['Incoming Correspondence Procedure'], relatedPolicies: [], relatedTasks: [], relatedCorrespondence: [], excerpt: 'Records must be classified and retained according to the approved retention schedule.', page: 14, section: '6. Records retention', tags: ['records', 'retention'] },
  { id: 'archived-travel-circular', title: 'Travel Circular 2024', type: 'Policy', department: 'Administration', owner: 'Registry', updatedAt: '2024-06-11', addedAt: 'Aug 19, 2024', status: 'Archived', collection: 'Policies', visibility: 'Organization', description: 'Superseded travel guidance retained for reference.', pagesIndexed: 10, sectionsIndexed: 16, lastIndexed: 'Archived', relatedDocuments: [], relatedPolicies: [], relatedTasks: [], relatedCorrespondence: [], excerpt: 'This circular has been superseded by the 2026 travel policy.', page: 1, section: 'Notice', tags: ['archive'] },
  { id: 'private-operations-checklist', title: 'Operations Desk Checklist', type: 'Manual', department: 'Operations', owner: 'Cephas A.', updatedAt: '2026-09-21', addedAt: 'Sep 21, 2026', status: 'Ready', collection: 'Operations', visibility: 'Only you', description: 'Personal checklist for preparing daily operations handover.', pagesIndexed: 4, sectionsIndexed: 9, lastIndexed: 'Sep 21, 2026', relatedDocuments: [], relatedPolicies: [], relatedTasks: [], relatedCorrespondence: [], excerpt: 'Check open actions, unresolved dependencies, and handover notes before the daily operations briefing.', page: 2, section: 'Daily handover', tags: ['operations', 'checklist'] },
  { id: 'legacy-minutes-digitization', title: 'Legacy Meeting Minutes Batch', type: 'Manual', department: 'Administration', owner: 'Registry', updatedAt: '2026-09-19', addedAt: 'Sep 19, 2026', status: 'Failed', collection: 'Administration', visibility: 'Organization', description: 'Historical minutes awaiting a clean source scan before indexing.', pagesIndexed: 0, sectionsIndexed: 0, lastIndexed: 'Processing failed', relatedDocuments: [], relatedPolicies: [], relatedTasks: [], relatedCorrespondence: [], excerpt: 'The source could not be indexed because several pages were unreadable.', tags: ['minutes', 'legacy'] },
]

export const suggestionQuestions = [
  'Find our leave policy',
  'Explain the procurement process',
  'What is the document retention policy?',
  'Find the latest transport report',
  'What is the approval process?',
  'Show procedures for incoming correspondence',
]

export const initialKnowledgeFilters: KnowledgeFiltersState = { collection: 'All collections', department: 'All departments', documentType: 'All types', updated: 'Any time', owner: 'Anyone', status: 'All statuses', sort: 'Relevance' }

export function toReference(source: KnowledgeSource, relevance: number): KnowledgeReference {
  return { documentId: source.id, documentName: source.title, page: source.page, section: source.section, excerpt: source.excerpt, relevance, updatedAt: source.updatedAt, department: source.department, collection: source.collection }
}

export async function searchMockKnowledge(question: string, sources: KnowledgeSource[]): Promise<KnowledgeAnswer> {
  await new Promise((resolve) => window.setTimeout(resolve, 520))
  const normalized = question.toLowerCase()
  const relevant = normalized.includes('leave')
    ? ['staff-leave-policy-2026', 'hr-procedures-manual', 'staff-handbook-2026']
    : normalized.includes('procurement') || normalized.includes('approval')
      ? ['procurement-procedure-manual', 'procurement-policy-2026']
      : normalized.includes('retention') || normalized.includes('records')
        ? ['records-management-policy', 'incoming-correspondence-procedure']
      : normalized.includes('correspondence')
        ? ['incoming-correspondence-procedure', 'records-management-policy']
        : normalized.includes('report') || normalized.includes('quarter')
          ? ['quarterly-transport-report', 'transport-operations-guidelines']
          : []
  const matches = relevant.map((id) => sources.find((source) => source.id === id)).filter((source): source is KnowledgeSource => Boolean(source && source.status === 'Ready'))
  const references = matches.map((source, index) => toReference(source, Math.max(78, 97 - index * 9)))
  const answer = normalized.includes('leave')
    ? 'According to the current HR policy, staff should submit their leave request through their department supervisor before the requested leave period. Include the leave dates, type, and a handover plan; HR verifies entitlement and records the approved dates.'
    : normalized.includes('procurement') || normalized.includes('approval')
      ? 'Procurement requests should be documented and approved by the delegated authority before a purchase order is issued. The required approval level depends on the request value and the organization’s current thresholds.'
      : normalized.includes('correspondence')
        ? 'Incoming correspondence is date-stamped, assigned a reference number, and recorded before it is routed to the responsible department. The department then assigns an action owner and tracks any response deadline.'
        : normalized.includes('report') || normalized.includes('quarter')
          ? 'The Q3 transport report indicates that the quarterly submission is due on the fifth working day following quarter close. The reporting calendar and operations guidance should be checked before submitting.'
          : 'I could not find a sufficiently relevant authorized source for this question. Try a different workplace term or browse the knowledge collections.'
  return { question, answer, sources: references, createdAt: new Date().toISOString() }
}

export async function loadMockKnowledgeSources(): Promise<KnowledgeSource[]> {
  await new Promise((resolve) => window.setTimeout(resolve, 320))
  return structuredClone(mockKnowledgeSources)
}