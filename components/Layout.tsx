import type { User } from '@supabase/supabase-js';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title = 'Hotel Yashoda' }: LayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => setIsAdmin(data?.role === 'admin'));
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => setIsAdmin(data?.role === 'admin'));
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Mobile nav + scroll effects
  useEffect(() => {
    const header = document.getElementById('header');
    const backToTop = document.getElementById('back-to-top');

    const handleScroll = () => {
      if (header) header.classList.toggle('scrolled', window.scrollY > 10);
      if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <header className="header" id="header">
        <div className="header__inner">
          <Link className="header__logo" href="/">
            <span className="header__logo-icon" aria-hidden="true">🏨</span>
            <span className="header__logo-text">Hotel Yashoda</span>
          </Link>
          <button
            className={`nav-toggle${menuOpen ? ' open' : ''}`}
            id="nav-toggle"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <nav
            className={`nav${menuOpen ? ' open' : ''}`}
            id="nav-menu"
            role="navigation"
            aria-label="Main navigation"
          >
            <ul className="nav__list">
              <li><Link className="nav__link" href="/#about" onClick={closeMenu}>About</Link></li>
              <li><Link className="nav__link" href="/#rooms" onClick={closeMenu}>Rooms</Link></li>
              <li><Link className="nav__link" href="/#restaurant" onClick={closeMenu}>Restaurant</Link></li>
              <li><Link className="nav__link" href="/#contact" onClick={closeMenu}>Contact</Link></li>
              <li>
                <Link className="nav__link" href="/rooms" onClick={closeMenu}>
                  Book a Room
                </Link>
              </li>
              {user ? (
                <>
                  <li>
                    <Link className="nav__link" href="/dashboard" onClick={closeMenu}>
                      My Bookings
                    </Link>
                  </li>
                  {isAdmin && (
                    <li>
                      <Link className="nav__link" href="/admin/bookings" onClick={closeMenu}>
                        Admin
                      </Link>
                    </li>
                  )}
                  <li>
                    <button className="nav__link link-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link className="nav__link" href="/auth/login" onClick={closeMenu}>
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="btn btn--primary btn--sm"
                      href="/auth/signup"
                      onClick={closeMenu}
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__brand">
            <span className="footer__logo">🏨 Hotel Yashoda</span>
            <p>
              Your trusted budget hotel and guest house in Bhadrak, Odisha. Comfortable rooms,
              warm hospitality, and authentic dining — always at affordable prices.
            </p>
          </div>
          <div className="footer__links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link href="/#about">About Us</Link></li>
              <li><Link href="/#rooms">Rooms &amp; Facilities</Link></li>
              <li><Link href="/rooms">Book a Room</Link></li>
              <li><Link href="/#contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer__contact">
            <h4>Contact</h4>
            <p>📍 Bhadrak, Odisha – 756100</p>
            <p>
              📞 <a href="tel:+919437000000">+91 94370 00000</a>
            </p>
            <p>
              ✉️ <a href="mailto:info@hotelyashoda.com">info@hotelyashoda.com</a>
            </p>
            <p>⏰ 24/7 Reception</p>
          </div>
        </div>
        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} Hotel Yashoda, Bhadrak, Odisha. All rights reserved.</p>
          <p>Designed with ❤️ for our valued guests.</p>
        </div>
      </footer>
      <a href="#" className="back-to-top" id="back-to-top" aria-label="Back to top">
        ↑
      </a>
    </>
  );
}
