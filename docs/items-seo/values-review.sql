-- REVIEW TEMPLATE ONLY: no real IDs/SEO proposals have been supplied.
-- Based on the upstream ITEMS_SEO_VALUES_TEMPLATE.sql copied alongside this draft.
-- Adds fixed Navagli scope, before-image, row locking and optimistic concurrency checks.
BEGIN;
CREATE TEMP TABLE navagli_seo_values (
  id uuid PRIMARY KEY,
  company_id uuid NOT NULL,
  item_type text NOT NULL,
  slug text NOT NULL,
  seo_title text NOT NULL,
  seo_description text NOT NULL,
  seo_og_image_url text,
  expected_updated_at timestamptz NOT NULL
) ON COMMIT DROP;

-- Insert ONLY approved rows from the authorised export here, including its original updated_at.
-- No example project or invented metadata is executable in this template.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM navagli_seo_values) THEN RAISE EXCEPTION 'No approved SEO rows'; END IF;
  IF EXISTS (SELECT 1 FROM navagli_seo_values WHERE
      company_id <> 'b58a5ab9-dd4a-4bbe-8289-2cf3a134e49a'::uuid
      OR item_type <> 'proyecto-reforma-navagli'
      OR length(slug) > 120 OR slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
      OR length(seo_title) NOT BETWEEN 1 AND 70 OR length(seo_description) NOT BETWEEN 1 AND 160
      OR (seo_og_image_url IS NOT NULL AND (length(seo_og_image_url) > 2048 OR seo_og_image_url !~ '^https://')))
    THEN RAISE EXCEPTION 'Invalid scope or SEO values'; END IF;
  IF EXISTS (SELECT lower(slug) FROM navagli_seo_values GROUP BY lower(slug) HAVING count(*) > 1)
    THEN RAISE EXCEPTION 'Duplicate proposed slug'; END IF;
  PERFORM i.id FROM public.items i JOIN navagli_seo_values v USING (id) FOR UPDATE OF i;
  IF EXISTS (SELECT 1 FROM navagli_seo_values v LEFT JOIN public.items i ON i.id = v.id
      WHERE i.id IS NULL OR i.company_id <> v.company_id OR i.item_type <> v.item_type
      OR i.status <> 'published' OR i.updated_at IS DISTINCT FROM v.expected_updated_at)
    THEN RAISE EXCEPTION 'Missing, unpublished, out-of-scope or concurrently edited item'; END IF;
  IF EXISTS (SELECT 1 FROM navagli_seo_values v JOIN public.items i
      ON i.company_id = v.company_id AND lower(i.slug) = lower(v.slug) AND i.id <> v.id)
    THEN RAISE EXCEPTION 'Slug collision in this company (all item types/states)'; END IF;
END $$;

-- Save this before-image alongside the authorised public export before confirming any batch.
SELECT i.id, i.company_id, i.item_type, i.slug, i.seo_title, i.seo_description,
       i.seo_og_image_url, i.updated_at
FROM public.items i JOIN navagli_seo_values v USING (id);

UPDATE public.items i SET slug = v.slug, seo_title = v.seo_title,
  seo_description = v.seo_description, seo_og_image_url = v.seo_og_image_url,
  updated_at = now()
FROM navagli_seo_values v
WHERE i.id = v.id AND i.company_id = v.company_id AND i.item_type = v.item_type AND i.status = 'published'
RETURNING i.id, i.company_id, i.item_type, i.slug, i.seo_title, i.seo_description, i.seo_og_image_url, i.updated_at;

-- Default is a dry run. A responsible person reviews returned rows before choosing COMMIT.
ROLLBACK;
