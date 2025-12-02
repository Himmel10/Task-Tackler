import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const taskId = request.nextUrl.searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    const subtasks = await prisma.subtask.findMany({
      where: { taskId },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(subtasks);
  } catch (error) {
    console.error('Error fetching subtasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subtasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, taskId, userId } = body;

    if (!title || !taskId || !userId) {
      return NextResponse.json(
        { error: 'Title, taskId, and userId are required' },
        { status: 400 }
      );
    }

    // Get max order
    const maxOrder = await prisma.subtask.aggregate({
      where: { taskId },
      _max: { order: true },
    });

    const subtask = await prisma.subtask.create({
      data: {
        title,
        taskId,
        userId,
        order: (maxOrder._max.order || 0) + 1,
      },
    });

    return NextResponse.json(subtask, { status: 201 });
  } catch (error) {
    console.error('Error creating subtask:', error);
    return NextResponse.json(
      { error: 'Failed to create subtask' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Subtask ID is required' },
        { status: 400 }
      );
    }

    const subtask = await prisma.subtask.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(subtask);
  } catch (error) {
    console.error('Error updating subtask:', error);
    return NextResponse.json(
      { error: 'Failed to update subtask' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Subtask ID is required' },
        { status: 400 }
      );
    }

    await prisma.subtask.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting subtask:', error);
    return NextResponse.json(
      { error: 'Failed to delete subtask' },
      { status: 500 }
    );
  }
}
