import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (key) {
      const content = await prisma.pageContent.findUnique({
        where: { key }
      });
      return NextResponse.json(content);
    }

    const contents = await prisma.pageContent.findMany();
    return NextResponse.json(contents);
  } catch (error) {
    console.error('Fetch content error:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { key, value } = body;

    const content = await prisma.pageContent.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });

    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error('Save content error:', error);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}
