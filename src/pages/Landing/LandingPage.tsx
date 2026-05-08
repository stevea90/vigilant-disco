import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, Zap, ShieldCheck, Clock, BarChart3, Star,
  CheckCircle2, Play, TrendingUp, Users, Building2, Globe,
} from 'lucide-react'
import PageLayout from '@/components/layout/PageLayout'
import WorkflowCard from '@/components/ui/WorkflowCard'
import GlowButton from '@/components/ui/GlowButton'
import { getFeaturedWorkflows } from '@/data/workflows'

const stats = [
  { label: 'Hours saved monthly', value: '240K+', icon: Clock, color: 'text-brand-400' },
  { label: 'Enterprise deployments', value: '1,200+', icon: Building2, color: 'text-cyan-400' },
  { label: 'Workflows available', value: '80+', icon: Zap, color: 'text-purple-400' },
  { label: 'Customer satisfaction', value: '98.4%', icon: Star, color: 'text-amber-400' },
]

const categories = [
  { label: 'ITSM', icon: ShieldCheck, count: 18, color: 'from-brand-600 to-brand-700' },
  { label: 'HR Operations', icon: Users, count: 12, color: 'from-rose-600 to-pink-700' },
  { label: 'Finance', icon: TrendingUp, count: 9, color: 'from-emerald-600 to-teal-700' },
  { label: 'Compliance', icon: CheckCircle2, count: 11, color: 'from-slate-600 to-zinc-700' },
  { label: 'Analytics', icon: BarChart3, count: 8, color: 'from-amber-600 to-orange-700' },
  { label: 'Customer Service', icon: Globe, count: 14, color: 'from-cyan-600 to-blue-700' },
]

const testimonials = [
  {
    quote: "FlowForge reduced our mean time to resolve P1 incidents by 67%. It's like having a senior SRE working 24/7.",
    author: 'Sarah Chen',
    role: 'VP of Platform Engineering',
    company: 'FinServ Corp',
    avatar: 'SC',
  },
  {
    quote: "We onboarded 200 employees last quarter with zero manual provisioning tickets. That simply wasn't possible before.",
    author: 'Marcus Williams',
    role: 'Head of IT Operations',
    company: 'GlobalBank',
    avatar: 'MW',
  },
  {
    quote: "The CAB Copilot alone saved us 4 hours every week in change board meetings. ROI was positive in week one.",
    author: 'Priya Nair',
    role: 'ITSM Platform Lead',
    company: 'Meridian Health',
    avatar: 'PN',
  },
]

