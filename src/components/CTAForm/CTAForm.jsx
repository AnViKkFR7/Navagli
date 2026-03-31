import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import styles from './CTAForm.module.css';

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
};

/**
 * Reusable quote-request form.
 * Can be rendered inline (inline=true) or as a modal overlay.
 *
 * @param {{ isOpen: boolean, onClose: () => void, inline?: boolean }} props
 */
export default function CTAForm({ isOpen, onClose, inline = false }) {
  const { t } = useTranslation();
  const [form, setForm] = useState(INITIAL_STATE);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  if (!inline && !isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Server error');
      setStatus('success');
      setForm(INITIAL_STATE);
    } catch {
      setStatus('error');
    }
  };

  const formContent = status === 'success' ? (
    <div className={styles.successBox}>
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
    <form id="cta-form" onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.fieldRow}>
        <div>
          <label className={styles.label}>
            {t('form.name')} <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="name"
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

      <div className={styles.fieldRow}>
        <div>
          <label className={styles.label}>
            {t('form.email')} <span className={styles.required}>*</span>
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div>
          <label className={styles.label}>
            {t('form.phone')} <span className={styles.required}>*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
      </div>

      <div>
        <label className={styles.label}>{t('form.description')}</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={5}
          className={styles.textarea}
        />
      </div>

      {status === 'error' && (
        <p className={styles.errorMsg}>{t('form.error')}</p>
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
