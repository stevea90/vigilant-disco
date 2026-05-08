import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import PageLayout from '@/components/layout/PageLayout'
import WorkflowCard from '@/components/ui/WorkflowCard'
import SearchBar from '@/components/ui/SearchBar'
import { workflows } from '@/data/workflows'
import type { WorkflowCategory, Difficulty, PricingTier } from '@/types'

const categories: WorkflowCategory[] = ['ITSM', 'HR', 'Finance', 'Security', 'Operations', 'Analytics', 'Compliance', 'Customer Service']
const difficulties: Difficulty[] = ['Easy', 'Medium', 'Advanced']
const tiers: PricingTier[] = ['Free', 'Pro', 'Enterprise']

type SortKey = 'popular' | 'rating' | 'newest' | 'time_saved'

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'popular',    label: 'Most Popular' },
  { value: 'rating',     label: 'Highest Rated' },
  { value: 'newest',     label: 'Newest' },
  { value: 'time_saved', label: 'Most Time Saved' },
]

export default function MarketplacePage() {
  const [searchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') as WorkflowCategory | null

  const [query, setQuery]             = useState('')
  const [selectedCats, setSelectedCats] = useState<WorkflowCategory[]>(initialCategory ? [initialCategory] : [])
  const [selectedDiffs, setSelectedDiffs] = useState<Difficulty[]>([])
  const [selectedTiers, setSelectedTiers] = useState<PricingTier[]>([])
  const [sortBy, setSortBy]           = useState<SortKey>('popular')
  const [showFilters, setShowFilters] = useState(false)

  const toggle = <T extends string>(arr: T[], setArr: (v: T[]) => void, val: T) =>
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val])

  const filtered = useMemo(() => {
    let list = [...workflows]

    if (query) {
      const q = query.toLowerCase()
      list = list.filter(w =>
        w.name.toLowerCase().includes(q) ||
        w.tagline.toLowerCase().includes(q) ||
        w.tags.some(t => t.toLowerCase().includes(q)) ||
        w.category.toLowerCase().includes(q)
      )
    }

    if (selectedCats.length)  list = list.filter(w => selectedCats.includes(w.category as WorkflowCategory))
    if (selectedDiffs.length) list = list.filter(w => selectedDiffs.includes(w.difficulty))
    if (selectedTiers.length) list = list.filter(w => selectedTiers.includes(w.pricingTier))

    switch (sortBy) {
      case 'popular':    list.sort((a, b) => b.installCount - a.installCount); break
      case 'rating':     list.sort((a, b) => b.rating - a.rating); break
      case 'newest':     list.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()); break
      case 'time_saved': list.sort((a, b) => b.timeSavedPerMonth - a.timeSavedPerMonth); break
    }

    return list
  }, [query, selectedCats, selectedDiffs, selectedTiers, sortBy])

  const activeFilterCount = selectedCats.length + selectedDiffs.length + selectedTiers.length

  const clearAll = () => {
    setSelectedCats([])
    setSelectedDiffs([])
    setSelectedTiers([])
    setQuery('')
  }

  return (
    <PageLayout>
      <div className="pt-24 pb-16 min-h-screen">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="section-label mb-2">Marketplace</p>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-3">
              AI Workflow Marketplace
            </h1>
            <p className="text-slate-400 max-w-xl">
              {workflows.length} enterprise-ready workflows. Deploy in minutes, measure in real-time.
            </p>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-8">
          {/* ── Sidebar filters ──────────────────────────────── */}
          <aside className="lg:w-56 flex-shrink-0">
            {/* Mobile toggle */}
            <button
              onClick={() => setShowFilters(v => !v)}
              className="lg:hidden flex items-center gap-2 btn-secondary w-full mb-4"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-auto badge-brand">{activeFilterCount}</span>
              )}
            </button>

            <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              {/* Category */}
              <FilterSection title="Category">
                {categories.map(cat => (
                  <FilterChip
                    key={cat}
                    label={cat}
                    active={selectedCats.includes(cat)}
                    onClick={() => toggle(selectedCats, setSelectedCats, cat)}
                  />
                ))}
              </FilterSection>

              {/* Difficulty */}
              <FilterSection title="Difficulty">
                {difficulties.map(d => (
                  <FilterChip
                    key={d}
                    label={d}
                    active={selectedDiffs.includes(d)}
                    onClick={() => toggle(selectedDiffs, setSelectedDiffs, d)}
                  />
                ))}
              </FilterSection>

              {/* Pricing */}
              <FilterSection title="Pricing">
                {tiers.map(t => (
                  <FilterChip
                    key={t}
                    label={t}
                    active={selectedTiers.includes(t)}
                    onClick={() => toggle(selectedTiers, setSelectedTiers, t)}
                  />
                ))}
              </FilterSection>

              {activeFilterCount > 0 && (
                <button onClick={clearAll} className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors">
                  <X className="w-3.5 h-3.5" />
                  Clear all filters
                </button>
              )}
            </div>
          </aside>

          {/* ── Main grid ─────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Search + sort bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <SearchBar value={query} onChange={setQuery} className="flex-1" />
              <div className="relative flex-shrink-0">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as SortKey)}
                  className="input-base pr-8 appearance-none cursor-pointer"
                >
                  {sortOptions.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {[...selectedCats, ...selectedDiffs, ...selectedTiers].map(tag => (
                  <span
                    key={tag}
                    className="badge-brand flex items-center gap-1 cursor-pointer hover:bg-brand-500/25 transition-colors"
                    onClick={() => {
                      if (categories.includes(tag as WorkflowCategory)) toggle(selectedCats, setSelectedCats, tag as WorkflowCategory)
                      if (difficulties.includes(tag as Difficulty)) toggle(selectedDiffs, setSelectedDiffs, tag as Difficulty)
                      if (tiers.includes(tag as PricingTier)) toggle(selectedTiers, setSelectedTiers, tag as PricingTier)
                    }}
                  >
                    {tag} <X className="w-3 h-3" />
                  </span>
                ))}
              </div>
            )}

            {/* Result count */}
            <p className="text-xs text-slate-500 mb-5">
              {filtered.length} {filtered.length === 1 ? 'workflow' : 'workflows'}
              {query && ` matching "${query}"`}
            </p>

            {/* Grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-slate-400 mb-2">No workflows found</p>
                <button onClick={clearAll} className="text-sm text-brand-400 hover:text-brand-300 transition-colors">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((wf, i) => (
                  <WorkflowCard key={wf.id} workflow={wf} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">{title}</h3>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border ${
        active
          ? 'bg-brand-500/15 text-brand-300 border-brand-500/40'
          : 'bg-surface-600/50 text-slate-400 border-white/[0.06] hover:border-white/[0.12] hover:text-slate-300'
      }`}
    >
      {label}
    </button>
  )
}
