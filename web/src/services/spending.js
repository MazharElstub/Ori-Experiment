import { supabase } from '../lib/supabase'

/**
 * Get all spending entries for the current user
 */
export async function getUserSpending(userId) {
  const { data, error } = await supabase
    .from('user_spending')
    .select('*, companies(name, slug, sector_id, sectors(name))')
    .eq('user_id', userId)
    .order('monthly_amount', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Add or update a spending entry
 */
export async function upsertSpending(userId, companyId, monthlyAmount, source = 'manual') {
  const { data, error } = await supabase
    .from('user_spending')
    .upsert(
      {
        user_id: userId,
        company_id: companyId,
        monthly_amount: monthlyAmount,
        source,
      },
      { onConflict: 'user_id,company_id,source' }
    )
    .select()

  if (error) throw error
  return data
}

/**
 * Delete a spending entry
 */
export async function deleteSpending(id) {
  const { error } = await supabase
    .from('user_spending')
    .delete()
    .eq('id', id)

  if (error) throw error
}
