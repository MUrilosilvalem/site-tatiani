'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Super simple auth: check against a hardcoded value or env var
    // For this demo, let's use 'admin123'
    if (password === 'admin123') {
      document.cookie = 'admin_auth=true; path=/';
      router.push('/admin');
    } else {
      setError('Senha incorreta');
    }
  };

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.card}>
        <h1>Acesso Restrito</h1>
        <form onSubmit={handleLogin} className={styles.form}>
          <input 
            type="password" 
            placeholder="Digite a senha" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.btn}>Entrar</button>
        </form>
      </div>
    </div>
  );
}
