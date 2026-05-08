import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Menu, X, LayoutDashboard, Store, ChevronDown, Bell, Search } from 'lucide-react'

const navLinks = [
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/dashboard', label: 'Dashboard' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => setMobileOpen(false), [location.pathname])

  const isActive = (href: string) => location.pathname.startsWith(href)

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-surface-800/90 backdrop-blur-xl border-b border-white/[0.06] shadow-glass'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-md transition-shadow">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-100 tracking-tight">
              FlowForge
              <span className="text-brand-400"> AI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? 'text-brand-300 bg-brand-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right controls */}
          <div className="hidden md:flex items-center gap-3">
            <button className="btn-ghost text-slate-500 hover:text-slate-300">
              <Bell className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                JD
              </div>
              <span className="text-sm text-slate-400 font-medium">John Doe</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </div>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="md:hidden p-2 text-slate-400 hover:text-slate-200"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 md:hidden glass border-b border-white/[0.06] px-6 py-4"
          >
            <nav className="flex flex-col gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'text-brand-300 bg-brand-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
