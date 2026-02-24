import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/activity-logs - Get activity logs for a pet
export async function GET(request: NextRequest) {
  try {
    const ownerId = request.headers.get('x-owner-id');
    const petId = request.nextUrl.searchParams.get('petId');
    const days = request.nextUrl.searchParams.get('days');

    if (!ownerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify pet belongs to owner
    if (petId) {
      const pet = await prisma.pet.findFirst({
        where: { id: petId, ownerId },
      });
      if (!pet) {
        return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
      }
    }

    const whereClause: any = petId ? { petId } : {};

    if (days) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(days));
      whereClause.loggedAt = { gte: startDate };
    }

    const logs = await prisma.activityLog.findMany({
      where: whereClause,
      orderBy: { loggedAt: 'desc' },
      include: { pet: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Get activity logs error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/activity-logs - Log a new activity
export async function POST(request: NextRequest) {
  try {
    const ownerId = request.headers.get('x-owner-id');
    if (!ownerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { petId, activityType, value, notes, idempotencyKey } = body;

    if (!petId || !activityType || value === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate activity type
    const validTypes = ['WALK', 'MEAL', 'SYMPTOM_CHECK'];
    if (!validTypes.includes(activityType)) {
      return NextResponse.json({ error: 'Invalid activity type' }, { status: 400 });
    }

    // Verify pet belongs to owner
    const pet = await prisma.pet.findFirst({
      where: { id: petId, ownerId },
    });

    if (!pet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
    }

    // Check idempotency key to prevent double-logging
    if (idempotencyKey) {
      const existing = await prisma.activityLog.findFirst({
        where: {
          petId,
          activityType: activityType as any,
          notes: idempotencyKey,
        },
      });
      if (existing) {
        return NextResponse.json({ log: existing, idempotent: true });
      }
    }

    const log = await prisma.activityLog.create({
      data: {
        petId,
        activityType: activityType as any,
        value,
        notes: notes || null,
      },
    });

    // Award XP for logging activity
    await prisma.owner.update({
      where: { id: ownerId },
      data: { xpBalance: { increment: 10 } },
    });

    // Update streak
    await updateStreak(petId);

    return NextResponse.json({ log });
  } catch (error) {
    console.error('Create activity log error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to update streak
async function updateStreak(petId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if there's already an activity today
  const todayActivity = await prisma.activityLog.findFirst({
    where: {
      petId,
      loggedAt: { gte: today },
    },
  });

  if (todayActivity) return; // Already logged today

  // Get last activity date
  const lastActivity = await prisma.activityLog.findFirst({
    where: { petId },
    orderBy: { loggedAt: 'desc' },
  });

  if (!lastActivity) return;

  const lastDate = new Date(lastActivity.loggedAt);
  lastDate.setHours(0, 0, 0, 0);

  const pet = await prisma.pet.findUnique({ where: { id: petId } });
  if (!pet) return;

  // If last activity was yesterday, increment streak
  if (lastDate.getTime() === yesterday.getTime()) {
    await prisma.pet.update({
      where: { id: petId },
      data: { currentStreak: { increment: 1 } },
    });
  }
}
