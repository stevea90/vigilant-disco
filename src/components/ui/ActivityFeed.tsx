import { motion } from 'framer-motion'
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react'
import type { ActivityItem } from '@/types'
import { timeAgo, cn } from '@/lib/utils'

const statusConfig = {
  success: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  warning: { icon: AlertTriangle, color: 'text-amber-400',  bg: 'bg-amber-500/10' },
  error:   { icon: XCircle,      color: 'text-rose-400',    bg: 'bg-rose-500/10' },
  info:    { icon: Info,         color: 'text-brand-400',   bg: 'bg-brand-500/10' },
}

interface ActivityFeedProps {
  items: ActivityItem[]
  limit?: number
}

export default function ActivityFeed({ items, limit = 10 }: ActivityFeedProps) {
  const displayed = items.slice(0, limit)

  return (
    <div className="space-y-1">
      {displayed.map((item, i) => {
        const { icon: Icon, color, bg } = statusConfig[item.status]
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-white/[0.03] transition-colors group"
          >
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5', bg)}>
              <Icon className={cn('w-4 h-4', color)} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs font-semibold text-slate-300 truncate">{item.workflowName}</span>
                <span className="text-[10px] text-slate-600 flex-shrink-0">{timeAgo(item.timestamp)}</span>
              </div>
              <p className="text-xs font-medium text-slate-400 mt-0.5">{item.action}</p>
              <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">{item.outcome}</p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
