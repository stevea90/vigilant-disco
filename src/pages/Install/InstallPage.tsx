import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check, Zap, Shield, Cpu, Rocket, ArrowRight, ArrowLeft,
  AlertTriangle, FileText, ShieldAlert, Users, BookOpen, UserPlus, TrendingUp,
  CheckCircle2, Loader2, ExternalLink,
} from 'lucide-react'
import PageLayout from '@/components/layout/PageLayout'
import GlowButton from '@/components/ui/GlowButton'
import { getWorkflowBySlug } from '@/data/workflows'
import { cn } from '@/lib/utils'

const iconMap: Record<string, React.ElementType> = {
  AlertTriangle, FileText, ShieldAlert, Users, BookOpen, UserPlus, Shield: Shield, TrendingUp,
}

type StepId = 'permissions' | 'integrations' | 'ai_config' | 'deploying' | 'success'

const STEPS: { id: StepId; label: string; icon: React.ElementType }[] = [
  { id: 'permissions',   label: 'Permissions',   icon: Shield },
  { id: 'integrations',  label: 'Integrations',  icon: Zap },
  { id: 'ai_config',     label: 'AI Config',     icon: Cpu },
  { id: 'deploying',     label: 'Deploying',     icon: Rocket },
]

interface DeployLog {
  message: string
  status: 'pending' | 'running' | 'done' | 'error'
}

