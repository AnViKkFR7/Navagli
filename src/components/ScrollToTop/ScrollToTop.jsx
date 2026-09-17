import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageview } from '../../lib/analytics';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    trackPageview(pathname);
  }, [pathname]);

  return null;
}
