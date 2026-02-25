import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createLogSchema = z.object({
  petId: z.string(),
  activityType: z.enum(['WALK', 'MEAL', 'SYMPTOM_CHECK']),
  value: z.number().min(0),
  notes: z.string().optional().nullable(),
  idempotencyKey: z.string().optional().nullable(),
});

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
    const parseResult = createLogSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ error: 'Validation failed', details: parseResult.error.format() }, { status: 400 });
    }

    const { petId, activityType, value, notes, idempotencyKey } = parseResult.data;

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
          idempotencyKey,
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
        idempotencyKey: idempotencyKey || null,
      },
    });

    // Award XP for logging activity
    await prisma.owner.update({
      where: { id: ownerId },
      data: { xpBalance: { increment: 10 } },
    });

    // Update streak AFTER log creation
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

  // Check how many activities happened today.
  // We just created one, so if count > 1, the streak increment was already handled today.
  const todayActivitiesCount = await prisma.activityLog.count({
    where: {
      petId,
      loggedAt: { gte: today },
    },
  });

  if (todayActivitiesCount > 1) return; // Streak already handled

  // This is the first activity of the day. Get the last activity BEFORE today:
  const lastActivityBeforeToday = await prisma.activityLog.findFirst({
    where: {
      petId,
      loggedAt: { lt: today }
    },
    orderBy: { loggedAt: 'desc' },
  });

  if (!lastActivityBeforeToday) {
    // Very first activity ever logged for this pet
    await prisma.pet.update({
      where: { id: petId },
      data: { currentStreak: 1 },
    });
    return;
  }

  const lastDate = new Date(lastActivityBeforeToday.loggedAt);
  lastDate.setHours(0, 0, 0, 0);

  if (lastDate.getTime() === yesterday.getTime()) {
    // Last activity was yesterday, increment streak
    await prisma.pet.update({
      where: { id: petId },
      data: { currentStreak: { increment: 1 } },
    });
  } else {
    // Streak broken, reset to 1
    await prisma.pet.update({
      where: { id: petId },
      data: { currentStreak: 1 },
    });
  }
}
