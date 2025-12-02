import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

// GET not allowed for this endpoint
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

// POST quick demo user for testing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, password } = body;

    // Create or get user
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const hashedPassword = await bcrypt.hash(password || 'test123', 10);
      user = await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          role: 'USER',
        },
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error creating demo user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