export default function InstallPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const wf = getWorkflowBySlug(slug ?? '')

  const [step, setStep]             = useState<StepId>('permissions')
  const [permissions, setPermissions] = useState<Record<string, boolean>>({})
  const [integConnected, setIntegConnected] = useState<Record<string, boolean>>({})
  const [aiModel, setAiModel]       = useState('claude-sonnet-4-6')
  const [deployLogs, setDeployLogs] = useState<DeployLog[]>([])
  const [deploying, setDeploying]   = useState(false)

  if (!wf) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-slate-400">Workflow not found.</p>
        </div>
      </PageLayout>
    )
  }

  const WorkflowIcon = iconMap[wf.icon] ?? Zap
  const stepIndex = STEPS.findIndex(s => s.id === step)

  const requiredPermissions = [
    { id: 'read_incidents',   label: 'Read Incidents & Alerts',      description: 'View existing incidents and monitoring alerts' },
    { id: 'write_incidents',  label: 'Create & Update Incidents',    description: 'Create, update and resolve incident records' },
    { id: 'read_cmdb',        label: 'Read Configuration Items',     description: 'Access CMDB for dependency mapping' },
    { id: 'send_notifications', label: 'Send Notifications',          description: 'Post to Slack channels and send email alerts' },
    { id: 'run_scripts',      label: 'Execute Remediation Scripts',  description: 'Run approved runbook scripts (sandboxed)' },
  ]

  const runDeployment = async () => {
    setDeploying(true)
    const steps: DeployLog[] = [
      { message: 'Validating configuration...', status: 'pending' },
      { message: 'Provisioning AI runtime environment...', status: 'pending' },
      { message: 'Connecting to ServiceNow instance...', status: 'pending' },
      { message: 'Configuring integration webhooks...', status: 'pending' },
      { message: 'Loading workflow logic (v' + wf.version + ')...', status: 'pending' },
      { message: 'Running pre-flight health checks...', status: 'pending' },
      { message: 'Deploying to production environment...', status: 'pending' },
      { message: 'Activating workflow listeners...', status: 'pending' },
    ]

    setDeployLogs(steps.map(s => ({ ...s, status: 'pending' })))

    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 600 + Math.random() * 600))
      setDeployLogs(prev => prev.map((s, idx) =>
        idx === i ? { ...s, status: 'running' } : s
      ))
      await new Promise(r => setTimeout(r, 400 + Math.random() * 400))
      setDeployLogs(prev => prev.map((s, idx) =>
        idx === i ? { ...s, status: 'done' } : s
      ))
    }

    await new Promise(r => setTimeout(r, 500))
    setStep('success')
    setDeploying(false)
  }

  const handleNext = () => {
    if (step === 'permissions') setStep('integrations')
    else if (step === 'integrations') setStep('ai_config')
    else if (step === 'ai_config') { setStep('deploying'); runDeployment() }
  }

  return (
    <PageLayout noFooter>
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-6">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-10"
          >
            <div className={cn(
              'w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br',
              wf.color, 'shadow-glow-sm'
            )}>
              <WorkflowIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Installing</p>
              <h1 className="text-xl font-bold text-slate-100">{wf.name}</h1>
            </div>
          </motion.div>

          {/* Step progress (hidden on success) */}
          {step !== 'success' && (
            <div className="flex items-center gap-0 mb-10">
              {STEPS.map(({ id, label, icon: StepIcon }, i) => {
                const isDone    = stepIndex > i
                const isCurrent = step === id
                return (
                  <div key={id} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={cn(
                        'w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border',
                        isDone    ? 'bg-emerald-500 border-emerald-500 shadow-glow-emerald' :
                        isCurrent ? 'bg-brand-500 border-brand-500 shadow-glow-sm' :
                                    'bg-surface-600 border-white/[0.08]'
                      )}>
                        {isDone
                          ? <Check className="w-4 h-4 text-white" />
                          : <StepIcon className={cn('w-4 h-4', isCurrent ? 'text-white' : 'text-slate-500')} />
                        }
                      </div>
                      <span className={cn(
                        'text-[10px] font-medium hidden sm:block',
                        isCurrent ? 'text-brand-300' : isDone ? 'text-emerald-400' : 'text-slate-600'
                      )}>
                        {label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={cn(
                        'flex-1 h-px mx-2 transition-colors duration-500 mb-5',
                        isDone ? 'bg-emerald-500/50' : 'bg-white/[0.06]'
                      )} />
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Step panels */}
          <AnimatePresence mode="wait">
            {step === 'permissions' && (
              <StepPanel key="permissions" title="Review Permissions" description={`${wf.name} requires the following permissions to operate in your environment.`}>
                <div className="space-y-3 mb-6">
                  {requiredPermissions.map(p => (
                    <label key={p.id} className="flex items-start gap-3 p-4 rounded-xl bg-surface-600/40 border border-white/[0.05] cursor-pointer hover:border-brand-500/20 transition-colors">
                      <div
                        onClick={() => setPermissions(prev => ({ ...prev, [p.id]: !prev[p.id] }))}
                        className={cn(
                          'w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border transition-colors cursor-pointer',
                          permissions[p.id]
                            ? 'bg-brand-500 border-brand-500'
                            : 'bg-surface-500 border-white/[0.15]'
                        )}
                      >
                        {permissions[p.id] && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-200">{p.label}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{p.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <p className="text-xs text-amber-300">All permissions are scoped to read-only unless explicitly granted write access above.</p>
                </div>
                <GlowButton
                  size="lg"
                  iconRight={ArrowRight}
                  onClick={handleNext}
                  disabled={Object.values(permissions).length < 2}
                  className="w-full justify-center"
                >
                  Accept & Continue
                </GlowButton>
              </StepPanel>
            )}

            {step === 'integrations' && (
              <StepPanel key="integrations" title="Connect Integrations" description="Connect the required platforms. You can skip optional integrations and configure them later.">
                <div className="space-y-3 mb-6">
                  {wf.integrations.map((int, i) => {
                    const isConnected = integConnected[int.id]
                    return (
                      <div key={int.id} className="flex items-center gap-3 p-4 rounded-xl bg-surface-600/40 border border-white/[0.05]">
                        <div
                          className="w-9 h-9 rounded-lg font-bold text-white flex items-center justify-center text-xs flex-shrink-0"
                          style={{ backgroundColor: int.color }}
                        >
                          {int.logo}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-200">{int.name}</div>
                          <div className="text-xs text-slate-500">{i === 0 ? 'Required' : 'Optional'}</div>
                        </div>
                        {isConnected ? (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                            Connected
                          </div>
                        ) : (
                          <button
                            onClick={() => setIntegConnected(prev => ({ ...prev, [int.id]: true }))}
                            className="text-xs btn-secondary py-1.5 px-3"
                          >
                            Connect
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
                <div className="flex gap-3">
                  <GlowButton variant="ghost" icon={ArrowLeft} onClick={() => setStep('permissions')}>Back</GlowButton>
                  <GlowButton
                    size="lg"
                    iconRight={ArrowRight}
                    onClick={handleNext}
                    disabled={!integConnected[wf.integrations[0]?.id]}
                    className="flex-1 justify-center"
                  >
                    Continue
                  </GlowButton>
                </div>
              </StepPanel>
            )}

            {step === 'ai_config' && (
              <StepPanel key="ai_config" title="AI Model Configuration" description="Choose the AI model and behaviour settings for this workflow.">
                <div className="space-y-5 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">AI Model</label>
                    <div className="space-y-2">
                      {[
                        { id: 'claude-opus-4-7',     label: 'Claude Opus 4.7',   desc: 'Maximum intelligence — complex root cause analysis', badge: 'Most Capable' },
                        { id: 'claude-sonnet-4-6',   label: 'Claude Sonnet 4.6', desc: 'Balanced performance and speed — recommended for most workflows', badge: 'Recommended' },
                        { id: 'claude-haiku-4-5',    label: 'Claude Haiku 4.5',  desc: 'Fastest responses — best for high-volume routine tasks', badge: 'Fastest' },
                      ].map(model => (
                        <label key={model.id} className={cn(
                          'flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all',
                          aiModel === model.id
                            ? 'bg-brand-500/10 border-brand-500/40'
                            : 'bg-surface-600/40 border-white/[0.05] hover:border-white/[0.12]'
                        )}>
                          <div className={cn(
                            'w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                            aiModel === model.id ? 'border-brand-400' : 'border-slate-600'
                          )}>
                            {aiModel === model.id && <div className="w-2 h-2 rounded-full bg-brand-400" />}
                          </div>
                          <input type="radio" name="aiModel" value={model.id} checked={aiModel === model.id} onChange={e => setAiModel(e.target.value)} className="sr-only" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-slate-200">{model.label}</span>
                              <span className="badge-brand text-[10px]">{model.badge}</span>
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">{model.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Auto-Remediation Level</label>
                    <select className="input-base">
                      <option>Conservative — notify only, no automated actions</option>
                      <option>Moderate — auto-resolve known patterns (recommended)</option>
                      <option>Aggressive — auto-resolve all patterns with confidence &gt;85%</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Environment</label>
                    <select className="input-base">
                      <option>Production</option>
                      <option>Staging</option>
                      <option>Development</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <GlowButton variant="ghost" icon={ArrowLeft} onClick={() => setStep('integrations')}>Back</GlowButton>
                  <GlowButton
                    size="lg"
                    iconRight={Rocket}
                    onClick={handleNext}
                    className="flex-1 justify-center"
                  >
                    Deploy Workflow
                  </GlowButton>
                </div>
              </StepPanel>
            )}

            {step === 'deploying' && (
              <StepPanel key="deploying" title="Deploying..." description="FlowForge is setting up your workflow. This usually takes under 30 seconds.">
                <div className="space-y-2.5 mb-6">
                  {deployLogs.map(({ message, status }, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                        {status === 'pending' && <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />}
                        {status === 'running' && <Loader2 className="w-4 h-4 text-brand-400 animate-spin" />}
                        {status === 'done'    && <Check className="w-4 h-4 text-emerald-400" />}
                        {status === 'error'   && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                      </div>
                      <span className={cn(
                        'transition-colors duration-300',
                        status === 'done'    ? 'text-slate-400' :
                        status === 'running' ? 'text-slate-200' :
                        status === 'pending' ? 'text-slate-600' :
                        'text-rose-400'
                      )}>
                        {message}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {deploying && (
                  <div className="h-1 rounded-full bg-surface-500 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: `${(deployLogs.filter(l => l.status === 'done').length / deployLogs.length) * 100}%` }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                  </div>
                )}
              </StepPanel>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="card-base p-10 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-6 shadow-glow-emerald"
                  >
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  </motion.div>

                  <h2 className="text-2xl font-bold text-slate-100 mb-2">
                    {wf.name} is live!
                  </h2>
                  <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                    Your workflow has been deployed successfully. It will begin processing
                    incoming events within the next 60 seconds.
                  </p>

                  <div className="grid grid-cols-3 gap-3 mb-8">
                    {[
                      { label: 'Status', value: 'Active', color: 'text-emerald-400' },
                      { label: 'Environment', value: 'Production', color: 'text-brand-300' },
                      { label: 'AI Model', value: aiModel.split('-').slice(1, 3).join(' '), color: 'text-cyan-400' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="bg-surface-600/40 rounded-xl p-3 border border-white/[0.04]">
                        <div className={`text-sm font-semibold ${color}`}>{value}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <GlowButton iconRight={ExternalLink} onClick={() => navigate('/dashboard')}>
                      View in Dashboard
                    </GlowButton>
                    <GlowButton variant="secondary" onClick={() => navigate('/marketplace')}>
                      Browse More Workflows
                    </GlowButton>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageLayout>
  )
}

function StepPanel({ title, description, children }: {
  title: string; description: string; children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="card-base p-8"
    >
      <h2 className="text-xl font-bold text-slate-100 mb-1">{title}</h2>
      <p className="text-sm text-slate-400 mb-6">{description}</p>
      {children}
    </motion.div>
  )
}
