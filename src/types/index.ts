// ============================================================
// Property Types
// ============================================================

export type PropertyStatus = 'available' | 'in_progress' | 'completed' | 'sold';
export type PropertyType = 'apartment' | 'house' | 'villa' | 'commercial' | 'office' | 'land';
export type PropertyCategory = 'sale' | 'rent' | 'renovation';

export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number | null;
  price_currency: string;
  area_m2: number | null;
  location: string | null;
  city: string | null;
  province: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  type: PropertyType;
  category: PropertyCategory;
  status: PropertyStatus;
  featured: boolean;
  main_image_url: string | null;
  images: string[];
  created_at: string;
  updated_at: string;
}

// ============================================================
// Attribute Value Types (RegiaMare model)
// ============================================================

export interface AttributeDefinition {
  id: string;
  name: string;
  slug: string;
  unit: string | null;
  type: 'number' | 'text' | 'boolean' | 'select';
  options: string[] | null;
  created_at: string;
}

export interface AttributeValue {
  id: string;
  property_id: string;
  attribute_id: string;
  value_text: string | null;
  value_number: number | null;
  value_boolean: boolean | null;
  attribute?: AttributeDefinition;
  created_at: string;
}

// ============================================================
// Project / Renovation Types
// ============================================================

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  client_name: string | null;
  location: string | null;
  city: string | null;
  start_date: string | null;
  end_date: string | null;
  area_m2: number | null;
  budget: number | null;
  budget_currency: string;
  status: 'planning' | 'in_progress' | 'completed';
  category: string;
  featured: boolean;
  main_image_url: string | null;
  images: string[];
  created_at: string;
  updated_at: string;
}

// ============================================================
// Service Types
// ============================================================

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  order_index: number;
  active: boolean;
  created_at: string;
}

// ============================================================
// Contact Types
// ============================================================

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  property_id?: string | null;
  created_at?: string;
}

// ============================================================
// Testimonial Types
// ============================================================

export interface Testimonial {
  id: string;
  author_name: string;
  author_role: string | null;
  content: string;
  rating: number;
  avatar_url: string | null;
  featured: boolean;
  created_at: string;
}

// ============================================================
// Pagination
// ============================================================

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PropertyFilters extends PaginationParams {
  type?: PropertyType;
  category?: PropertyCategory;
  status?: PropertyStatus;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  featured?: boolean;
  search?: string;
}
