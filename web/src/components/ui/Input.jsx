import React from 'react'

export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-primary">{label}</label>
      )}
      <input
        className={`
          w-full bg-background rounded-lg px-4 py-3.5 text-base text-primary
          border border-transparent
          placeholder:text-secondary/50
          focus:border-accent focus:ring-1 focus:ring-accent/20
          transition-colors duration-150
          ${error ? 'border-danger' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-xs text-danger mt-0.5">{error}</p>
      )}
    </div>
  )
}
