import styles from './ProductGrid.module.css';
import { Book } from '@/data/books';
import ProductCard from './ProductCard';

interface ProductGridProps {
  books: Book[];
}

export default function ProductGrid({ books }: ProductGridProps) {
  return (
    <div className={styles.grid}>
      {books.map((book) => (
        <ProductCard key={book.id} book={book} />
      ))}
    </div>
  );
}
