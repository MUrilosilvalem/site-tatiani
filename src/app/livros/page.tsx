import ProductGrid from "@/components/ProductGrid";
import { Book } from "@/data/books";
import styles from "./livros.module.css";
import fs from 'fs/promises';
import path from 'path';

async function getBooks(): Promise<Book[]> {
  const filePath = path.join(process.cwd(), 'src/data/books.json');
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

export default async function LivrosPage() {
  const books = await getBooks();
  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>Nossa Biblioteca para <span>Mães</span></h1>
        <p className={styles.subtitle}>
          Explore todos os nossos materiais educativos, e-books e cursos.
        </p>
      </header>
      
      <ProductGrid books={books} />
    </div>
  );
}
