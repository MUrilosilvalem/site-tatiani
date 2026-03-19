import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import styles from './blog.module.css';

export const dynamic = "force-dynamic";
export const revalidate = 60; // revalidate every minute

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>Blog & Dicas</h1>
        <p className={styles.subtitle}>Compartilhando conhecimento sobre maternidade e autodesenvolvimento.</p>
      </header>

      <div className={styles.grid}>
        {posts.length === 0 ? (
          <p>Nenhuma postagem encontrada no momento.</p>
        ) : (
          posts.map(post => (
            <article key={post.id} className={styles.card}>
              {post.imageUrl && (
                <div className={styles.imageWrapper}>
                  <img src={post.imageUrl} alt={post.title} />
                </div>
              )}
              <div className={styles.content}>
                <span className={styles.category}>{post.category}</span>
                <h2 className={styles.postTitle}>{post.title}</h2>
                <p className={styles.excerpt}>
                  {post.content.substring(0, 150)}...
                </p>
                <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                  Ler mais →
                </Link>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
