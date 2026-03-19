import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      include: { images: true },
      orderBy: { createdAt: 'desc' }
    });
    
    // Converte para o formato esperado pelo frontend se necessário
    const formattedBooks = books.map(book => ({
      ...book,
      imageUrl: book.images[0]?.url || '', // Fallback para a primeira imagem
    }));

    return NextResponse.json(formattedBooks);
  } catch (error) {
    console.error('Fetch books error:', error);
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, title, description, price, imageUrls, checkoutUrl, category, isFeatured } = body;

    const slug = title.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');

    if (id) {
      // Update
      const updatedBook = await prisma.book.update({
        where: { id },
        data: {
          title,
          description,
          price,
          checkoutUrl,
          category,
          slug,
          isFeatured,
          images: {
            deleteMany: {},
            create: imageUrls && Array.isArray(imageUrls) 
              ? imageUrls.map((url: string) => ({ url })) 
              : []
          }
        }
      });
      return NextResponse.json({ success: true, book: updatedBook });
    } else {
      // Create
      const newBook = await prisma.book.create({
        data: {
          title,
          description,
          price,
          checkoutUrl,
          category,
          slug,
          isFeatured,
          images: {
            create: imageUrls && Array.isArray(imageUrls) 
              ? imageUrls.map((url: string) => ({ url })) 
              : []
          }
        }
      });
      return NextResponse.json({ success: true, book: newBook });
    }
  } catch (error) {
    console.error('Save book error:', error);
    return NextResponse.json({ error: 'Failed to save book' }, { status: 500 });
  }
}
