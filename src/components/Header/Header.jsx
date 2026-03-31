import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import styles from './Header.module.css';

const LANGUAGES = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
];

const SERVICE_PATHS = [
  '/reformas-integrales',
  '/pintura-decorativa',
  '/asesoramiento-profesional',
];

export default function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const isHome = location.pathname === '/';
  const isTransparent = isHome && !scrolled;
  const isServicesActive = SERVICE_PATHS.some((p) => location.pathname.startsWith(p));

  const serviceLinks = [
    { to: '/reformas-integrales',       label: t('nav.servicesDropdown.integral') },
    { to: '/pintura-decorativa',        label: t('nav.servicesDropdown.painting') },
    { to: '/asesoramiento-profesional', label: t('nav.servicesDropdown.consulting') },
  ];

  const navLinks = [
    { to: '/proyectos',           label: t('nav.projects') },
    { to: '/quienes-somos',       label: t('nav.about') },
    { to: '/pide-tu-presupuesto', label: t('nav.contact') },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
  }, [location]);

  return (
    <header
      id="header"
      className={`${styles.header} ${isTransparent ? styles.headerTransparent : styles.headerDark}`}
    >
      <div className={styles.inner}>
        {/* Logo */}
        <Link to="/" className={styles.logoLink}>
          <img
            src="/img/Isotipo_Navagli.png"
            alt="Navagli"
            className={styles.logoImg}
          />
        </Link>

        {/* Desktop Nav */}
        <nav id="desktop-nav" className={styles.desktopNav}>
          {/* Home */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
          >
            {t('nav.home')}
          </NavLink>

          {/* Services dropdown */}
          <div
            className={styles.serviceDropdownWrapper}
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              className={`${styles.navLink} ${styles.serviceDropdownBtn} ${isServicesActive || servicesOpen ? styles.navLinkActive : ''}`}
              onClick={() => setServicesOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={servicesOpen}
            >
              {t('nav.services')}
              <ChevronDown
                size={13}
                className={servicesOpen ? styles.chevronOpen : styles.chevron}
              />
            </button>
            {servicesOpen && (
              <div id="services-dropdown" className={styles.serviceDropdown}>
                {serviceLinks.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `${styles.serviceDropdownItem} ${isActive ? styles.serviceDropdownItemActive : ''}`
                    }
                    onClick={() => setServicesOpen(false)}
                  >
                    {label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Other nav links */}
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right controls */}
        <div className={styles.rightControls}>
          {/* Language switcher */}
          <div className={styles.langWrapper}>
            <button
              onClick={() => setLangOpen((v) => !v)}
              className={styles.langButton}
              aria-label="Cambiar idioma"
            >
              <Globe size={16} />
              <span>{i18n.language?.toUpperCase().slice(0, 2)}</span>
            </button>
            {langOpen && (
              <div id="lang-dropdown" className={styles.langDropdown}>
                {LANGUAGES.map(({ code, label }) => (
                  <button
                    key={code}
                    onClick={() => {
                      i18n.changeLanguage(code);
                      setLangOpen(false);
                    }}
                    className={`${styles.langOption} ${i18n.language === code ? styles.langOptionActive : ''}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div id="mobile-menu" className={styles.mobileMenu}>
          {/* Home */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ''}`
            }
          >
            {t('nav.home')}
          </NavLink>

          {/* Services group */}
          <div className={styles.mobileServicesGroup}>
            <p className={styles.mobileServicesLabel}>{t('nav.services')}</p>
            {serviceLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `${styles.mobileSubNavLink} ${isActive ? styles.mobileNavLinkActive : ''}`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Other links */}
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ''}`
              }
            >
              {label}
            </NavLink>
          ))}

          <div className={styles.mobileLangBar}>
            {LANGUAGES.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => i18n.changeLanguage(code)}
                className={`${styles.mobileLangButton} ${i18n.language === code ? styles.mobileLangButtonActive : ''}`}
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
