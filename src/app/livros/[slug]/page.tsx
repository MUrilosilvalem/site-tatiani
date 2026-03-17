import { Book } from "@/data/books";
import { notFound } from "next/navigation";
import styles from "./pdp.module.css";
import Link from "next/link";
import fs from 'fs/promises';
import path from 'path';

async function getBooks(): Promise<Book[]> {
  const filePath = path.join(process.cwd(), 'src/data/books.json');
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

interface PDPProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PDPProps) {
  const { slug } = await params;
  const books = await getBooks();
  const book = books.find((b) => b.slug === slug);

  if (!book) {
    notFound();
  }

  return (
    <div className={`container ${styles.page}`}>
      <Link href="/livros" className={styles.backBtn}>
        &larr; Voltar para a listagem
      </Link>
      
      <div className={styles.grid}>
        <div className={styles.imageCol}>
          <img src={book.imageUrl} alt={book.title} className={styles.mainImage} />
        </div>
        
        <div className={styles.contentCol}>
          <span className={styles.category}>{book.category}</span>
          <h1 className={styles.title}>{book.title}</h1>
          <div className={styles.price}>
            {book.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
          
          <div className={styles.description}>
            <h3>Sobre este livro</h3>
            <p>{book.description}</p>
            <p>
              Este é um material completo, desenvolvido com base em evidências e 
              experiência prática para auxiliar mães em sua jornada diária. 
              Ao adquirir este produto, você terá acesso imediato ao conteúdo digital.
            </p>
          </div>
          
          <a 
            href={book.checkoutUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.buyBtn}
          >
            Finalizar Compra
          </a>
          
          <div className={styles.features}>
            <div className={styles.feature}>
              <span>✓</span> Acesso vitalício
            </div>
            <div className={styles.feature}>
              <span>✓</span> Formato Digital (PDF/E-book)
            </div>
            <div className={styles.feature}>
              <span>✓</span> Suporte via e-mail
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
