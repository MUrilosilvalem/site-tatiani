import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoText, setLogoText] = useState('Mãe Elegante');
  const [logoImg, setLogoImg] = useState('');

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        const text = data.find((c: any) => c.key === 'site.logo.text')?.value;
        const img = data.find((c: any) => c.key === 'site.logo.image')?.value;
        if (text) setLogoText(text);
        if (img) setLogoImg(img);
      });
  }, []);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.container}`}>
        <Link href="/" className={styles.logo}>
          {logoImg ? (
            <img src={logoImg} alt={logoText} style={{ height: '40px' }} />
          ) : (
            <>
              {logoText.split(' ').map((word, i) => (
                <span key={i}>{i > 0 && ' '} {i === 1 ? <span>{word}</span> : word}</span>
              ))}
            </>
          )}
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
          <Link href="/blog" onClick={() => setIsMenuOpen(false)}>Blog</Link>
          <Link href="/sobre" onClick={() => setIsMenuOpen(false)}>Sobre</Link>
        </nav>
      </div>
    </header>
  );
}
