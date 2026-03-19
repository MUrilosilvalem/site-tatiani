import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import { prisma } from "@/lib/prisma";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function Home() {
  // Busca todos os livros com suas imagens
  const allBooks = await prisma.book.findMany({
    include: { images: true },
    orderBy: { createdAt: 'desc' }
  });

  // Formata os livros para o Cloudinary/Frontend (pega a primeira imagem como padrão)
  const formattedBooks = allBooks.map(book => ({
    ...book,
    imageUrl: book.images[0]?.url || '',
  }));

  // Filtra destaques manuais
  let highlights = formattedBooks.filter(book => book.isFeatured);

  // Fallback: Se não houver destaques marcados, pega os 3 mais recentes
  if (highlights.length === 0) {
    highlights = formattedBooks.slice(0, 3);
  }

  return (
    <>
      <Hero />
      
      <section id="destaques" className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Nossos <span>Destaques</span></h2>
          <p className={styles.sectionSubtitle}>
            Selecionamos os livros mais queridos pelas mães da nossa comunidade.
          </p>
          <ProductGrid books={highlights} />
        </div>
      </section>

      <section className={styles.testimonials}>
        {/* ... restante do componente ... */}
        <div className="container">
          <h2 className={styles.sectionTitle}>O que as <span>mães</span> dizem</h2>
          <p className={styles.sectionSubtitle}>
            Histórias reais de quem transformou sua jornada materna com nossos conteúdos.
          </p>
          
          <div className={styles.testimonialGrid}>
            <div className={styles.testimonialCard}>
              <p className={styles.quote}>
                "O guia para mães de primeira viagem foi meu melhor amigo nas madrugadas. Me senti acolhida e informada."
              </p>
              <div className={styles.author}>
                Mariana Silva
                <span className={styles.authorRole}>Mãe da Alice (6 meses)</span>
              </div>
            </div>
            
            <div className={styles.testimonialCard}>
              <p className={styles.quote}>
                "A introdução alimentar aqui em casa era um estresse. Depois do livro, tudo mudou para melhor. Super recomendo!"
              </p>
              <div className={styles.author}>
                Juliana Costa
                <span className={styles.authorRole}>Mãe do Theo (1 ano)</span>
              </div>
            </div>
            
            <div className={styles.testimonialCard}>
              <p className={styles.quote}>
                "Finalmente consegui entender os ciclos de sono do meu bebê sem métodos cruéis. Gratidão eterna!"
              </p>
              <div className={styles.author}>
                Beatriz Santos
                <span className={styles.authorRole}>Mãe da Sofia (8 meses)</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
