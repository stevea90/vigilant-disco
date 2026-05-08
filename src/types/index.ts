export type WorkflowCategory =
  | 'ITSM'
  | 'HR'
  | 'Finance'
  | 'Security'
  | 'Operations'
  | 'Analytics'
  | 'Compliance'
  | 'Customer Service'

export type Difficulty = 'Easy' | 'Medium' | 'Advanced'

export type WorkflowStatus = 'active' | 'inactive' | 'error' | 'configuring'

export type PricingTier = 'Free' | 'Pro' | 'Enterprise'

export interface Integration {
  id: string
  name: string
  logo: string
  color: string
}

export interface WorkflowFeature {
  title: string
  description: string
  icon: string
}

export interface ROIMetric {
  label: string
  value: string
  unit: string
}

export interface Workflow {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  longDescription: string
  category: WorkflowCategory
  tags: string[]
  difficulty: Difficulty
  pricingTier: PricingTier
  price?: number
  timeSavedPerMonth: number
  automationRate: number
  setupMinutes: number
  integrations: Integration[]
  features: WorkflowFeature[]
  roi: ROIMetric[]
  rating: number
  reviewCount: number
  installCount: number
  isNew?: boolean
  isFeatured?: boolean
  color: string
  accentColor: string
  icon: string
  version: string
  lastUpdated: string
  author: string
}

export interface InstalledWorkflow {
  workflowId: string
  status: WorkflowStatus
  installedAt: string
  lastRun?: string
  runsThisMonth: number
  hoursSaved: number
  actionsProcessed: number
  nextScheduled?: string
}

export interface ActivityItem {
  id: string
  workflowId: string
  workflowName: string
  action: string
  outcome: string
  timestamp: string
  status: 'success' | 'warning' | 'error' | 'info'
  metadata?: Record<string, string>
}

export interface DashboardStats {
  totalHoursSaved: number
  totalActionsProcessed: number
  activeWorkflows: number
  automationRate: number
  costSavings: number
  incidentsResolved: number
}
