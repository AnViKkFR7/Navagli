import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe } from 'lucide-react';

const LANGUAGES = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
];

export default function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const headerBg = isHome && !scrolled
    ? 'bg-transparent'
    : 'bg-[#151515]';

  const textColor = isHome && !scrolled ? 'text-white' : 'text-white';

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/servicios', label: t('nav.services') },
    { to: '/proyectos', label: t('nav.projects') },
    { to: '/quienes-somos', label: t('nav.about') },
    { to: '/pide-tu-presupuesto', label: t('nav.contact') },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${headerBg}`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 flex items-center justify-between h-20">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img
            src="/img/Logo_Navagli.png"
            alt="Navagli"
            className={`h-12 transition-all duration-300 ${isHome && !scrolled ? 'brightness-0 invert' : 'brightness-0 invert'}`}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium tracking-widest uppercase transition-colors duration-200 ${textColor} ${
                  isActive ? 'text-[#da9a4d]' : 'hover:text-[#da9a4d]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-4">
          {/* Language switcher */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setLangOpen((v) => !v)}
              className={`flex items-center gap-1 text-sm font-medium ${textColor} hover:text-[#da9a4d] transition-colors`}
              aria-label="Cambiar idioma"
            >
              <Globe size={16} />
              <span>{i18n.language?.toUpperCase().slice(0, 2)}</span>
            </button>
            {langOpen && (
              <div className="absolute right-0 top-8 bg-white shadow-lg py-1 min-w-[80px] z-50">
                {LANGUAGES.map(({ code, label }) => (
                  <button
                    key={code}
                    onClick={() => {
                      i18n.changeLanguage(code);
                      setLangOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm text-[#151515] hover:bg-[#e7ded2] transition-colors ${
                      i18n.language === code ? 'font-bold text-[#da9a4d]' : ''
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button
            className={`md:hidden ${textColor}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#151515] px-6 py-6 flex flex-col gap-5">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `text-base font-medium tracking-widest uppercase text-white ${
                  isActive ? 'text-[#da9a4d]' : 'hover:text-[#da9a4d]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <div className="flex gap-4 pt-2 border-t border-white/20">
            {LANGUAGES.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => i18n.changeLanguage(code)}
                className={`text-sm font-medium text-white hover:text-[#da9a4d] transition-colors ${
                  i18n.language === code ? 'text-[#da9a4d]' : ''
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
