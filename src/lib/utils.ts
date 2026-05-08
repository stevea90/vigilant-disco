import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toString()
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

export function difficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'Easy': return 'badge-emerald'
    case 'Medium': return 'badge-amber'
    case 'Advanced': return 'badge-rose'
    default: return 'badge-slate'
  }
}

export function tierColor(tier: string): string {
  switch (tier) {
    case 'Free': return 'badge-emerald'
    case 'Pro': return 'badge-brand'
    case 'Enterprise': return 'badge-cyan'
    default: return 'badge-slate'
  }
}

export function statusColor(status: string): string {
  switch (status) {
    case 'active': return 'text-emerald-400'
    case 'inactive': return 'text-slate-400'
    case 'error': return 'text-rose-400'
    case 'configuring': return 'text-amber-400'
    default: return 'text-slate-400'
  }
}
