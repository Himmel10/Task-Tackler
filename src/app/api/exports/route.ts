import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stringify } from 'csv-stringify/sync';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, format } = body;

    if (!userId || !format) {
      return NextResponse.json(
        { error: 'User ID and format are required' },
        { status: 400 }
      );
    }

    // Get all tasks for user
    const tasks = await prisma.task.findMany({
      where: { userId },
      include: { subtasks: true },
    });

    let fileContent: string;
    let mimeType: string;
    let fileName: string;

    if (format === 'JSON') {
      fileContent = JSON.stringify(tasks, null, 2);
      mimeType = 'application/json';
      fileName = `tasks-export-${new Date().toISOString().split('T')[0]}.json`;
    } else if (format === 'CSV') {
      const rows = tasks.flatMap((task: any) => [
        {
          id: task.id,
          title: task.title,
          description: task.description || '',
          category: task.category,
          priority: task.priority,
          status: task.status,
          dueDate: task.dueDate?.toISOString() || '',
          completed: task.completedAt ? 'Yes' : 'No',
          createdAt: task.createdAt.toISOString(),
        },
        ...task.subtasks.map((sub: any) => ({
          id: `  └─ ${sub.id}`,
          title: `  └─ ${sub.title}`,
          description: '',
          category: '',
          priority: '',
          status: sub.completed ? 'COMPLETED' : 'TODO',
          dueDate: '',
          completed: sub.completed ? 'Yes' : 'No',
          createdAt: sub.createdAt.toISOString(),
        })),
      ]);

      fileContent = stringify(rows, { header: true });
      mimeType = 'text/csv';
      fileName = `tasks-export-${new Date().toISOString().split('T')[0]}.csv`;
    } else {
      return NextResponse.json(
        { error: 'Unsupported export format' },
        { status: 400 }
      );
    }

    // Save export record
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // Expire after 30 days

    const exportRecord = await prisma.export.create({
      data: {
        userId,
        format,
        fileName,
        taskCount: tasks.length,
        expiresAt,
      },
    });

    return NextResponse.json(
      {
        id: exportRecord.id,
        fileName,
        content: fileContent,
        format,
      },
      {
        headers: {
          'Content-Type': mimeType,
          'Content-Disposition': `attachment; filename="${fileName}"`,
        },
      }
    );
  } catch (error) {
    console.error('Error exporting tasks:', error);
    return NextResponse.json(
      { error: 'Failed to export tasks' },
      { status: 500 }
    );
  }
}

// GET export history
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const exports = await prisma.export.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(exports);
  } catch (error) {
    console.error('Error fetching exports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exports' },
      { status: 500 }
    );
  }
}
