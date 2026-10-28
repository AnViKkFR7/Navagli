import { supabase } from './supabase';
import { listProjects, findProject } from '../lib/projects';
import { PROJECT_REDIRECTS } from '../data/projectRedirects';

export const PROJECT_SEO_ENABLED = import.meta.env.VITE_ITEMS_SEO_ENABLED === 'true';
// No mock fallback: configuration and database errors are explicit load failures.
export const getProjects = (page = 1, pageSize) => listProjects(supabase, { page, pageSize, seoEnabled: PROJECT_SEO_ENABLED });
export const getProject = (identifier) => findProject(supabase, identifier, { seoEnabled: PROJECT_SEO_ENABLED, redirects: PROJECT_REDIRECTS });
