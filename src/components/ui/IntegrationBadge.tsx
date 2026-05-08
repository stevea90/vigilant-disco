import { cn } from '@/lib/utils'
import type { Integration } from '@/types'

interface IntegrationBadgeProps {
  integration: Integration
  size?: 'sm' | 'md'
}

export default function IntegrationBadge({ integration, size = 'md' }: IntegrationBadgeProps) {
  return (
    <div className={cn(
      'flex items-center gap-2 rounded-lg bg-surface-600/80 border border-white/[0.06]',
      size === 'sm' ? 'px-2.5 py-1.5' : 'px-3 py-2'
    )}>
      <div
        className={cn(
          'rounded font-bold text-white flex items-center justify-center flex-shrink-0',
          size === 'sm' ? 'w-5 h-5 text-[9px]' : 'w-7 h-7 text-xs'
        )}
        style={{ backgroundColor: integration.color }}
      >
        {integration.logo}
      </div>
      <span className={cn('text-slate-300 font-medium', size === 'sm' ? 'text-xs' : 'text-sm')}>
        {integration.name}
      </span>
    </div>
  )
}
