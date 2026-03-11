import { useState, useEffect } from 'react';
import {
  getProperties,
  getPropertyBySlug,
  getFeaturedProperties,
  getProjects,
  getProjectBySlug,
  getServices,
  getTestimonials,
} from '../services/propertyService';
import type {
  Property,
  Project,
  Service,
  Testimonial,
  PropertyFilters,
  PaginatedResponse,
} from '../types';

// ============================================================
// Generic async hook
// ============================================================

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useAsync<T>(
  asyncFn: () => Promise<T>,
  deps: unknown[] = [],
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, error: null });

    asyncFn()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          setState({ data: null, loading: false, error: message });
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}

// ============================================================
// Properties
// ============================================================

export function useProperties(filters: PropertyFilters = {}) {
  const key = JSON.stringify(filters);
  return useAsync<PaginatedResponse<Property>>(
    () => getProperties(filters),
    [key],
  );
}

export function useProperty(slug: string) {
  return useAsync<Property | null>(() => getPropertyBySlug(slug), [slug]);
}

export function useFeaturedProperties(limit = 6) {
  return useAsync<Property[]>(() => getFeaturedProperties(limit), [limit]);
}

// ============================================================
// Projects
// ============================================================

export function useProjects(featured?: boolean) {
  return useAsync<Project[]>(() => getProjects(featured), [featured]);
}

export function useProject(slug: string) {
  return useAsync<Project | null>(() => getProjectBySlug(slug), [slug]);
}

// ============================================================
// Services
// ============================================================

export function useServices() {
  return useAsync<Service[]>(() => getServices(), []);
}

// ============================================================
// Testimonials
// ============================================================

export function useTestimonials(featured?: boolean) {
  return useAsync<Testimonial[]>(() => getTestimonials(featured), [featured]);
}
