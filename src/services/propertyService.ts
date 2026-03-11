import { supabase } from './supabaseClient';
import type {
  Property,
  PropertyFilters,
  PaginatedResponse,
  ContactMessage,
  Project,
  Service,
  Testimonial,
} from '../types';

const DEFAULT_PAGE_SIZE = 12;

// ============================================================
// Properties
// ============================================================

export async function getProperties(
  filters: PropertyFilters = {},
): Promise<PaginatedResponse<Property>> {
  const { page = 1, pageSize = DEFAULT_PAGE_SIZE, ...rest } = filters;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (rest.type) query = query.eq('type', rest.type);
  if (rest.category) query = query.eq('category', rest.category);
  if (rest.status) query = query.eq('status', rest.status);
  if (rest.city) query = query.ilike('city', `%${rest.city}%`);
  if (rest.featured !== undefined) query = query.eq('featured', rest.featured);
  if (rest.minPrice !== undefined) query = query.gte('price', rest.minPrice);
  if (rest.maxPrice !== undefined) query = query.lte('price', rest.maxPrice);
  if (rest.search) {
    query = query.or(`title.ilike.%${rest.search}%,description.ilike.%${rest.search}%`);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    data: (data as Property[]) ?? [],
    count: count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  };
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data as Property;
}

export async function getFeaturedProperties(limit = 6): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as Property[]) ?? [];
}

// ============================================================
// Projects / Renovations
// ============================================================

export async function getProjects(featured?: boolean): Promise<Project[]> {
  let query = supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (featured !== undefined) query = query.eq('featured', featured);

  const { data, error } = await query;
  if (error) throw error;
  return (data as Project[]) ?? [];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data as Project;
}

// ============================================================
// Services
// ============================================================

export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('active', true)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return (data as Service[]) ?? [];
}

// ============================================================
// Testimonials
// ============================================================

export async function getTestimonials(featured?: boolean): Promise<Testimonial[]> {
  let query = supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });

  if (featured !== undefined) query = query.eq('featured', featured);

  const { data, error } = await query;
  if (error) throw error;
  return (data as Testimonial[]) ?? [];
}

// ============================================================
// Contact
// ============================================================

export async function submitContactMessage(
  message: Omit<ContactMessage, 'id' | 'created_at'>,
): Promise<void> {
  const { error } = await supabase.from('contact_messages').insert([message]);
  if (error) throw error;
}
