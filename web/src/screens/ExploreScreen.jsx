import React from 'react'
import { Search } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'

export default function ExploreScreen() {
  return (
    <div className="flex flex-col flex-1">
      <PageHeader title="Explore" subtitle="Discover company ethics" />

      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
        {/* Search bar */}
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="text"
            placeholder="Search companies..."
            disabled
            className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-primary placeholder:text-secondary/50"
          />
        </div>

        {/* Placeholder */}
        <Card className="flex flex-col items-center py-10">
          <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-3">
            <Search size={24} className="text-accent" />
          </div>
          <h2 className="text-base font-bold text-primary text-center">Company search coming soon</h2>
          <p className="text-sm text-secondary text-center mt-1 leading-relaxed max-w-[260px]">
            Search and explore the ethical profiles of the UK's top 100 companies
          </p>
        </Card>
      </div>
    </div>
  )
}
