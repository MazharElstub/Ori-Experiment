import React from 'react'
import { getScoreColour } from './ScoreBadge'

export default function ScoreBar({ score, label, colour, className = '' }) {
  const barColour = colour || getScoreColour(score)

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-primary">{label}</span>
          <span className="text-sm font-semibold" style={{ color: barColour }}>{score}</span>
        </div>
      )}
      <div className="h-2 bg-background rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${score}%`, backgroundColor: barColour }}
        />
      </div>
    </div>
  )
}
