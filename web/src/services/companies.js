import { supabase } from '../lib/supabase'

/**
 * Search companies by name (partial match)
 */
export async function searchCompanies(query, { sectorId } = {}) {
  let q = supabase
    .from('companies')
    .select('*, sectors(name, slug)')
    .ilike('name', `%${query}%`)
    .order('name')
    .limit(20)

  if (sectorId) {
    q = q.eq('sector_id', sectorId)
  }

  const { data, error } = await q
  if (error) throw error
  return data
}

/**
 * Get a single company by slug, with lever scores
 */
export async function getCompanyBySlug(slug) {
  const { data, error } = await supabase
    .from('companies')
    .select(`
      *,
      sectors(name, slug),
      company_lever_scores(
        score,
        summary,
        levers(id, name, slug, icon, colour)
      )
    `)
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data
}

/**
 * Get companies in a sector, ordered by average lever score (best first)
 */
export async function getCompaniesBySector(sectorId) {
  const { data, error } = await supabase
    .from('companies')
    .select('*, company_lever_scores(score)')
    .eq('sector_id', sectorId)
    .order('name')

  if (error) throw error
  return data
}

/**
 * Get better alternatives in the same sector for a given company
 */
export async function getAlternatives(companyId, sectorId, userPreferences = []) {
  const { data, error } = await supabase
    .from('companies')
    .select('*, company_lever_scores(score, lever_id)')
    .eq('sector_id', sectorId)
    .neq('id', companyId)
    .order('name')

  if (error) throw error
  return data
}

/**
 * Get all sectors
 */
export async function getSectors() {
  const { data, error } = await supabase
    .from('sectors')
    .select('*')
    .order('name')

  if (error) throw error
  return data
}
