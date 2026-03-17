import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Book } from '@/data/books';

const DATA_PATH = path.join(process.cwd(), 'src/data/books.json');

async function getBooks(): Promise<Book[]> {
  const data = await fs.readFile(DATA_PATH, 'utf-8');
  return JSON.parse(data);
}

async function saveBooks(books: Book[]): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(books, null, 2));
}

export async function GET() {
  try {
    const books = await getBooks();
    return NextResponse.json(books);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  }
}

import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const books = await getBooks();
    
    if (body.id) {
      // Update
      const index = books.findIndex(b => b.id === body.id);
      if (index !== -1) {
        books[index] = { ...books[index], ...body };
      }
    } else {
      // Create
      const newBook: Book = {
        title: body.title,
        description: body.description,
        price: body.price,
        imageUrl: body.imageUrl,
        checkoutUrl: body.checkoutUrl,
        category: body.category,
        id: Date.now().toString(),
        slug: body.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
      };
      books.push(newBook);
    }
    
    await saveBooks(books);
    
    // Revalidate public pages
    revalidatePath('/');
    revalidatePath('/livros');
    if (body.slug) revalidatePath(`/livros/${body.slug}`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save book' }, { status: 500 });
  }
}
