import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { detectBreedFromImage } from '@/lib/gemini';
import { z } from 'zod';

const createPetSchema = z.object({
  name: z.string().min(1, 'Pet name is required').max(100),
  photoUrl: z.string().url().optional().nullable(),
  breed: z.string().max(100).optional().nullable(),
  weightLbs: z.number().positive().max(500).optional().nullable(),
  ageYears: z.number().int().min(0).max(30).optional().nullable(),
});

// GET /api/pets - Get all pets for the authenticated owner
export async function GET(request: NextRequest) {
  try {
    const ownerId = request.headers.get('x-owner-id');
    if (!ownerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pets = await prisma.pet.findMany({
      where: { ownerId },
      include: {
        activityLogs: {
          orderBy: { loggedAt: 'desc' },
          take: 10,
        },
        carePlans: {
          orderBy: { date: 'desc' },
          take: 7,
        },
      },
    });

    return NextResponse.json({ pets });
  } catch (error) {
    console.error('Get pets error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/pets - Create a new pet with AI breed detection
export async function POST(request: NextRequest) {
  try {
    const ownerId = request.headers.get('x-owner-id');
    if (!ownerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate request body with Zod
    const validation = createPetSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 422 }
      );
    }

    const { name, photoUrl, breed, weightLbs, ageYears } = validation.data;

    // If photo URL provided, run AI breed detection
    let aiData = null;
    if (photoUrl) {
      try {
        aiData = await detectBreedFromImage(photoUrl);
      } catch (aiError) {
        console.error('AI detection failed:', aiError);
        // Continue without AI data if it fails
      }
    }

    const pet = await prisma.pet.create({
      data: {
        ownerId,
        name,
        photoUrl: photoUrl || null,
        breed: breed || aiData?.breed || null,
        weightLbs: weightLbs || null,
        ageYears: ageYears || aiData?.estimatedAge || null,
      },
    });

    // Award XP for creating a pet profile
    await prisma.owner.update({
      where: { id: ownerId },
      data: { xpBalance: { increment: 50 } },
    });

    return NextResponse.json({ pet, aiData });
  } catch (error) {
    console.error('Create pet error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
