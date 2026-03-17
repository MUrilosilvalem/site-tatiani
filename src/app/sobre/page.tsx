import styles from './page.module.css';

export default function Sobre() {
  return (
    <div className="container" style={{ padding: 'var(--space-xl) 0' }}>
      <h1 style={{ color: 'var(--color-pink-medium)', marginBottom: 'var(--space-md)' }}>
        Sobre a <span>Tatiani</span> e o Mãe Elegante
      </h1>
      <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'var(--text-muted)', maxWidth: '800px' }}>
        O Mãe Elegante nasceu do desejo de acolher e informar mães em suas diversas jornadas. 
        Acreditamos que o conhecimento é a ferramenta mais poderosa para uma maternidade leve, 
        consciente e, acima de tudo, elegante em sua essência.
      </p>
      <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'var(--text-muted)', maxWidth: '800px', marginTop: 'var(--space-md)' }}>
        Nossa curadoria de livros e infoprodutos é feita com muito carinho, buscando sempre 
        as melhores práticas e evidências para ajudar você e sua família a florescerem.
      </p>
    </div>
  );
}
