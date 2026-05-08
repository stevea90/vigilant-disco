import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  subValue?: string
  icon: LucideIcon
  trend?: { value: string; positive: boolean }
  color?: 'brand' | 'cyan' | 'emerald' | 'amber' | 'rose'
  index?: number
}

const colorMap = {
  brand:   { bg: 'bg-brand-500/10',   icon: 'text-brand-400',   glow: 'shadow-glow-sm' },
  cyan:    { bg: 'bg-cyan-500/10',    icon: 'text-cyan-400',    glow: 'shadow-glow-cyan' },
  emerald: { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', glow: 'shadow-glow-emerald' },
  amber:   { bg: 'bg-amber-500/10',   icon: 'text-amber-400',   glow: '' },
  rose:    { bg: 'bg-rose-500/10',    icon: 'text-rose-400',    glow: '' },
}

export default function StatCard({
  label, value, subValue, icon: Icon, trend, color = 'brand', index = 0
}: StatCardProps) {
  const colors = colorMap[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      className="card-base p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colors.bg)}>
          <Icon className={cn('w-5 h-5', colors.icon)} />
        </div>
        {trend && (
          <span className={cn(
            'text-xs font-medium px-2 py-0.5 rounded-full',
            trend.positive
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-rose-500/10 text-rose-400'
          )}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-100 mb-0.5">{value}</div>
      {subValue && <div className="text-xs text-brand-400 font-medium mb-1">{subValue}</div>}
      <div className="text-xs text-slate-500">{label}</div>
    </motion.div>
  )
}
