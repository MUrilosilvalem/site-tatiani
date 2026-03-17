'use client';

import { useState, useEffect } from 'react';
import { Book } from '@/data/books';
import styles from './admin.module.css';

export default function AdminPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Book>>({
    title: '',
    description: '',
    price: 0,
    imageUrl: '',
    checkoutUrl: '',
    category: 'E-book'
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const res = await fetch('/api/books');
    const data = await res.json();
    setBooks(data);
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      const { url } = await res.json();
      setFormData(prev => ({ ...prev, imageUrl: url }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isEditing ? { ...formData, id: isEditing } : formData)
    });

    if (res.ok) {
      setIsEditing(null);
      setFormData({
        title: '',
        description: '',
        price: 0,
        imageUrl: '',
        checkoutUrl: '',
        category: 'E-book'
      });
      fetchBooks();
    }
  };

  const startEdit = (book: Book) => {
    setIsEditing(book.id);
    setFormData(book);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div className="container">Carregando...</div>;

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>Painel Administrativo</h1>
      
      <section className={styles.formSection}>
        <h2>{isEditing ? 'Editar Livro' : 'Adicionar Novo Livro'}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Título</label>
            <input name="title" value={formData.title} onChange={handleInputChange} required />
          </div>
          
          <div className={styles.field}>
            <label>Categoria</label>
            <select name="category" value={formData.category} onChange={handleInputChange}>
              <option value="E-book">E-book</option>
              <option value="Curso">Curso</option>
              <option value="Material Físico">Material Físico</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Descrição</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} required />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Preço (R$)</label>
              <input type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} required />
            </div>
          </div>

          <div className={styles.field}>
            <label>Imagem do Livro</label>
            <div className={styles.imageInputGroup}>
              <input name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} placeholder="URL da imagem (ou faça upload)" required />
              <input type="file" accept="image/*" onChange={handleFileChange} className={styles.fileInput} />
            </div>
          </div>

          <div className={styles.field}>
            <label>URL de Checkout Externo</label>
            <input name="checkoutUrl" value={formData.checkoutUrl} onChange={handleInputChange} required />
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn}>
              {isEditing ? 'Atualizar Livro' : 'Salvar Livro'}
            </button>
            {isEditing && (
              <button type="button" onClick={() => setIsEditing(null)} className={styles.cancelBtn}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className={styles.listSection}>
        <h2>Livros Cadastrados</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Título</th>
              <th>Preço</th>
              <th>Categoria</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td>{book.category}</td>
                <td>
                  <button onClick={() => startEdit(book)} className={styles.editBtn}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
