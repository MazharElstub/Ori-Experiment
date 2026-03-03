import React from 'react'

function getScoreConfig(score) {
  if (score >= 80) return { label: 'Excellent', bg: 'bg-score-excellent/10', text: 'text-score-excellent', ring: 'ring-score-excellent/20' }
  if (score >= 60) return { label: 'Good', bg: 'bg-score-good/10', text: 'text-score-good', ring: 'ring-score-good/20' }
  if (score >= 40) return { label: 'Mixed', bg: 'bg-score-mixed/10', text: 'text-score-mixed', ring: 'ring-score-mixed/20' }
  if (score >= 20) return { label: 'Poor', bg: 'bg-score-poor/10', text: 'text-score-poor', ring: 'ring-score-poor/20' }
  return { label: 'Bad', bg: 'bg-score-bad/10', text: 'text-score-bad', ring: 'ring-score-bad/20' }
}

export function getScoreColour(score) {
  if (score >= 80) return 'var(--color-score-excellent)'
  if (score >= 60) return 'var(--color-score-good)'
  if (score >= 40) return 'var(--color-score-mixed)'
  if (score >= 20) return 'var(--color-score-poor)'
  return 'var(--color-score-bad)'
}

export default function ScoreBadge({ score, size = 'md', showLabel = false }) {
  const config = getScoreConfig(score)
  const sizeClasses = size === 'sm'
    ? 'text-xs px-2 py-0.5'
    : size === 'lg'
    ? 'text-lg px-4 py-2 font-bold'
    : 'text-sm px-2.5 py-1 font-semibold'

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg ring-1 ${config.bg} ${config.text} ${config.ring} ${sizeClasses}`}>
      {score}
      {showLabel && <span className="text-xs font-normal opacity-80">/ 100</span>}
    </span>
  )
}
