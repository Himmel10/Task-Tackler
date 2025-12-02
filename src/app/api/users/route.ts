import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';

// GET user by ID or email
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('id');
    const email = request.nextUrl.searchParams.get('email');

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      return NextResponse.json(user || { error: 'User not found' }, { status: user ? 200 : 404 });
    }

    if (email) {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      return NextResponse.json(user || { error: 'User not found' }, { status: user ? 200 : 404 });
    }

    return NextResponse.json({ error: 'ID or email required' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

// POST create or sync user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, email, username, password, role } = body;

    if (!email || !username) {
      return NextResponse.json(
        { error: 'Email and username are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(existingUser);
    }

    // Create new user
    const hashedPassword = password ? await bcrypt.hash(password, 10) : '';
    
    const newUser = await prisma.user.create({
      data: {
        id: id || undefined,
        email,
        username,
        password: hashedPassword,
        role: (role as any) || 'USER',
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// PUT update user
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
