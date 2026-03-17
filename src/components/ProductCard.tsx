'use client';

import styles from './ProductCard.module.css';
import { Book } from '@/data/books';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface ProductCardProps {
  book: Book;
}

export default function ProductCard({ book }: ProductCardProps) {
  const [formattedPrice, setFormattedPrice] = useState<string>('');

  useEffect(() => {
    setFormattedPrice(book.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
  }, [book.price]);

  return (
    <div className={styles.card}>
      <Link href={`/livros/${book.slug}`} className={styles.imageLink}>
        <div className={styles.imageWrapper}>
          <img src={book.imageUrl} alt={book.title} className={styles.image} />
          <span className={styles.category}>{book.category}</span>
        </div>
      </Link>
      <div className={styles.content}>
        <h3 className={styles.title}>{book.title}</h3>
        <p className={styles.description}>{book.description}</p>
        <div className={styles.footer}>
          <span className={styles.price}>
            {formattedPrice || '...'}
          </span>
          <Link href={`/livros/${book.slug}`} className={styles.detailsBtn}>
            Ver Detalhes
          </Link>
        </div>
        <a 
          href={book.checkoutUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.buyBtn}
        >
          Comprar Agora
        </a>
      </div>
    </div>
  );
}
