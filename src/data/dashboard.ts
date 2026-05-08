import type { InstalledWorkflow, ActivityItem, DashboardStats } from '@/types'

export const installedWorkflows: InstalledWorkflow[] = [
  {
    workflowId: 'wf-001',
    status: 'active',
    installedAt: '2025-10-15',
    lastRun: '2026-01-10T14:32:00Z',
    runsThisMonth: 847,
    hoursSaved: 186,
    actionsProcessed: 3214,
    nextScheduled: '2026-01-10T15:00:00Z',
  },
  {
    workflowId: 'wf-002',
    status: 'active',
    installedAt: '2025-11-02',
    lastRun: '2026-01-10T08:00:00Z',
    runsThisMonth: 42,
    hoursSaved: 98,
    actionsProcessed: 168,
    nextScheduled: '2026-01-11T08:00:00Z',
  },
  {
    workflowId: 'wf-005',
    status: 'active',
    installedAt: '2025-09-20',
    lastRun: '2026-01-10T13:15:00Z',
    runsThisMonth: 124,
    hoursSaved: 82,
    actionsProcessed: 511,
  },
  {
    workflowId: 'wf-003',
    status: 'configuring',
    installedAt: '2026-01-08',
    runsThisMonth: 0,
    hoursSaved: 0,
    actionsProcessed: 0,
  },
]

export const recentActivity: ActivityItem[] = [
  {
    id: 'act-001',
    workflowId: 'wf-001',
    workflowName: 'AI Incident Manager',
    action: 'Auto-resolved P2 incident',
    outcome: 'INC0042891 resolved via known pattern — DB connection pool exhaustion',
    timestamp: '2026-01-10T14:32:00Z',
    status: 'success',
    metadata: { priority: 'P2', duration: '4m 12s', team: 'Platform' },
  },
  {
    id: 'act-002',
    workflowId: 'wf-002',
    workflowName: 'Executive Briefing Generator',
    action: 'Weekly ops briefing delivered',
    outcome: 'Briefing sent to 12 stakeholders — 3 pages, 847 incidents summarised',
    timestamp: '2026-01-10T08:00:00Z',
    status: 'success',
    metadata: { recipients: '12', pages: '3' },
  },
  {
    id: 'act-003',
    workflowId: 'wf-001',
    workflowName: 'AI Incident Manager',
    action: 'Escalated P1 incident',
    outcome: 'INC0042867 escalated to Senior SRE — novel pattern detected, human review required',
    timestamp: '2026-01-10T11:47:00Z',
    status: 'warning',
    metadata: { priority: 'P1', reason: 'Novel pattern' },
  },
  {
    id: 'act-004',
    workflowId: 'wf-005',
    workflowName: 'AI Knowledge Article Writer',
    action: 'Article published',
    outcome: 'KB0018234 published — "Resolving Kubernetes pod scheduling failures"',
    timestamp: '2026-01-10T13:15:00Z',
    status: 'success',
    metadata: { articleId: 'KB0018234', words: '487' },
  },
  {
    id: 'act-005',
    workflowId: 'wf-001',
    workflowName: 'AI Incident Manager',
    action: 'Auto-resolved P3 incident',
    outcome: 'INC0042901 resolved — disk space cleanup executed on prod-web-04',
    timestamp: '2026-01-10T12:03:00Z',
    status: 'success',
    metadata: { priority: 'P3', duration: '1m 44s' },
  },
  {
    id: 'act-006',
    workflowId: 'wf-001',
    workflowName: 'AI Incident Manager',
    action: 'Correlation failed',
    outcome: 'INC0042888 — insufficient signal data for root cause analysis, ticket created',
    timestamp: '2026-01-10T10:22:00Z',
    status: 'info',
    metadata: { priority: 'P2' },
  },
  {
    id: 'act-007',
    workflowId: 'wf-005',
    workflowName: 'AI Knowledge Article Writer',
    action: 'Duplicate detected',
    outcome: 'Draft blocked — 92% similarity to KB0017834, suggested merge instead',
    timestamp: '2026-01-10T09:50:00Z',
    status: 'warning',
    metadata: { similarity: '92%', existingArticle: 'KB0017834' },
  },
]

export const dashboardStats: DashboardStats = {
  totalHoursSaved: 366,
  totalActionsProcessed: 3893,
  activeWorkflows: 3,
  automationRate: 81,
  costSavings: 47800,
  incidentsResolved: 621,
}

export const monthlyAutomationData = [
  { month: 'Aug', hours: 142, actions: 1240 },
  { month: 'Sep', hours: 198, actions: 1820 },
  { month: 'Oct', hours: 245, actions: 2190 },
  { month: 'Nov', hours: 312, actions: 2840 },
  { month: 'Dec', hours: 338, actions: 3210 },
  { month: 'Jan', hours: 366, actions: 3893 },
]

export const workflowPerformanceData = [
  { name: 'AI Incident Manager', value: 58, color: '#6366f1' },
  { name: 'Executive Briefing', value: 27, color: '#06b6d4' },
  { name: 'Knowledge Writer', value: 15, color: '#10b981' },
]
