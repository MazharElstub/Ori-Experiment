import React from 'react'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function PageHeader({ title, subtitle, onBack, rightAction }) {
  const navigate = useNavigate()

  return (
    <div className="flex-shrink-0 bg-surface px-5 pt-4 pb-3 border-b border-border/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack === true ? () => navigate(-1) : onBack}
              className="p-1 -ml-1 text-accent hover:text-accent-dark transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          <div>
            <h1 className="text-xl font-bold text-primary">{title}</h1>
            {subtitle && <p className="text-sm text-secondary mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {rightAction && <div>{rightAction}</div>}
      </div>
    </div>
  )
}
