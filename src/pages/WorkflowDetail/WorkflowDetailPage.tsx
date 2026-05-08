import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Star, Clock, Users, Zap, Download, CheckCircle2,
  AlertTriangle, FileText, ShieldAlert, BookOpen, UserPlus, Shield,
  TrendingUp, BarChart2, Brain, RefreshCw, GitBranch, ClipboardCheck,
  Database, Calendar, Layout, Send, PenTool, Copy, Search, Key,
  Map, Bell, GraduationCap, Heart, Network, Activity, Eye, Archive,
  Package, List, Repeat, TrendingDown, CheckSquare,
} from 'lucide-react'
import PageLayout from '@/components/layout/PageLayout'
import GlowButton from '@/components/ui/GlowButton'
import IntegrationBadge from '@/components/ui/IntegrationBadge'
import { getWorkflowBySlug } from '@/data/workflows'
import { cn, difficultyColor, tierColor } from '@/lib/utils'

const iconMap: Record<string, React.ElementType> = {
  AlertTriangle, FileText, ShieldAlert, Users, BookOpen, UserPlus, Shield, TrendingUp,
  Zap, BarChart2, Brain, RefreshCw, GitBranch, ClipboardCheck, Database, Calendar,
  Layout, Send, PenTool, Copy, Search, Key, Map, Bell, GraduationCap, Heart,
  Network, Activity, Eye, Archive, Package, List, Repeat, TrendingDown, CheckSquare,
  CheckCircle2,
}

export default function WorkflowDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const wf = getWorkflowBySlug(slug ?? '')

  if (!wf) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-400 mb-4">Workflow not found.</p>
            <GlowButton variant="secondary" onClick={() => navigate('/marketplace')}>
              Back to Marketplace
            </GlowButton>
          </div>
        </div>
      </PageLayout>
    )
  }

  const WorkflowIcon = iconMap[wf.icon] ?? Zap

  return (
    <PageLayout>
      <div className="pt-20 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-6">

          {/* ── Back nav ───────────────────────────────────── */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-8 mt-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* ── Left: main content ─────────────────────── */}
            <div className="lg:col-span-2 space-y-8">

              {/* Hero card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-base overflow-hidden"
              >
                <div className={`h-2 w-full bg-gradient-to-r ${wf.color}`} />
                <div className="p-7">
                  <div className="flex items-start gap-5">
                    <div className={cn(
                      'w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0',
                      'bg-gradient-to-br', wf.color, 'shadow-glow-md'
                    )}>
                      <WorkflowIcon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        {wf.isNew && <span className="badge-brand">NEW</span>}
                        <span className={difficultyColor(wf.difficulty)}>{wf.difficulty}</span>
                        <span className={tierColor(wf.pricingTier)}>{wf.pricingTier}</span>
                        <span className="badge-slate">{wf.category}</span>
                      </div>
                      <h1 className="text-2xl font-bold text-slate-100 mb-2">{wf.name}</h1>
                      <p className="text-slate-400">{wf.tagline}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mt-5 pt-5 border-t border-white/[0.06]">
                    <div className="flex items-center gap-1.5 text-sm">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="font-semibold text-slate-200">{wf.rating}</span>
                      <span className="text-slate-500">({wf.reviewCount.toLocaleString()} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                      <Download className="w-4 h-4" />
                      {wf.installCount.toLocaleString()} installs
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                      <Clock className="w-4 h-4" />
                      v{wf.version}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Overview */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card-base p-7"
              >
                <h2 className="text-lg font-semibold text-slate-100 mb-4">Overview</h2>
                <div className="text-sm text-slate-400 leading-relaxed space-y-3">
                  {wf.longDescription.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="card-base p-7"
              >
                <h2 className="text-lg font-semibold text-slate-100 mb-5">Features</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {wf.features.map(({ title, description, icon }, i) => {
                    const FIcon = iconMap[icon] ?? Zap
                    return (
                      <motion.div
                        key={title}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.06 }}
                        className="flex items-start gap-3 p-4 rounded-xl bg-surface-600/40 border border-white/[0.04]"
                      >
                        <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                          <FIcon className="w-4 h-4 text-brand-400" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-200 mb-0.5">{title}</div>
                          <div className="text-xs text-slate-500 leading-relaxed">{description}</div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>

              {/* Integrations */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card-base p-7"
              >
                <h2 className="text-lg font-semibold text-slate-100 mb-5">Supported Integrations</h2>
                <div className="flex flex-wrap gap-3">
                  {wf.integrations.map(int => (
                    <IntegrationBadge key={int.id} integration={int} />
                  ))}
                </div>
              </motion.div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {wf.tags.map(tag => (
                  <span key={tag} className="badge-slate">{tag}</span>
                ))}
              </div>
            </div>

            {/* ── Right: sidebar ─────────────────────────── */}
            <div className="space-y-5">

              {/* CTA card */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
                className="card-base p-6 sticky top-24"
              >
                <div className="text-center mb-5">
                  {wf.pricingTier === 'Free' ? (
                    <div>
                      <div className="text-3xl font-bold text-emerald-400 mb-0.5">Free</div>
                      <div className="text-xs text-slate-500">No credit card required</div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-3xl font-bold text-slate-100">${wf.price}</div>
                      <div className="text-xs text-slate-500">per month</div>
                    </div>
                  )}
                </div>

                <GlowButton
                  size="lg"
                  className="w-full justify-center"
                  iconRight={Zap}
                  onClick={() => navigate(`/install/${wf.slug}`)}
                >
                  Install Workflow
                </GlowButton>

                <div className="mt-5 space-y-2.5">
                  {[
                    `Setup in ~${wf.setupMinutes} minutes`,
                    `Saves ~${wf.timeSavedPerMonth}h/month`,
                    `${wf.automationRate}% automation rate`,
                    `Author: ${wf.author}`,
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* ROI metrics */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="card-base p-6"
              >
                <h3 className="text-sm font-semibold text-slate-300 mb-4">ROI Metrics</h3>
                <div className="grid grid-cols-2 gap-3">
                  {wf.roi.map(({ label, value, unit }) => (
                    <div key={label} className="bg-surface-600/40 rounded-xl p-3 border border-white/[0.04]">
                      <div className="text-xl font-bold gradient-text-brand">
                        {value}{unit && <span className="text-sm font-medium text-brand-400 ml-0.5">{unit}</span>}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">{label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Quick stats */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="card-base p-6"
              >
                <h3 className="text-sm font-semibold text-slate-300 mb-4">Details</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Category', value: wf.category },
                    { label: 'Difficulty', value: wf.difficulty },
                    { label: 'Version', value: `v${wf.version}` },
                    { label: 'Last Updated', value: new Date(wf.lastUpdated).toLocaleDateString() },
                    { label: 'Author', value: wf.author },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">{label}</span>
                      <span className="text-slate-300 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
