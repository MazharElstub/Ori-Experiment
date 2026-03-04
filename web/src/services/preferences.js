import { supabase } from '../lib/supabase'

/**
 * Get all lever preferences for the current user
 */
export async function getUserPreferences(userId) {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*, levers(name, slug, icon, colour)')
    .eq('user_id', userId)

  if (error) throw error
  return data
}

/**
 * Set preferences for multiple levers at once
 * preferences: [{ lever_id, importance }]
 */
export async function savePreferences(userId, preferences) {
  const rows = preferences.map(p => ({
    user_id: userId,
    lever_id: p.lever_id,
    importance: p.importance,
  }))

  const { data, error } = await supabase
    .from('user_preferences')
    .upsert(rows, { onConflict: 'user_id,lever_id' })
    .select()

  if (error) throw error
  return data
}

/**
 * Get user profile (onboarding status, display name)
 */
export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId, updates) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}
