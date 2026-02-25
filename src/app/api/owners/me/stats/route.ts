import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/owner/stats - Get owner stats and dashboard data
export async function GET(request: NextRequest) {
  try {
    const ownerId = request.headers.get('x-owner-id');
    if (!ownerId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const owner = await prisma.owner.findUnique({
      where: { id: ownerId },
      include: {
        pets: {
          include: {
            activityLogs: {
              orderBy: { loggedAt: 'desc' },
              take: 7,
            },
          },
        },
      },
    });

    if (!owner) {
      return NextResponse.json({ error: 'Owner not found' }, { status: 404 });
    }

    // Calculate stats
    const totalPets = owner.pets.length;
    const totalXp = owner.xpBalance;
    
    // Get streak data for each pet
    const petStats = owner.pets.map((pet) => ({
      id: pet.id,
      name: pet.name,
      currentStreak: pet.currentStreak,
      recentActivities: pet.activityLogs.length,
    }));

    // Calculate 7-day activity summary
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentLogs = await prisma.activityLog.findMany({
      where: {
        pet: { ownerId },
        loggedAt: { gte: sevenDaysAgo },
      },
    });

    const activityByDay = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];
      
      const dayLogs = recentLogs.filter(
        (log) => log.loggedAt.toISOString().split('T')[0] === dateStr
      );
      
      return {
        date: dateStr,
        count: dayLogs.length,
        walks: dayLogs.filter((l) => l.activityType === 'WALK').length,
        meals: dayLogs.filter((l) => l.activityType === 'MEAL').length,
      };
    });

    return NextResponse.json({
      owner: {
        id: owner.id,
        email: owner.email,
        name: owner.name,
        xpBalance: totalXp,
      },
      totalPets,
      petStats,
      activityByDay,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
