import { supabase } from '../lib/supabase'

/**
 * Get all levers, ordered by display_order
 */
export async function getLevers() {
  const { data, error } = await supabase
    .from('levers')
    .select('*')
    .order('display_order')

  if (error) throw error
  return data
}

/**
 * Get a single lever with its scoring factors
 */
export async function getLeverBySlug(slug) {
  const { data, error } = await supabase
    .from('levers')
    .select('*, scoring_factors(*)')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data
}

/**
 * Get factor scores for a company on a specific lever
 */
export async function getCompanyFactorScores(companyId, leverId) {
  const { data, error } = await supabase
    .from('company_factor_scores')
    .select('*, scoring_factors(name, description)')
    .eq('company_id', companyId)
    .in('factor_id',
      supabase
        .from('scoring_factors')
        .select('id')
        .eq('lever_id', leverId)
    )

  if (error) throw error
  return data
}
