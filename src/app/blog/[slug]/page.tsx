import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import styles from './post.module.css';

export const revalidate = 60;

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug }
  });

  if (!post || !post.published) {
    notFound();
  }

  return (
    <article className={`container ${styles.article}`}>
      <Link href="/blog" className={styles.backLink}>← Voltar para o blog</Link>
      
      <header className={styles.header}>
        <span className={styles.category}>{post.category}</span>
        <h1 className={styles.title}>{post.title}</h1>
        <div className={styles.meta}>
          Publicado em: {new Date(post.createdAt).toLocaleDateString('pt-BR')}
        </div>
      </header>

      {post.imageUrl && (
        <div className={styles.mainImage}>
          <img src={post.imageUrl} alt={post.title} />
        </div>
      )}

      <div className={styles.content}>
        {/* Simple text-to-html conversion for now (splitting by newlines) */}
        {post.content.split('\n').map((para, i) => (
          para.trim() ? <p key={i}>{para}</p> : <br key={i} />
        ))}
      </div>
    </article>
  );
}
