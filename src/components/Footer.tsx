import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.content}>
          <p>&copy; {new Date().getFullYear()} Loja de Livros para Mães. Todos os direitos reservados.</p>
          <div className={styles.links}>
            <a href="#">Privacidade</a>
            <a href="#">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
