import { blogConfig } from '../api/_lib/blog.js';
import { validSlug } from '../src/lib/blog.js';

try {
  const { client, companyId } = blogConfig();
  const seen = new Set();
  const problems = [];
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await client.from('blog_posts').select('id,slug')
      .eq('company_id', companyId).eq('status', 'published').order('id').range(offset, offset + 499);
    if (error) throw error;
    for (const post of data || []) {
      const normalized = post.slug?.toLowerCase();
      if (!validSlug(post.slug) || seen.has(normalized)) problems.push(post.id);
      seen.add(normalized);
    }
    if (!data || data.length < 500) break;
  }
  if (problems.length) throw new Error(`Posts publicados sin slug válido o con slug duplicado: ${problems.join(', ')}`);
  console.log('Blog preflight correcto: slugs publicados válidos y únicos para esta empresa.');
} catch (error) {
  console.error('Blog preflight fallido:', error.message);
  process.exitCode = 1;
}
