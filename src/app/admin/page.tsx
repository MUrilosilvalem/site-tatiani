'use client';

import { useState, useEffect } from 'react';
import { Book } from '@/data/books';
import styles from './admin.module.css';
import { signOut } from 'next-auth/react';

type Tab = 'books' | 'blog' | 'content';

interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  imageUrl?: string;
  category: string;
  published: boolean;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('books');

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Painel Administrativo</h1>
        <button onClick={() => signOut()} className={styles.logoutBtn}>Sair</button>
      </div>

      <nav className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'books' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('books')}
        >
          Livros
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'blog' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('blog')}
        >
          Blog & Dicas
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'content' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('content')}
        >
          Textos do Site
        </button>
      </nav>
      
      {activeTab === 'books' && <BookManager />}
      {activeTab === 'blog' && <BlogManager />}
      {activeTab === 'content' && <ContentManager />}
    </div>
  );
}

function BookManager() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({
    title: '',
    description: '',
    price: 0,
    checkoutUrl: '',
    category: 'E-book',
    isFeatured: false,
    imageList: ['']
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

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'price' ? parseFloat(value) : value)
    }));
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newImageList = [...formData.imageList];
    newImageList[index] = value;
    setFormData((prev: any) => ({ ...prev, imageList: newImageList }));
  };

  const addImageUrlField = () => {
    setFormData((prev: any) => ({ ...prev, imageList: [...prev.imageList, ''] }));
  };

  const removeImageUrlField = (index: number) => {
    const newImageList = formData.imageList.filter((_: any, i: number) => i !== index);
    setFormData((prev: any) => ({ ...prev, imageList: newImageList.length > 0 ? newImageList : [''] }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formDataUpload
    });

    if (res.ok) {
      const { url } = await res.json();
      handleImageUrlChange(index, url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      imageUrls: formData.imageList.filter((url: string) => url.trim() !== ''),
      id: isEditing || undefined
    };

    const res = await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      setIsEditing(null);
      setFormData({
        title: '',
        description: '',
        price: 0,
        checkoutUrl: '',
        category: 'E-book',
        isFeatured: false,
        imageList: ['']
      });
      fetchBooks();
    }
  };

  const startEdit = (book: any) => {
    setIsEditing(book.id);
    setFormData({
      ...book,
      imageList: book.images?.length > 0 ? book.images.map((img: any) => img.url) : ['']
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div>Carregando livros...</div>;

  return (
    <>
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
            <div className={styles.field} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '25px' }}>
              <input 
                type="checkbox" 
                name="isFeatured" 
                id="isFeatured"
                checked={formData.isFeatured} 
                onChange={handleInputChange} 
              />
              <label htmlFor="isFeatured" style={{ marginBottom: 0 }}>Marcar como Destaque</label>
            </div>
          </div>

          <div className={styles.field}>
            <label>Imagens do Livro (Carrossel)</label>
            {formData.imageList.map((url: string, index: number) => (
              <div key={index} className={styles.imageInputGroup} style={{ marginBottom: '10px' }}>
                <input 
                  value={url} 
                  onChange={(e) => handleImageUrlChange(index, e.target.value)} 
                  placeholder="URL da imagem" 
                  required 
                />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleFileChange(e, index)} 
                  className={styles.fileInput} 
                />
                {formData.imageList.length > 1 && (
                  <button type="button" onClick={() => removeImageUrlField(index)} className={styles.removeBtn}>×</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addImageUrlField} className={styles.addBtn}>+ Adicionar Outra Imagem</button>
          </div>

          <div className={styles.field}>
            <label>URL de Checkout Externo</label>
            <input name="checkoutUrl" value={formData.checkoutUrl} onChange={handleInputChange} required />
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn}>{isEditing ? 'Atualizar Livro' : 'Salvar Livro'}</button>
            {isEditing && <button type="button" onClick={() => setIsEditing(null)} className={styles.cancelBtn}>Cancelar</button>}
          </div>
        </form>
      </section>

      <section className={styles.listSection}>
        <table className={styles.table}>
          <thead><tr><th>Título</th><th>Destaque</th><th>Preço</th><th>Ações</th></tr></thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td style={{ textAlign: 'center' }}>{book.isFeatured ? '⭐' : '-'}</td>
                <td>{book.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
              <td>
                  <button onClick={() => startEdit(book)} className={styles.editBtn}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

function BlogManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({
    title: '',
    content: '',
    category: 'Dicas',
    imageUrl: '',
    published: true
  });

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    const res = await fetch('/api/posts');
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  };

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isEditing ? { ...formData, id: isEditing } : formData)
    });
    if (res.ok) {
      setIsEditing(null);
      setFormData({ title: '', content: '', category: 'Dicas', imageUrl: '', published: true });
      fetchPosts();
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm('Deseja excluir este post?')) return;
    const res = await fetch(`/api/posts?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchPosts();
  };

  if (loading) return <div>Carregando posts...</div>;

  return (
    <>
      <section className={styles.formSection}>
        <h2>{isEditing ? 'Editar Post' : 'Novo Post'}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}><label>Título</label><input name="title" value={formData.title} onChange={handleInputChange} required /></div>
          <div className={styles.field}><label>Categoria</label><input name="category" value={formData.category} onChange={handleInputChange} required /></div>
          <div className={styles.field}><label>Conteúdo</label><textarea name="content" value={formData.content} onChange={handleInputChange} required rows={8} /></div>
          <div className={styles.field}><label>URL da Imagem Capa</label><input name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} /></div>
          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn}>{isEditing ? 'Atualizar Post' : 'Publicar Post'}</button>
            {isEditing && <button type="button" onClick={() => setIsEditing(null)} className={styles.cancelBtn}>Cancelar</button>}
          </div>
        </form>
      </section>

      <section className={styles.listSection}>
        <table className={styles.table}>
          <thead><tr><th>Título</th><th>Categoria</th><th>Ações</th></tr></thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>{post.category}</td>
                <td>
                  <button onClick={() => { setIsEditing(post.id); setFormData(post); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={styles.editBtn}>Editar</button>
                  <button onClick={() => deletePost(post.id)} className={styles.deleteBtn}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

const DEFAULT_CONTENT = [
  { key: 'site.logo.text', label: 'Site - Texto do Logo', type: 'text' },
  { key: 'site.logo.image', label: 'Site - URL do Logo (Opcional)', type: 'image' },
  { key: 'home.hero.title', label: 'Home - Título Hero', type: 'text' },
  { key: 'home.hero.subtitle', label: 'Home - Subtítulo Hero', type: 'textarea' },
  { key: 'home.hero.image', label: 'Home - Imagem Hero', type: 'image' },
  { key: 'home.about.title', label: 'Sobre - Título', type: 'text' },
  { key: 'home.about.text', label: 'Sobre - Texto', type: 'textarea' },
];

function ContentManager() {
  const [contents, setContents] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchContent(); }, []);

  const fetchContent = async () => {
    const res = await fetch('/api/content');
    const data = await res.json();
    const mapped = data.reduce((acc: any, curr: any) => ({ ...acc, [curr.key]: curr.value }), {});
    setContents(mapped);
    setLoading(false);
  };

  const handleSaveContent = async (key: string, value: string) => {
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    });
    if (res.ok) {
      alert('Contéudo atualizado com sucesso!');
      fetchContent();
    }
  };

  const handleFileUpload = async (key: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      setContents(prev => ({ ...prev, [key]: data.url }));
      await handleSaveContent(key, data.url);
    }
  };

  if (loading) return <div>Carregando conteúdos...</div>;

  return (
    <section className={styles.formSection}>
      <h2>Editar Conteúdo do Site</h2>
      <div className={styles.contentList}>
        {DEFAULT_CONTENT.map(item => (
          <div key={item.key} className={styles.contentItem}>
            <label>{item.label}</label>
            {item.type === 'text' && (
              <input 
                value={contents[item.key] || ''} 
                onChange={(e) => setContents(prev => ({ ...prev, [item.key]: e.target.value }))}
              />
            )}
            {item.type === 'textarea' && (
              <textarea 
                rows={4}
                value={contents[item.key] || ''} 
                onChange={(e) => setContents(prev => ({ ...prev, [item.key]: e.target.value }))}
              />
            )}
            {item.type === 'image' && (
              <div className={styles.imageControl}>
                <input 
                  type="text"
                  placeholder="URL da imagem..."
                  value={contents[item.key] || ''} 
                  onChange={(e) => setContents(prev => ({ ...prev, [item.key]: e.target.value }))}
                />
                <input 
                  type="file" 
                  accept="image/*"
                  className={styles.fileInput}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(item.key, file);
                  }}
                />
                {contents[item.key] && (
                  <img src={contents[item.key]} alt="Preview" className={styles.previewImage} />
                )}
              </div>
            )}
            <button 
              className={styles.saveContentBtn}
              onClick={() => handleSaveContent(item.key, contents[item.key] || '')}
            >
              Salvar Alteração
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
