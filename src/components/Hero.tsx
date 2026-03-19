import styles from './Hero.module.css';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function Hero() {
  const content = await prisma.pageContent.findMany({
    where: {
      key: { in: ['home.hero.title', 'home.hero.subtitle'] }
    }
  });

  const getVal = (key: string, def: string) => content.find(c => c.key === key)?.value || def;

  const title = getVal('home.hero.title', 'Conectando Mães ao Cuidado e ao Conhecimento');
  const subtitle = getVal('home.hero.subtitle', 'Explore nossa curadoria de livros e infoprodutos criados para acolher e guiar você em cada etapa da maternidade.');
  const imageUrl = getVal('home.hero.image', 'https://images.unsplash.com/photo-1494451930944-8994a727b92d?q=80&w=800&auto=format&fit=crop');

  return (
    <section className={styles.hero}>
      <div className={`container ${styles.container}`}>
        <div className={styles.content}>
          <h1 className={styles.title} dangerouslySetInnerHTML={{ __html: title.replace('<span>', '<span class="' + styles.titleHighlight + '">').replace('</span>', '</span>') }} />
          <p className={styles.subtitle}>{subtitle}</p>
          <div className={styles.actions}>
            <Link href="/livros" className={styles.primaryBtn}>
              Ver Todos os Livros
            </Link>
            <Link href="#destaques" className={styles.secondaryBtn}>
              Ver Destaques
            </Link>
          </div>
        </div>
        <div className={styles.imageWrapper}>
          <img 
            src={imageUrl} 
            alt="Hero Image" 
            className={styles.image}
          />
        </div>
      </div>
    </section>
  );
}
