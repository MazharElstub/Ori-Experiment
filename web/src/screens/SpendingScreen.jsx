import React from 'react'
import { Wallet, Plus } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function SpendingScreen() {
  return (
    <div className="flex flex-col flex-1">
      <PageHeader
        title="My Spending"
        subtitle="Track where your money goes"
      />

      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
        {/* Placeholder */}
        <Card className="flex flex-col items-center py-10">
          <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-3">
            <Wallet size={24} className="text-accent" />
          </div>
          <h2 className="text-base font-bold text-primary text-center">No spending added yet</h2>
          <p className="text-sm text-secondary text-center mt-1 leading-relaxed max-w-[280px]">
            Add the companies where you spend each month to get your personalised impact score
          </p>
          <Button size="sm" className="mt-5 w-auto !w-fit px-5" disabled>
            <span className="flex items-center gap-1.5">
              <Plus size={16} /> Add spending
            </span>
          </Button>
        </Card>
      </div>
    </div>
  )
}
