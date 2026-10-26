import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { trackEvent } from '../../lib/analytics';
import { submitLead } from '../../lib/leads';
import styles from './CTAForm.module.css';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const SERVICE_OPTIONS_KEYS = [
  'integral',
  'kitchen',
  'bathroom',
  'interior',
  'rehabilitation',
  'commercial',
  'office',
  'other',
];

const INITIAL_STATE = {
  name: '',
  city: '',
  serviceType: '',
  email: '',
  phone: '',
  description: '',
  company_website: '',
};

/**
 * Reusable quote-request form.
 * Can be rendered inline (inline=true) or as a modal overlay.
 *
 * @param {{ isOpen: boolean, onClose: () => void, inline?: boolean }} props
 */
export default function CTAForm({ isOpen, onClose, inline = false, sourceItem }) {
  const { t } = useTranslation();
  const [form, setForm] = useState(INITIAL_STATE);
  const [invalid, setInvalid] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  useEffect(() => {
    if (inline || isOpen) trackEvent('form_open');
  }, [inline, isOpen]);

  if (!inline && !isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setInvalid(false);
    const { company_website, ...fields } = form;
    const result = await submitLead({
      name: fields.name,
      email: fields.email,
      phone: fields.phone,
      company_website,
      source_item: sourceItem,
      consent_given: new FormData(e.currentTarget).get('privacy') === 'on',
      consent_text_version: 'navagli-contact-2026-10-v1',
      message: [
        `Ciudad: ${fields.city}`,
        `Servicio: ${t('form.serviceOptions.' + fields.serviceType)}`,
        fields.description,
      ].filter(Boolean).join('\n'),
    });

    if (result.ok) {
      setStatus('success');
      setForm(INITIAL_STATE);
      // Email is an additional notification; the inbox is the source of truth.
      if (!company_website && SUPABASE_URL && SUPABASE_ANON_KEY) {
        void fetch(`${SUPABASE_URL}/functions/v1/navagli-send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            apikey: SUPABASE_ANON_KEY,
          },
          body: JSON.stringify(fields),
        }).catch(() => {});
      }
    } else {
      setInvalid(result.reason === 'invalid');
      setStatus('error');
    }
  };

  const formContent = status === 'success' ? (
    <div className={styles.successBox} role="status">
      <p className={styles.successMsg}>{t('form.success')}</p>
      <button
        type="button"
        className={styles.submitBtn}
        onClick={() => { setStatus('idle'); if (!inline) onClose(); }}
      >
        {t('form.close')}
      </button>
    </div>
  ) : (
    <form id="cta-form" onSubmit={handleSubmit} className={styles.form} aria-busy={status === 'sending'}>
      <div className={styles.fieldRow}>
        <div>
          <label className={styles.label}>
            {t('form.name')} <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="name"
            maxLength={120}
            value={form.name}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div>
          <label className={styles.label}>
            {t('form.city')} <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
      </div>

      <div>
        <label className={styles.label}>
          {t('form.serviceType')} <span className={styles.required}>*</span>
        </label>
        <select
          name="serviceType"
          value={form.serviceType}
          onChange={handleChange}
          required
          className={styles.select}
        >
          <option value="" disabled>— Selecciona —</option>
          {SERVICE_OPTIONS_KEYS.map((key) => (
            <option key={key} value={key}>
              {t(`form.serviceOptions.${key}`)}
            </option>
          ))}
        </select>
      </div>

      <p>{t('form.contactRequired')}</p>
      <div className={styles.fieldRow}>
        <div>
          <label className={styles.label}>
            {t('form.email')}
          </label>
          <input
            type="email"
            name="email"
            maxLength={160}
            value={form.email}
            onChange={handleChange}
            required={!form.email.trim() && !form.phone.trim()}
            className={styles.input}
          />
        </div>
        <div>
          <label className={styles.label}>
            {t('form.phone')}
          </label>
          <input
            type="tel"
            name="phone"
            maxLength={40}
            value={form.phone}
            onChange={handleChange}
            required={!form.email.trim() && !form.phone.trim()}
            className={styles.input}
          />
        </div>
      </div>

      <div>
        <label className={styles.label}>{t('form.description')}</label>
        <textarea
          name="description"
          maxLength={3800}
          value={form.description}
          onChange={handleChange}
          rows={5}
          className={styles.textarea}
        />
      </div>

      {/* Trampa anti-bots: una persona nunca lo ve ni lo rellena. */}
      <input
        type="text"
        name="company_website"
        value={form.company_website}
        onChange={handleChange}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1 }}
      />

      <label className={styles.privacy}>
        <input type="checkbox" name="privacy" />
        <span>
          {t('form.privacyPrefix')}{' '}
          <a href="/politica-privacidad" target="_blank" rel="noopener noreferrer">
            {t('form.privacyLink')}
          </a>{' '}
        </span>
      </label>

      {status === 'error' && (
        <p className={styles.errorMsg} role="alert">{t(invalid ? 'form.invalid' : 'form.error')}</p>
      )}
      <button type="submit" className={styles.submitBtn} disabled={status === 'sending'}>
        {status === 'sending' ? t('form.sending') : t('form.submit')}
      </button>
    </form>
  );

  if (inline) {
    return <div>{formContent}</div>;
  }

  // Modal mode
  return (
    <div
      id="cta-modal"
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div className={styles.backdrop} onClick={onClose} />

      {/* Panel */}
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>{t('form.title')}</h2>
          <button
            onClick={onClose}
            className={styles.closeBtn}
            aria-label="Cerrar"
          >
            <X size={22} />
          </button>
        </div>
        <div className={styles.panelBody}>{formContent}</div>
      </div>
    </div>
  );
}
