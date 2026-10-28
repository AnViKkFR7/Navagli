// Read-only diagnostics. No inserts and no personal lead rows are retrieved.
import { createClient } from '@supabase/supabase-js';

const { SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: key, VITE_COMPANY_ID: companyId } = process.env;
if (!url || !key || !companyId) {
  console.error('Missing configuration:', ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'VITE_COMPANY_ID'].filter((name) => !process.env[name]).join(', '));
  process.exitCode = 1;
} else {
  try {
    const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const columns = 'id,company_id,name,email,phone,message,source_path,source_item,source_referrer,source_campaign,source_utm_source,source_utm_medium,source_utm_term,source_utm_content,consent_given,consent_at,consent_text_version,consent_source';
    for (const [check, query] of [
      ['company', client.from('companies').select('id').eq('id', companyId).maybeSingle()],
      ['crm', client.from('company_modules').select('is_enabled').eq('company_id', companyId).eq('module_key', 'crm').maybeSingle()],
      ['lead_columns', client.from('lead').select(columns).eq('company_id', companyId).limit(0)],
    ]) {
      const { data, error, status } = await query;
      const authFailure = status === 401 || /invalid api key|invalid jwt|jwt expired/i.test(error?.message || '');
      const ok = !error && (check === 'company' ? Boolean(data?.id) : check === 'crm' ? data?.is_enabled === true : true);
      console.log(JSON.stringify({ check, ok, status, code: error?.code || null,
        problem: authFailure ? 'Invalid Supabase credentials: verify the server URL and matching service-role/secret key.'
          : error ? 'Backend query failed; check schema and server configuration.' : ok ? null : 'Company missing or CRM disabled.' }));
      if (!ok) process.exitCode = 1;
    }
  } catch {
    console.error('Unable to initialise lead diagnostics. Check the server configuration. No credentials printed.');
    process.exitCode = 1;
  }
}
