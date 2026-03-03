import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, ShieldCheck, TrendingUp, Leaf } from 'lucide-react'
import Button from '../components/ui/Button'

function FeatureRow({ icon: Icon, title, desc }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-base font-semibold text-primary">{title}</p>
        <p className="text-sm text-secondary leading-relaxed mt-0.5">{desc}</p>
      </div>
    </div>
  )
}

export default function LandingScreen() {
  const navigate = useNavigate()

  return (
    <div className="app-shell bg-surface">
      <div className="flex flex-col flex-1 overflow-y-auto">

        <div className="flex flex-col items-center pt-16 pb-8 px-6">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
            <Eye size={32} className="text-accent" />
          </div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">ORI</h1>
          <p className="text-base text-secondary mt-2 text-center leading-relaxed">
            Know where your money goes &mdash;<br />and what it supports
          </p>
        </div>

        <div className="flex-1 px-6 flex flex-col gap-6">
          <FeatureRow
            icon={Eye}
            title="See the full picture"
            desc="Uncover what companies really stand for — from political ties to environmental impact"
          />
          <FeatureRow
            icon={ShieldCheck}
            title="Align with your values"
            desc="Set your priorities and find companies that match what matters to you"
          />
          <FeatureRow
            icon={TrendingUp}
            title="Track your impact"
            desc="Add your spending and get a personalised ethical impact score"
          />
          <FeatureRow
            icon={Leaf}
            title="Make better choices"
            desc="Get suggestions for alternatives that better align with your values"
          />
        </div>

        <div className="p-6 flex flex-col gap-3">
          <Button onClick={() => navigate('/signup')}>
            Get Started
          </Button>
          <Button variant="ghost" onClick={() => navigate('/login')}>
            I already have an account
          </Button>
        </div>

      </div>
    </div>
  )
}
