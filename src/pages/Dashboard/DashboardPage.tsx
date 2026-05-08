import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Clock, Zap, Activity, TrendingUp, ArrowRight, Store,
  AlertTriangle, FileText, BookOpen, Plus, MoreHorizontal,
  CheckCircle2, RefreshCw, AlertCircle, Settings,
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import PageLayout from '@/components/layout/PageLayout'
import StatCard from '@/components/ui/StatCard'
import ActivityFeed from '@/components/ui/ActivityFeed'
import GlowButton from '@/components/ui/GlowButton'
import { dashboardStats, installedWorkflows, recentActivity, monthlyAutomationData, workflowPerformanceData } from '@/data/dashboard'
import { workflows } from '@/data/workflows'
import { cn, statusColor, formatCurrency } from '@/lib/utils'

const iconMap: Record<string, React.ElementType> = {
  AlertTriangle, FileText, BookOpen,
}

type TabId = 'overview' | 'workflows' | 'activity'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  const installedWithData = installedWorkflows.map(iw => {
    const wf = workflows.find(w => w.id === iw.workflowId)
    return { ...iw, workflow: wf }
  }).filter(iw => iw.workflow)

  const stats = [
    {
      label: 'Hours Saved This Month',
      value: dashboardStats.totalHoursSaved,
      subValue: '+24 vs last month',
      icon: Clock,
      color: 'brand' as const,
      trend: { value: '7%', positive: true },
    },
    {
      label: 'Actions Processed',
      value: dashboardStats.totalActionsProcessed.toLocaleString(),
      subValue: '+683 vs last month',
      icon: Zap,
      color: 'cyan' as const,
      trend: { value: '21%', positive: true },
    },
    {
      label: 'Active Workflows',
      value: dashboardStats.activeWorkflows,
      icon: Activity,
      color: 'emerald' as const,
    },
    {
      label: 'Cost Savings (MTD)',
      value: formatCurrency(dashboardStats.costSavings),
      subValue: 'Estimated FTE equivalence',
      icon: TrendingUp,
      color: 'amber' as const,
      trend: { value: '12%', positive: true },
    },
  ]

  const tabs: { id: TabId; label: string }[] = [
    { id: 'overview',   label: 'Overview' },
    { id: 'workflows',  label: 'Workflows' },
    { id: 'activity',   label: 'Activity' },
  ]

  return (
    <PageLayout>
      <div className="pt-24 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-6">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
          >
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Dashboard</p>
              <h1 className="text-2xl font-bold text-slate-100">Operations Overview</h1>
            </div>
            <GlowButton icon={Plus} iconRight={Store} onClick={() => navigate('/marketplace')}>
              Add Workflow
            </GlowButton>
          </motion.div>

          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((s, i) => (
              <StatCard key={s.label} {...s} index={i} />
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-surface-700/50 rounded-xl p-1 w-fit">
            {tabs.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  activeTab === id
                    ? 'bg-surface-500 text-slate-100 shadow-sm'
                    : 'text-slate-500 hover:text-slate-300'
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── Overview tab ─────────────────────────────── */}
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Hours saved chart */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-2 card-base p-6"
              >
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-semibold text-slate-200">Hours Saved</h3>
                    <p className="text-xs text-slate-500">Monthly automation output</p>
                  </div>
                  <span className="badge-emerald">+7% MoM</span>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={monthlyAutomationData}>
                    <defs>
                      <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1c1c32', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#e2e8f0' }}
                      labelStyle={{ color: '#94a3b8' }}
                    />
                    <Area type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={2} fill="url(#hoursGrad)" name="Hours" />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Workflow distribution */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card-base p-6"
              >
                <div className="mb-5">
                  <h3 className="font-semibold text-slate-200">Workflow Usage</h3>
                  <p className="text-xs text-slate-500">Share of total automations</p>
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={workflowPerformanceData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" strokeWidth={0}>
                      {workflowPerformanceData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1c1c32', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#e2e8f0' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {workflowPerformanceData.map(({ name, value, color }) => (
                    <div key={name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-slate-400 truncate max-w-[140px]">{name}</span>
                      </div>
                      <span className="text-slate-300 font-medium">{value}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Actions chart */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card-base p-6"
              >
                <div className="mb-5">
                  <h3 className="font-semibold text-slate-200">Actions Processed</h3>
                  <p className="text-xs text-slate-500">Monthly volume</p>
                </div>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={monthlyAutomationData} barSize={20}>
                    <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1c1c32', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#e2e8f0' }}
                    />
                    <Bar dataKey="actions" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Actions" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Recent activity */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="lg:col-span-2 card-base p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-200">Recent Activity</h3>
                  <button onClick={() => setActiveTab('activity')} className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                    View all
                  </button>
                </div>
                <ActivityFeed items={recentActivity} limit={5} />
              </motion.div>
            </div>
          )}

          {/* ── Workflows tab ─────────────────────────────── */}
          {activeTab === 'workflows' && (
            <div className="space-y-4">
              {installedWithData.map(({ workflow: wf, status, lastRun, runsThisMonth, hoursSaved, actionsProcessed }, i) => {
                if (!wf) return null
                const WfIcon = iconMap[wf.icon] ?? Zap
                const statusIcon = {
                  active: CheckCircle2,
                  inactive: AlertCircle,
                  error: AlertTriangle,
                  configuring: RefreshCw,
                }[status]
                const StatusIcon = statusIcon

                return (
                  <motion.div
                    key={wf.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="card-base p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5"
                  >
                    <div className={cn(
                      'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0',
                      'bg-gradient-to-br', wf.color
                    )}>
                      <WfIcon className="w-5 h-5 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-semibold text-slate-200 text-sm">{wf.name}</h3>
                        <div className={cn('flex items-center gap-1 text-xs font-medium', statusColor(status))}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">
                        {lastRun
                          ? `Last run: ${new Date(lastRun).toLocaleString()}`
                          : 'Not yet run'
                        }
                      </p>
                    </div>

                    <div className="flex items-center gap-6 text-center">
                      <div>
                        <div className="text-lg font-bold text-slate-100">{runsThisMonth.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-500">Runs / mo</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-brand-400">{hoursSaved}h</div>
                        <div className="text-[10px] text-slate-500">Hours saved</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-cyan-400">{actionsProcessed.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-500">Actions</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => navigate(`/workflow/${wf.slug}`)}
                        className="btn-ghost text-xs gap-1"
                      >
                        View <ArrowRight className="w-3 h-3" />
                      </button>
                      <button className="w-8 h-8 rounded-lg bg-surface-600/60 border border-white/[0.06] flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )
              })}

              {/* Add workflow CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="card-base p-6 border-dashed flex items-center justify-between"
              >
                <div>
                  <h3 className="font-medium text-slate-300 text-sm mb-0.5">Add another workflow</h3>
                  <p className="text-xs text-slate-500">Browse 80+ enterprise-ready automations</p>
                </div>
                <GlowButton variant="secondary" icon={Plus} onClick={() => navigate('/marketplace')}>
                  Browse Marketplace
                </GlowButton>
              </motion.div>
            </div>
          )}

          {/* ── Activity tab ──────────────────────────────── */}
          {activeTab === 'activity' && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-base p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-slate-200">All Activity</h3>
                <span className="text-xs text-slate-500">{recentActivity.length} events</span>
              </div>
              <ActivityFeed items={recentActivity} limit={20} />
            </motion.div>
          )}

        </div>
      </div>
    </PageLayout>
  )
}
