import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/auth/callback - Handle auth callback from Supabase/Clerk
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const authId = searchParams.get('auth_id');
    const email = searchParams.get('email');
    const name = searchParams.get('name');

    if (!authId || !email) {
      return NextResponse.json({ error: 'Missing auth parameters' }, { status: 400 });
    }

    // Find or create owner based on auth
    let owner = await prisma.owner.findUnique({
      where: { authId },
    });

    if (!owner) {
      owner = await prisma.owner.create({
        data: {
          authId,
          email,
          name: name || null,
        },
      });
    }

    return NextResponse.json({ owner });
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
