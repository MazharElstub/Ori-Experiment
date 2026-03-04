import React from 'react'

export default function Card({ children, className = '', onClick, ...props }) {
  return (
    <div
      className={`
        bg-surface rounded-xl p-4 shadow-sm border border-border/50
        ${onClick ? 'cursor-pointer hover:shadow-md active:scale-[0.99] transition-all duration-150' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}
