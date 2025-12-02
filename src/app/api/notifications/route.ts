import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// GET notifications for user
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const unreadOnly = request.nextUrl.searchParams.get('unreadOnly') === 'true';

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        ...(unreadOnly && { read: false }),
      },
      include: { task: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// POST create notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, title, message, taskId, sendEmail, userEmail } = body;

    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { error: 'userId, type, title, and message are required' },
        { status: 400 }
      );
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        taskId: taskId || null,
        sentAt: new Date(),
      },
    });

    // Send email if requested
    if (sendEmail && userEmail) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: userEmail,
          subject: title,
          html: `
            <h2>${title}</h2>
            <p>${message}</p>
            <p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="
                display: inline-block;
                background-color: #3b82f6;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 4px;
              ">
                View in Task Tackler
              </a>
            </p>
          `,
        });
      } catch (emailError) {
        console.error('Email send error:', emailError);
        // Continue even if email fails
      }
    }

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

// PUT mark as read
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      );
    }

    const notification = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}

// DELETE notification
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      );
    }

    await prisma.notification.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    );
  }
}
