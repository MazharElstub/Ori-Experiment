import React from 'react'

const variants = {
  primary: 'bg-accent text-white font-semibold hover:bg-accent-dark active:bg-accent-dark',
  secondary: 'bg-background text-primary font-medium hover:bg-border',
  ghost: 'text-secondary hover:text-primary hover:bg-background',
  danger: 'bg-danger text-white font-semibold hover:bg-red-600',
}

const sizes = {
  sm: 'px-3 py-2 text-sm rounded-lg',
  md: 'px-4 py-3.5 text-base rounded-xl',
  lg: 'px-5 py-4 text-lg rounded-xl',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        w-full transition-colors duration-150
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  )
}
