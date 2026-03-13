import { supabase } from './supabase';
import { MOCK_PROJECTS } from '../data/mockProjects';

const COMPANY_ID = 'b58a5ab9-dd4a-4bbe-8289-2cf3a134e49a';
const ITEM_TYPE = 'proyecto-reforma-navagli';

/**
 * Fetches all published projects.
 * Falls back to mock data when Supabase is not configured.
 */
export async function getProjects() {
  if (!supabase) {
    return MOCK_PROJECTS;
  }

  const { data: items, error } = await supabase
    .from('items')
    .select('*')
    .eq('company_id', COMPANY_ID)
    .eq('item_type', ITEM_TYPE)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return MOCK_PROJECTS;
  }

  // For each item, fetch its attribute values and media
  const projectsWithDetails = await Promise.all(
    items.map(async (item) => {
      const [{ data: attrValues }, { data: media }] = await Promise.all([
        supabase
          .from('attribute_values')
          .select('*, attribute_definitions(key, data_type)')
          .eq('item_id', item.id),
        supabase
          .from('item_media')
          .select('*')
          .eq('item_id', item.id)
          .order('sort_order', { ascending: true }),
      ]);

      const attributes = {};
      attrValues?.forEach((av) => {
        const key = av.attribute_definitions?.key;
        const dataType = av.attribute_definitions?.data_type;
        if (key) {
          if (dataType === 'text_array') {
            attributes[key] = av.value_text_array || [];
          } else if (dataType === 'longtext') {
            attributes[key] = av.value_text;
          } else {
            attributes[key] = av.value_text ?? av.value_number ?? av.value_boolean ?? av.value_json;
          }
        }
      });

      const coverMedia = media?.find((m) => m.is_cover);
      const images = media?.map((m) => m.url_externa) || [];

      return {
        ...item,
        location: item.summary,
        cover_image: coverMedia?.url_externa || images[0] || '/img/landing-image1.jpg',
        images,
        attributes,
      };
    })
  );

  return projectsWithDetails;
}

/**
 * Fetches a single project by ID.
 * Falls back to mock data when Supabase is not configured.
 */
export async function getProjectById(id) {
  if (!supabase) {
    return MOCK_PROJECTS.find((p) => p.id === id) || null;
  }

  const { data: item, error } = await supabase
    .from('items')
    .select('*')
    .eq('id', id)
    .eq('company_id', COMPANY_ID)
    .single();

  if (error || !item) {
    return MOCK_PROJECTS.find((p) => p.id === id) || null;
  }

  const [{ data: attrValues }, { data: media }] = await Promise.all([
    supabase
      .from('attribute_values')
      .select('*, attribute_definitions(key, data_type)')
      .eq('item_id', item.id),
    supabase
      .from('item_media')
      .select('*')
      .eq('item_id', item.id)
      .order('sort_order', { ascending: true }),
  ]);

  const attributes = {};
  attrValues?.forEach((av) => {
    const key = av.attribute_definitions?.key;
    const dataType = av.attribute_definitions?.data_type;
    if (key) {
      if (dataType === 'text_array') {
        attributes[key] = av.value_text_array || [];
      } else if (dataType === 'longtext') {
        attributes[key] = av.value_text;
      } else {
        attributes[key] = av.value_text ?? av.value_number ?? av.value_boolean ?? av.value_json;
      }
    }
  });

  const coverMedia = media?.find((m) => m.is_cover);
  const images = media?.map((m) => m.url_externa) || [];

  return {
    ...item,
    location: item.summary,
    cover_image: coverMedia?.url_externa || images[0] || '/img/landing-image1.jpg',
    images,
    attributes,
  };
}
