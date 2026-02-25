import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateCarePlan } from '@/lib/gemini';
import { z } from 'zod';

const generatePlanSchema = z.object({
  petId: z.string().min(1),
});

// Simple in-memory rate limiter (5 requests per minute per owner)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

// GET /api/care-plans - Get care plans for a pet
export async function GET(request: NextRequest) {
  try {
    const ownerId = request.headers.get('x-owner-id');
    const petId = request.nextUrl.searchParams.get('petId');

    if (!ownerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!petId) {
      return NextResponse.json({ error: 'petId is required' }, { status: 400 });
    }

    // Verify pet belongs to owner
    const pet = await prisma.pet.findFirst({
      where: { id: petId, ownerId },
    });

    if (!pet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
    }

    const carePlans = await prisma.carePlan.findMany({
      where: { petId },
      orderBy: { date: 'desc' },
      take: 30,
    });

    return NextResponse.json({ carePlans });
  } catch (error) {
    console.error('Get care plans error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/care-plans - Generate a new AI care plan
export async function POST(request: NextRequest) {
  try {
    const ownerId = request.headers.get('x-owner-id');
    if (!ownerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Basic Rate Limiting
    const now = Date.now();
    const limitRecord = rateLimitMap.get(ownerId) || { count: 0, resetAt: now + 60000 };
    if (now > limitRecord.resetAt) {
      limitRecord.count = 1;
      limitRecord.resetAt = now + 60000;
    } else {
      limitRecord.count++;
    }
    rateLimitMap.set(ownerId, limitRecord);

    if (limitRecord.count > 5) {
      return NextResponse.json({ error: 'Too many requests. Please try again in a minute.' }, { status: 429 });
    }

    const body = await request.json();
    const parseResult = generatePlanSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ error: 'Validation failed', details: parseResult.error.format() }, { status: 400 });
    }
    const { petId } = parseResult.data;

    // Verify pet belongs to owner
    const pet = await prisma.pet.findFirst({
      where: { id: petId, ownerId },
      include: {
        activityLogs: {
          orderBy: { loggedAt: 'desc' },
          take: 30,
        },
      },
    });

    if (!pet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
    }

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if there's already a care plan for today
    const existingPlan = await prisma.carePlan.findFirst({
      where: {
        petId,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });

    if (existingPlan) {
      return NextResponse.json({ carePlan: existingPlan, existing: true });
    }

    // Generate AI care plan
    const aiPlan = await generateCarePlan({
      name: pet.name,
      breed: pet.breed || undefined,
      weightLbs: pet.weightLbs || undefined,
      ageYears: pet.ageYears || undefined,
      recentActivities: pet.activityLogs.map((log) => ({
        activityType: log.activityType,
        value: log.value,
        loggedAt: log.loggedAt,
      })),
    });

    // Create care plan
    const carePlan = await prisma.carePlan.create({
      data: {
        petId,
        date: today,
        targetExerciseMins: aiPlan.targetExerciseMins,
        targetCalories: aiPlan.targetCalories,
        aiInsightText: aiPlan.aiInsightText,
        status: 'ACTIVE',
      },
    });

    // Award XP for generating a care plan
    await prisma.owner.update({
      where: { id: ownerId },
      data: { xpBalance: { increment: 25 } },
    });

    return NextResponse.json({ carePlan });
  } catch (error) {
    console.error('Generate care plan error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
