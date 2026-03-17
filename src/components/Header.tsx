'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.container}`}>
        <Link href="/" className={styles.logo}>
          Mãe <span>Elegante</span>
        </Link>
        
        <button 
          className={styles.mobileMenuBtn} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`}></div>
        </button>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
          <Link href="/livros" onClick={() => setIsMenuOpen(false)}>Livros</Link>
          <Link href="/sobre" onClick={() => setIsMenuOpen(false)}>Sobre</Link>
          <Link href="/admin" className={styles.adminLink} onClick={() => setIsMenuOpen(false)}>Painel Admin</Link>
        </nav>
      </div>
    </header>
  );
}
