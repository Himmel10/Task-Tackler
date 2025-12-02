import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET shared tasks for user
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const sharedTasks = await prisma.sharedTask.findMany({
      where: {
        userId,
      },
      include: {
        task: {
          include: { subtasks: true },
        },
        owner: true,
      },
    });

    return NextResponse.json(sharedTasks);
  } catch (error) {
    console.error('Error fetching shared tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shared tasks' },
      { status: 500 }
    );
  }
}

// POST share a task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId, ownerId, userId, permission, userEmail } = body;

    if (!taskId || !ownerId || !userId) {
      return NextResponse.json(
        { error: 'taskId, ownerId, and userId are required' },
        { status: 400 }
      );
    }

    // Check if already shared
    const existing = await prisma.sharedTask.findUnique({
      where: {
        taskId_userId: {
          taskId,
          userId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Task already shared with this user' },
        { status: 400 }
      );
    }

    const sharedTask = await prisma.sharedTask.create({
      data: {
        taskId,
        ownerId,
        userId,
        permission: permission || 'VIEW',
      },
      include: {
        task: true,
      },
    });

    // Send notification
    if (userEmail) {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          type: 'SHARED',
          title: 'Task Shared With You',
          message: `A task has been shared with you: "${sharedTask.task.title}"`,
          taskId,
          sendEmail: true,
          userEmail,
        }),
      });
    }

    return NextResponse.json(sharedTask, { status: 201 });
  } catch (error) {
    console.error('Error sharing task:', error);
    return NextResponse.json(
      { error: 'Failed to share task' },
      { status: 500 }
    );
  }
}

// PUT update share permission
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, permission } = body;

    if (!id || !permission) {
      return NextResponse.json(
        { error: 'id and permission are required' },
        { status: 400 }
      );
    }

    const sharedTask = await prisma.sharedTask.update({
      where: { id },
      data: { permission },
    });

    return NextResponse.json(sharedTask);
  } catch (error) {
    console.error('Error updating share permission:', error);
    return NextResponse.json(
      { error: 'Failed to update permission' },
      { status: 500 }
    );
  }
}

// DELETE unshare task
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Share ID is required' },
        { status: 400 }
      );
    }

    await prisma.sharedTask.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting share:', error);
    return NextResponse.json(
      { error: 'Failed to delete share' },
      { status: 500 }
    );
  }
}
