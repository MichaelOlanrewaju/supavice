import { supabase } from '../lib/supabase'

export const fetchPosts = async ({ tag } = {}) => {
  if (!supabase) return []
  let q = supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, cover_image, tags, author, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
  if (tag) q = q.contains('tags', [tag])
  const { data, error } = await q
  if (error) {
    console.error('[blog] fetchPosts failed:', error.message)
    return []
  }
  return data || []
}

export const fetchPost = async (slug) => {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()
  if (error) {
    console.error('[blog] fetchPost failed:', error.message)
    return null
  }
  return data
}
