import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = '/';
  const user = await currentUser();
  if (!user || !user.username) {
    return NextResponse.redirect(url);
  }
  try {
    await prisma.user.create({
      data: {
        userId: user.id,
        username: user.username,
        email: user.emailAddresses[0].emailAddress,
        imageUrl: user.imageUrl,
        password: 'defaultPassword',
        role: 'user',
        theme: 'light'
      }
    });
  } catch (error) {}
  return NextResponse.redirect(url);
}

export const dynamic = 'force-dynamic';
