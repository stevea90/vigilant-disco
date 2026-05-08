import { motion } from 'framer-motion'
import {
  AlertTriangle, FileText, ShieldAlert, Users, BookOpen,
  UserPlus, Shield, TrendingUp, Star, Clock, Zap, ArrowRight,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Workflow } from '@/types'
import { cn, difficultyColor, tierColor, formatNumber } from '@/lib/utils'

const iconMap: Record<string, React.ElementType> = {
  AlertTriangle, FileText, ShieldAlert, Users, BookOpen,
  UserPlus, Shield, TrendingUp,
}

interface WorkflowCardProps {
  workflow: Workflow
  index?: number
  variant?: 'grid' | 'featured'
}

export default function WorkflowCard({ workflow, index = 0, variant = 'grid' }: WorkflowCardProps) {
  const navigate = useNavigate()
  const Icon = iconMap[workflow.icon] ?? Zap

  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08, duration: 0.4 }}
        whileHover={{ y: -4 }}
        onClick={() => navigate(`/workflow/${workflow.slug}`)}
        className="group card-interactive p-6 cursor-pointer"
      >
        <div className="flex items-start gap-4 mb-5">
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
            'bg-gradient-to-br', workflow.color, 'shadow-glow-sm'
          )}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {workflow.isNew && (
                <span className="badge-brand text-[10px]">NEW</span>
              )}
              <span className={difficultyColor(workflow.difficulty)}>{workflow.difficulty}</span>
              <span className={tierColor(workflow.pricingTier)}>{workflow.pricingTier}</span>
            </div>
            <h3 className="font-semibold text-slate-100 group-hover:text-brand-300 transition-colors line-clamp-1">
              {workflow.name}
            </h3>
          </div>
        </div>

        <p className="text-sm text-slate-400 leading-relaxed mb-5 line-clamp-2">
          {workflow.tagline}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {workflow.timeSavedPerMonth}h/mo
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              {workflow.rating}
            </span>
            <span>{formatNumber(workflow.installCount)} installs</span>
          </div>
          <ArrowRight className="w-4 h-4 text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0 transform duration-200" />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      whileHover={{ y: -3 }}
      onClick={() => navigate(`/workflow/${workflow.slug}`)}
      className="group card-interactive p-5"
    >
      <div className="flex items-start gap-3.5 mb-4">
        <div className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
          'bg-gradient-to-br', workflow.color
        )}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
            {workflow.isNew && <span className="badge-brand text-[10px]">NEW</span>}
            <span className={cn('text-[10px]', difficultyColor(workflow.difficulty))}>{workflow.difficulty}</span>
          </div>
          <h3 className="font-semibold text-slate-100 text-sm group-hover:text-brand-300 transition-colors line-clamp-1">
            {workflow.name}
          </h3>
          <p className="text-xs text-slate-500">{workflow.category}</p>
        </div>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
        {workflow.tagline}
      </p>

      <div className="flex items-center gap-2 flex-wrap mb-3">
        {workflow.integrations.slice(0, 3).map(int => (
          <span
            key={int.id}
            className="px-2 py-0.5 rounded-md bg-surface-500 text-slate-400 text-[10px] font-medium"
          >
            {int.name}
          </span>
        ))}
        {workflow.integrations.length > 3 && (
          <span className="text-[10px] text-slate-500">+{workflow.integrations.length - 3}</span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {workflow.timeSavedPerMonth}h/mo
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            {workflow.rating}
          </span>
        </div>
        <span className={cn('text-xs font-semibold', tierColor(workflow.pricingTier))}>
          {workflow.pricingTier === 'Free' ? 'Free' : `$${workflow.price}/mo`}
        </span>
      </div>
    </motion.div>
  )
}
