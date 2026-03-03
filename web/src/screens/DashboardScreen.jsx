import React from 'react'
import { useAuth } from '../context/AuthContext'
import { TrendingUp, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function DashboardScreen() {
  const { name } = useAuth()
  const navigate = useNavigate()

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="flex-shrink-0 bg-surface px-5 pt-5 pb-4 border-b border-border/50">
        <p className="text-sm text-secondary">{greeting},</p>
        <h1 className="text-2xl font-bold text-primary">{name}</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
        {/* Score placeholder */}
        <Card className="flex flex-col items-center py-8">
          <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mb-4">
            <TrendingUp size={36} className="text-accent" />
          </div>
          <h2 className="text-lg font-bold text-primary text-center">Your impact score</h2>
          <p className="text-sm text-secondary text-center mt-1 leading-relaxed max-w-[260px]">
            Add your spending to see how well your money aligns with your values
          </p>
          <Button
            size="sm"
            className="mt-5 w-auto !w-fit px-5"
            onClick={() => navigate('/spending')}
          >
            <span className="flex items-center gap-1.5">
              Add spending <ArrowRight size={16} />
            </span>
          </Button>
        </Card>

        {/* Quick info cards */}
        <Card>
          <h3 className="text-sm font-semibold text-primary mb-1">How it works</h3>
          <p className="text-sm text-secondary leading-relaxed">
            ORI scores companies across ethical dimensions like environmental impact, political ties, and fair employment. Set your priorities, add your spending, and get a personalised impact score.
          </p>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-primary mb-1">Get started</h3>
          <ul className="text-sm text-secondary space-y-2 mt-2">
            <li className="flex gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center">1</span>
              <span>Set your ethical priorities in Settings</span>
            </li>
            <li className="flex gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center">2</span>
              <span>Explore companies and their ethical profiles</span>
            </li>
            <li className="flex gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center">3</span>
              <span>Add your monthly spending to get your score</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
