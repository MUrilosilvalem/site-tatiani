import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const post = await prisma.post.findUnique({
        where: { slug }
      });
      return NextResponse.json(post);
    }

    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Fetch posts error:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, title, content, imageUrl, category, published } = body;

    const slug = title.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');

    if (id) {
      const updatedPost = await prisma.post.update({
        where: { id },
        data: { title, content, imageUrl, category, published, slug }
      });
      return NextResponse.json({ success: true, post: updatedPost });
    } else {
      const newPost = await prisma.post.create({
        data: { title, content, imageUrl, category, published, slug }
      });
      return NextResponse.json({ success: true, post: newPost });
    }
  } catch (error) {
    console.error('Save post error:', error);
    return NextResponse.json({ error: 'Failed to save post' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await prisma.post.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete post error:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
