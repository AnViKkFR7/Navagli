import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { submitContactMessage } from '../services/propertyService';
import type { ContactMessage } from '../types';

interface FormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const INITIAL_FORM: FormState = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

export function ContactPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError(t('contact.required_fields'));
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payload: Omit<ContactMessage, 'id' | 'created_at'> = {
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        subject: form.subject,
        message: form.message,
      };
      await submitContactMessage(payload);
      setSuccess(true);
      setForm(INITIAL_FORM);
    } catch {
      setError(t('contact.error'));
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <MapPin size={20} className="text-blue-700" />,
      text: 'Calle Principal 123, Madrid, España',
    },
    {
      icon: <Phone size={20} className="text-blue-700" />,
      text: '+34 600 000 000',
      href: 'tel:+34600000000',
    },
    {
      icon: <Mail size={20} className="text-blue-700" />,
      text: 'info@navagli.es',
      href: 'mailto:info@navagli.es',
    },
    {
      icon: <Clock size={20} className="text-blue-700" />,
      text: 'Lun–Vie 9:00–18:00',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-blue-900 text-white py-12">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('contact.title')}</h1>
          <p className="text-blue-200">{t('contact.subtitle')}</p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 text-lg mb-5">{t('contact.contact_info')}</h2>
              <ul className="space-y-4">
                {contactInfo.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">{item.icon}</div>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-sm text-gray-600 hover:text-blue-900 transition-colors"
                      >
                        {item.text}
                      </a>
                    ) : (
                      <span className="text-sm text-gray-600">{item.text}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
              {success ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">✅</div>
                  <p className="text-green-700 font-semibold text-lg">{t('contact.success')}</p>
                </div>
              ) : (
                <form onSubmit={(e) => void handleSubmit(e)} noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t('contact.name')} *
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t('contact.email')} *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t('contact.phone')}
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t('contact.subject')} *
                      </label>
                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        value={form.subject}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {t('contact.message')} *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  {error && (
                    <p className="text-red-600 text-sm mb-4">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-8 py-3 bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors"
                  >
                    {submitting ? t('contact.sending') : t('contact.send')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
