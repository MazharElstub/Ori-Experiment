/**
 * Calculate the user's score for each lever based on their spending.
 *
 * For each lever, the score is the spending-weighted average of company scores:
 *   lever_score = Σ(proportion_i × company_score_i) / Σ(proportion_i)
 *
 * @param {Array} spending - [{ company_id, monthly_amount }]
 * @param {Object} companyScores - { company_id: { lever_id: score } }
 * @param {Array} levers - [{ id, name, slug, ... }]
 * @returns {Object} { lever_id: score }
 */
export function calculateLeverScores(spending, companyScores, levers) {
  const totalSpend = spending.reduce((sum, s) => sum + s.monthly_amount, 0)
  if (totalSpend === 0) return {}

  const leverScores = {}

  for (const lever of levers) {
    let weightedSum = 0
    let weightTotal = 0

    for (const entry of spending) {
      const scores = companyScores[entry.company_id]
      if (!scores || scores[lever.id] == null) continue

      const proportion = entry.monthly_amount / totalSpend
      weightedSum += proportion * scores[lever.id]
      weightTotal += proportion
    }

    leverScores[lever.id] = weightTotal > 0
      ? Math.round(weightedSum / weightTotal)
      : null
  }

  return leverScores
}

/**
 * Calculate the user's overall score, weighted by their lever preferences.
 *
 * overall = Σ(lever_score × importance) / Σ(importance)
 *
 * @param {Object} leverScores - { lever_id: score }
 * @param {Array} preferences - [{ lever_id, importance }]
 * @returns {number|null}
 */
export function calculateOverallScore(leverScores, preferences) {
  let weightedSum = 0
  let weightTotal = 0

  for (const pref of preferences) {
    const score = leverScores[pref.lever_id]
    if (score == null) continue

    weightedSum += score * pref.importance
    weightTotal += pref.importance
  }

  return weightTotal > 0 ? Math.round(weightedSum / weightTotal) : null
}

/**
 * Get the score interpretation label
 */
export function getScoreLabel(score) {
  if (score == null) return 'No data'
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Mixed'
  if (score >= 20) return 'Poor'
  return 'Concerning'
}
