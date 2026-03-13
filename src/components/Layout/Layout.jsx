import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import ScrollToTop from '../ScrollToTop/ScrollToTop';
import CookieBanner from '../CookieBanner/CookieBanner';
import styles from './Layout.module.css';

export default function Layout() {
  return (
    <div className={styles.wrapper}>
      <ScrollToTop />
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
