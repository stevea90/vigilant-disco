import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GlowButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: LucideIcon
  iconRight?: LucideIcon
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit'
}

export default function GlowButton({
  children, onClick, variant = 'primary', size = 'md',
  icon: IconLeft, iconRight: IconRight, disabled, className, type = 'button'
}: GlowButtonProps) {
  const sizes = {
    sm: 'px-4 py-2 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5',
  }

  const variants = {
    primary: 'bg-brand-500 hover:bg-brand-600 text-white shadow-glow-sm hover:shadow-glow-md',
    secondary: 'bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.08] hover:border-white/[0.15] text-slate-200',
    ghost: 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]',
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        'inline-flex items-center rounded-xl font-semibold transition-all duration-200',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
        sizes[size], variants[variant], className
      )}
    >
      {IconLeft && <IconLeft className="w-4 h-4 flex-shrink-0" />}
      {children}
      {IconRight && <IconRight className="w-4 h-4 flex-shrink-0" />}
    </motion.button>
  )
}
