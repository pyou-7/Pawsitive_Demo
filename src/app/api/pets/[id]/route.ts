import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/pets/[id] - Get a specific pet
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ownerId = request.headers.get('x-owner-id');
    
    if (!ownerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pet = await prisma.pet.findFirst({
      where: { id, ownerId },
      include: {
        activityLogs: {
          orderBy: { loggedAt: 'desc' },
          take: 30,
        },
        carePlans: {
          orderBy: { date: 'desc' },
          take: 7,
        },
      },
    });

    if (!pet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
    }

    return NextResponse.json({ pet });
  } catch (error) {
    console.error('Get pet error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/pets/[id] - Update a pet
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ownerId = request.headers.get('x-owner-id');
    
    if (!ownerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, breed, weightLbs, ageYears, photoUrl, currentStreak } = body;

    const pet = await prisma.pet.findFirst({
      where: { id, ownerId },
    });

    if (!pet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
    }

    const updatedPet = await prisma.pet.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(breed && { breed }),
        ...(weightLbs !== undefined && { weightLbs }),
        ...(ageYears !== undefined && { ageYears }),
        ...(photoUrl && { photoUrl }),
        ...(currentStreak !== undefined && { currentStreak }),
      },
    });

    return NextResponse.json({ pet: updatedPet });
  } catch (error) {
    console.error('Update pet error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/pets/[id] - Delete a pet
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ownerId = request.headers.get('x-owner-id');
    
    if (!ownerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pet = await prisma.pet.findFirst({
      where: { id, ownerId },
    });

    if (!pet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
    }

    await prisma.pet.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete pet error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