const howItWorks = [
  {
    step: '01',
    title: 'Browse & Select',
    description: 'Explore 80+ enterprise-ready AI workflows. Filter by category, integration, or business outcome.',
  },
  {
    step: '02',
    title: 'Configure in Minutes',
    description: 'A guided wizard connects your integrations, sets permissions, and configures the AI model to your environment.',
  },
  {
    step: '03',
    title: 'Deploy & Measure',
    description: 'Go live instantly. Track automations, hours saved, and business outcomes from your real-time dashboard.',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const featured = getFeaturedWorkflows()

  return (
    <PageLayout>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid-dark" />
        <div className="absolute inset-0 bg-hero-gradient" style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.25) 0%, transparent 60%)'
        }} />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-brand-600/10 blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-purple-600/10 blur-3xl animate-float" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 badge-brand py-1.5 px-4 text-xs mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              Now in General Availability — 80+ Enterprise Workflows
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-100 leading-[1.05] mb-6 text-balance"
          >
            Deploy enterprise AI
            <br />
            <span className="gradient-text">workflows in minutes.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            The AI workflow marketplace built for enterprise operations teams.
            Browse, install and manage AI-powered automations that integrate with
            ServiceNow, Jira, Slack and your entire tech stack.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <GlowButton
              size="lg"
              iconRight={ArrowRight}
              onClick={() => navigate('/marketplace')}
            >
              Browse Marketplace
            </GlowButton>
            <GlowButton
              variant="secondary"
              size="lg"
              icon={Play}
              onClick={() => navigate('/dashboard')}
            >
              View Dashboard
            </GlowButton>
          </motion.div>

          {/* Social proof strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-slate-500"
          >
            {['No credit card required', 'SOC 2 Type II certified', 'Deploy in under 15 minutes'].map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                {item}
              </span>
            ))}
          </motion.div>

          {/* HUD preview mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-20 max-w-4xl mx-auto"
          >
            <div className="glass rounded-2xl border border-white/[0.08] p-1 shadow-glass">
              <div className="bg-surface-700/60 rounded-xl overflow-hidden">
                {/* Fake browser chrome */}
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06] bg-surface-800/60">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                  </div>
                  <div className="flex-1 mx-4 h-5 rounded bg-surface-600/60 flex items-center px-3">
                    <span className="text-[10px] text-slate-600">app.flowforge.ai/dashboard</span>
                  </div>
                </div>

                {/* Dashboard preview */}
                <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  {[
                    { label: 'Hours Saved', value: '366', color: 'text-brand-400' },
                    { label: 'Automations', value: '3,893', color: 'text-cyan-400' },
                    { label: 'Active Flows', value: '3', color: 'text-emerald-400' },
                    { label: 'Automation Rate', value: '81%', color: 'text-amber-400' },
                  ].map(({ label, value, color }, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className="bg-surface-600/60 rounded-xl p-3 border border-white/[0.05]"
                    >
                      <div className={`text-xl font-bold ${color}`}>{value}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{label}</div>
                    </motion.div>
                  ))}
                </div>

                <div className="px-4 pb-4 grid grid-cols-3 gap-3">
                  {['AI Incident Manager', 'Exec Briefing Gen', 'Knowledge Writer'].map((name, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1 + i * 0.1 }}
                      className="bg-surface-600/60 rounded-xl p-3 border border-white/[0.05]"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-glow-emerald" />
                        <span className="text-[10px] text-slate-300 font-medium truncate">{name}</span>
                      </div>
                      <div className="h-1 rounded-full bg-surface-400 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${[78, 94, 88][i]}%` }}
                          transition={{ delay: 1.3 + i * 0.15, duration: 0.8, ease: 'easeOut' }}
                          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-purple-500"
                        />
                      </div>
                      <div className="text-[9px] text-slate-600 mt-1">{[78, 94, 88][i]}% automation rate</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────── */}
      <section className="py-16 border-y border-white/[0.06] bg-surface-800/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ label, value, icon: Icon, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="text-center"
              >
                <Icon className={`w-6 h-6 ${color} mx-auto mb-3`} />
                <div className="text-3xl font-bold text-slate-100 mb-1">{value}</div>
                <div className="text-sm text-slate-500">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Workflows ────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="section-label mb-3">Featured Workflows</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4 text-balance">
              Enterprise AI, ready to deploy
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Curated workflows built for complex enterprise environments. Each one
              ships with native integrations, ROI tracking, and full audit trails.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {featured.map((wf, i) => (
              <WorkflowCard key={wf.id} workflow={wf} index={i} variant="featured" />
            ))}
          </div>

          <div className="text-center">
            <GlowButton variant="secondary" size="md" iconRight={ArrowRight} onClick={() => navigate('/marketplace')}>
              View all 80+ workflows
            </GlowButton>
          </div>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────────── */}
      <section className="py-24 bg-surface-800/30 border-y border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="section-label mb-3">Categories</p>
            <h2 className="text-3xl font-bold text-slate-100 mb-4">
              Workflows for every business function
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(({ label, icon: Icon, count, color }, i) => (
              <motion.button
                key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/marketplace?category=${label}`)}
                className="card-interactive p-5 text-center"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-sm font-semibold text-slate-200 mb-1">{label}</div>
                <div className="text-xs text-slate-500">{count} workflows</div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="section-label mb-3">How it works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
              From zero to automated in 15 minutes
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-px bg-gradient-to-r from-brand-500/0 via-brand-500/40 to-brand-500/0" />
            <div className="hidden md:block absolute top-10 left-2/3 right-0 h-px bg-gradient-to-r from-brand-500/40 to-brand-500/0" />

            {howItWorks.map(({ step, title, description }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="relative card-base p-7"
              >
                <div className="text-4xl font-black text-brand-500/20 mb-4 font-mono">{step}</div>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────── */}
      <section className="py-24 bg-surface-800/20 border-y border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="section-label mb-3">Customer Stories</p>
            <h2 className="text-3xl font-bold text-slate-100">
              Trusted by enterprise operations teams
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map(({ quote, author, role, company, avatar }, i) => (
              <motion.div
                key={author}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="card-base p-7"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <blockquote className="text-sm text-slate-300 leading-relaxed mb-5">
                  "{quote}"
                </blockquote>
                <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-200">{author}</div>
                    <div className="text-xs text-slate-500">{role}, {company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-brand-500/20 rounded-3xl blur-2xl" />
              <div className="relative glass rounded-3xl p-12 border border-brand-500/20">
                <p className="section-label mb-4">Get Started Today</p>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4 text-balance">
                  Ready to automate your
                  <span className="gradient-text"> operations?</span>
                </h2>
                <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto">
                  Join 1,200+ enterprise teams saving 240,000+ hours monthly.
                  Deploy your first workflow in under 15 minutes.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <GlowButton size="lg" iconRight={ArrowRight} onClick={() => navigate('/marketplace')}>
                    Browse Marketplace
                  </GlowButton>
                  <GlowButton variant="secondary" size="lg" onClick={() => navigate('/dashboard')}>
                    View Demo Dashboard
                  </GlowButton>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  )
}
