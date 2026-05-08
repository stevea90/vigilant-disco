import { Link } from 'react-router-dom'
import { Zap, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-surface-800/60">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-slate-200 text-sm">FlowForge <span className="text-brand-400">AI</span></span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
              Enterprise AI workflow marketplace. Deploy in minutes.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2">
              {['Marketplace', 'Dashboard', 'Workflows', 'Integrations'].map(item => (
                <li key={item}>
                  <Link to="/marketplace" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Solutions</h4>
            <ul className="space-y-2">
              {['ITSM', 'HR Operations', 'Financial Close', 'Compliance', 'Security Ops'].map(item => (
                <li key={item}>
                  <a href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Company</h4>
            <ul className="space-y-2">
              {['About', 'Blog', 'Careers', 'Security', 'Privacy', 'Terms'].map(item => (
                <li key={item}>
                  <a href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/[0.05]">
          <p className="text-xs text-slate-600">
            © 2026 FlowForge AI. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {['GitHub', 'Twitter', 'LinkedIn'].map((label, i) => (
              <a key={i} href="#" className="w-7 h-7 rounded-lg bg-surface-600 border border-white/[0.06] flex items-center justify-center text-slate-500 hover:text-slate-300 hover:border-white/[0.12] transition-all" title={label}>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
