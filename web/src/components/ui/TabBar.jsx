import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Search, Wallet, Settings } from 'lucide-react'

const tabs = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/explore', label: 'Explore', icon: Search },
  { path: '/spending', label: 'Spending', icon: Wallet },
  { path: '/settings', label: 'Settings', icon: Settings },
]

export default function TabBar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="flex-shrink-0 bg-surface border-t border-border/50 px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around">
        {tabs.map(({ path, label, icon: Icon }) => {
          const active = location.pathname.startsWith(path)
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`
                flex flex-col items-center gap-0.5 py-2 px-3 min-w-[64px]
                transition-colors duration-150
                ${active ? 'text-accent' : 'text-secondary hover:text-primary'}
              `}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              <span className={`text-[10px] ${active ? 'font-semibold' : 'font-medium'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
