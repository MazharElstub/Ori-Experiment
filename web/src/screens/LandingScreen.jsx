import React from 'react'
import { useNavigate } from 'react-router-dom'

function FeatureRow({ icon, title, desc }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <span style={{ fontSize: 28, width: 36, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
      <div>
        <p style={{ fontSize: 17, fontWeight: 600, color: '#1C1C1E', marginBottom: 2 }}>{title}</p>
        <p style={{ fontSize: 14, color: '#8E8E93', lineHeight: 1.5 }}>{desc}</p>
      </div>
    </div>
  )
}

export default function LandingScreen() {
  const navigate = useNavigate()

  return (
    <div className="app-shell" style={{ backgroundColor: '#FFFFFF' }}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 60, paddingBottom: 32, paddingInline: 24 }}>
          <span style={{ fontSize: 64, marginBottom: 12 }}>💰</span>
          <h1 style={{ fontSize: 34, fontWeight: 700, color: '#1C1C1E', letterSpacing: 0.4 }}>ORI</h1>
          <p style={{ fontSize: 17, color: '#8E8E93', marginTop: 6 }}>Take control of your finances</p>
        </div>

        <div style={{ flex: 1, paddingInline: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <FeatureRow icon="📊" title="Track Spending" desc="See exactly where your money goes each month" />
          <FeatureRow icon="🏦" title="Manage Accounts" desc="Link and manage all your bank accounts in one place" />
          <FeatureRow icon="🎯" title="Set Budgets" desc="Create budgets and get alerts before you overspend" />
          <FeatureRow icon="📈" title="Insights" desc="Visual reports to understand your financial habits" />
        </div>

        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={() => navigate('/signup')}
            style={{ backgroundColor: '#007AFF', borderRadius: 14, paddingBlock: 16, color: '#FFF', fontSize: 17, fontWeight: 600 }}
          >
            Get Started
          </button>
          <button
            onClick={() => navigate('/login')}
            style={{ paddingBlock: 16, color: '#007AFF', fontSize: 17, fontWeight: 400 }}
          >
            I already have an account
          </button>
        </div>

      </div>
    </div>
  )
}
