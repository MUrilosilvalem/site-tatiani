import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import styles from "./pdp.module.css";
import Link from "next/link";
import Carousel from "@/components/Carousel";

interface PDPProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PDPProps) {
  const { slug } = await params;
  
  const book = await prisma.book.findUnique({
    where: { slug },
    include: { images: true }
  });

  if (!book) {
    notFound();
  }

  const images = book.images.map(img => img.url);

  return (
    <div className={`container ${styles.page}`}>
      <Link href="/livros" className={styles.backBtn}>
        &larr; Voltar para a listagem
      </Link>
      
      <div className={styles.grid}>
        <div className={styles.imageCol}>
          {images.length > 0 ? (
            <Carousel images={images} />
          ) : (
            <div className={styles.noImage}>Sem imagem disponível</div>
          )}
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
          </div>
        </div>
      </div>
    </div>
  );
}
