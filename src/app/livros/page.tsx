import ProductGrid from "@/components/ProductGrid";
import { prisma } from "@/lib/prisma";
import styles from "./livros.module.css";

export default async function LivrosPage() {
  const books = await prisma.book.findMany({
    include: { images: true },
    orderBy: { createdAt: 'desc' }
  });

  const formattedBooks = books.map(book => ({
    ...book,
    imageUrl: book.images[0]?.url || '',
  }));

  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>Nossa Biblioteca para <span>Mães</span></h1>
        <p className={styles.subtitle}>
          Explore todos os nossos materiais educativos, e-books e cursos.
        </p>
      </header>
      
      <ProductGrid books={formattedBooks} />
    </div>
  );
}
