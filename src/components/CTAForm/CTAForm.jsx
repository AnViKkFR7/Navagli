import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

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

  if (!inline && !isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: integrate with backend / email service
    console.log('Form submitted:', form);
    setForm(INITIAL_STATE);
    if (!inline) onClose();
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase text-[#151515] mb-1">
            {t('form.name')} <span className="text-[#da9a4d]">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-[#e7ded2] bg-white px-4 py-3 text-sm text-[#151515] focus:outline-none focus:border-[#da9a4d] transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase text-[#151515] mb-1">
            {t('form.city')} <span className="text-[#da9a4d]">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            required
            className="w-full border border-[#e7ded2] bg-white px-4 py-3 text-sm text-[#151515] focus:outline-none focus:border-[#da9a4d] transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold tracking-widest uppercase text-[#151515] mb-1">
          {t('form.serviceType')} <span className="text-[#da9a4d]">*</span>
        </label>
        <select
          name="serviceType"
          value={form.serviceType}
          onChange={handleChange}
          required
          className="w-full border border-[#e7ded2] bg-white px-4 py-3 text-sm text-[#151515] focus:outline-none focus:border-[#da9a4d] transition-colors appearance-none"
        >
          <option value="" disabled>— Selecciona —</option>
          {SERVICE_OPTIONS_KEYS.map((key) => (
            <option key={key} value={key}>
              {t(`form.serviceOptions.${key}`)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase text-[#151515] mb-1">
            {t('form.email')} <span className="text-[#da9a4d]">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-[#e7ded2] bg-white px-4 py-3 text-sm text-[#151515] focus:outline-none focus:border-[#da9a4d] transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase text-[#151515] mb-1">
            {t('form.phone')} <span className="text-[#da9a4d]">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full border border-[#e7ded2] bg-white px-4 py-3 text-sm text-[#151515] focus:outline-none focus:border-[#da9a4d] transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold tracking-widest uppercase text-[#151515] mb-1">
          {t('form.description')}
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={5}
          className="w-full border border-[#e7ded2] bg-white px-4 py-3 text-sm text-[#151515] focus:outline-none focus:border-[#da9a4d] transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        className="bg-[#da9a4d] text-white px-8 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-[#151515] transition-colors duration-300 mt-2"
      >
        {t('form.submit')}
      </button>
    </form>
  );

  if (inline) {
    return (
      <div>
        {formContent}
      </div>
    );
  }

  // Modal mode
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-[#e7ded2]">
          <h2 className="text-xl font-light tracking-wide text-[#151515]">
            {t('form.title')}
          </h2>
          <button
            onClick={onClose}
            className="text-[#8f999b] hover:text-[#151515] transition-colors"
            aria-label="Cerrar"
          >
            <X size={22} />
          </button>
        </div>
        <div className="px-8 py-8">{formContent}</div>
      </div>
    </div>
  );
}
