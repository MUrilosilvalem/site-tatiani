import styles from './Hero.module.css';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.container}`}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Conectando Mães ao <span>Cuidado</span> e ao <span>Conhecimento</span>
          </h1>
          <p className={styles.subtitle}>
            Explore nossa curadoria de livros e infoprodutos criados para acolher e guiar você em cada etapa da maternidade.
          </p>
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
            src="https://images.unsplash.com/photo-1494451930944-8994a727b92d?q=80&w=800&auto=format&fit=crop" 
            alt="Mãe lendo para filho" 
            className={styles.image}
          />
        </div>
      </div>
    </section>
  );
}
