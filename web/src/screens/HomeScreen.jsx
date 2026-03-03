import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function UpcomingFeature({ icon, title, desc }) {
  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, display: 'flex', gap: 14, alignItems: 'flex-start', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
      <span style={{ fontSize: 28, flexShrink: 0 }}>{icon}</span>
      <div>
        <p style={{ fontSize: 16, fontWeight: 600, color: '#1C1C1E', marginBottom: 4 }}>{title}</p>
        <p style={{ fontSize: 14, color: '#8E8E93', lineHeight: 1.5 }}>{desc}</p>
      </div>
    </div>
  )
}

export default function HomeScreen() {
  const { name, currentUser, logout, deleteAccount } = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const initial = name?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="app-shell" style={{ backgroundColor: '#F2F2F7' }}>

      <div style={{ backgroundColor: '#FFFFFF', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '0.5px solid #C6C6C8', flexShrink: 0 }}>
        <div>
          <p style={{ fontSize: 14, color: '#8E8E93' }}>Good morning,</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: '#1C1C1E' }}>{name} 👋</p>
        </div>
        <button
          onClick={() => { setShowMenu(v => !v); setConfirmDelete(false) }}
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#007AFF', color: '#FFF', fontSize: 17, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {initial}
        </button>
      </div>

      {showMenu && (
        <div style={{ backgroundColor: '#FFFFFF', margin: '8px 20px 0', borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', flexShrink: 0, zIndex: 10 }}>
          <p style={{ fontSize: 13, color: '#8E8E93', padding: '10px 16px' }}>{currentUser?.email}</p>
          <div style={{ height: '0.5px', backgroundColor: '#C6C6C8', marginInline: 16 }} />
          <button onClick={logout} style={{ width: '100%', padding: '12px 16px', textAlign: 'left', fontSize: 17, color: '#1C1C1E' }}>
            Log Out
          </button>
          <div style={{ height: '0.5px', backgroundColor: '#C6C6C8', marginInline: 16 }} />
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)} style={{ width: '100%', padding: '12px 16px', textAlign: 'left', fontSize: 17, color: '#FF3B30' }}>
              Delete Account
            </button>
          ) : (
            <div style={{ padding: '12px 16px' }}>
              <p style={{ fontSize: 14, color: '#8E8E93', marginBottom: 10 }}>This cannot be undone. Are you sure?</p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setConfirmDelete(false)} style={{ flex: 1, padding: '8px 0', borderRadius: 8, backgroundColor: '#F2F2F7', fontSize: 15, color: '#1C1C1E' }}>Cancel</button>
                <button onClick={deleteAccount} style={{ flex: 1, padding: '8px 0', borderRadius: 8, backgroundColor: '#FF3B30', fontSize: 15, color: '#FFF', fontWeight: 600 }}>Delete</button>
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
          <span style={{ fontSize: 48, marginBottom: 12 }}>🚧</span>
          <p style={{ fontSize: 20, fontWeight: 700, color: '#1C1C1E', textAlign: 'center', marginBottom: 8 }}>Your dashboard is coming soon</p>
          <p style={{ fontSize: 15, color: '#8E8E93', textAlign: 'center', lineHeight: 1.6 }}>
            We're building a powerful set of tools to help you understand and control your finances. Here's what's on the way:
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <UpcomingFeature icon="💳" title="Expense Tracking" desc="Log every transaction and tag it by category — groceries, transport, dining, and more." />
          <UpcomingFeature icon="🏦" title="Account Management" desc="Connect your current accounts, savings, and credit cards in one unified view." />
          <UpcomingFeature icon="📊" title="Monthly Reports" desc="Beautiful charts that show your spending patterns and highlight areas to save." />
          <UpcomingFeature icon="🎯" title="Budget Goals" desc="Set monthly spending limits per category and get notified when you're close to the limit." />
          <UpcomingFeature icon="🔔" title="Smart Alerts" desc="Instant notifications for unusual spending, large transactions, and upcoming bills." />
        </div>
      </div>

    </div>
  )
}
