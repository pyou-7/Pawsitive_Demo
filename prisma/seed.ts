import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding Demo data...')

    // Create Demo Owner
    const demoOwner = await prisma.owner.upsert({
        where: { email: 'demo@example.com' },
        update: {},
        create: {
            id: 'demo', // Hardcoded 'demo' ID for the hackathon UI fallback
            authId: 'demo-auth-id',
            email: 'demo@example.com',
            name: 'Judge Demo',
            xpBalance: 150,
        },
    })

    // Create Demo Pet
    const demoPet = await prisma.pet.upsert({
        where: { id: 'demo-pet-id' },
        update: {},
        create: {
            id: 'demo-pet-id',
            ownerId: demoOwner.id,
            name: 'Buddy',
            breed: 'Golden Retriever',
            ageYears: 3,
            weightLbs: 65.5,
            currentStreak: 5,
        },
    })

    // Add some sample activity logs for the last few days to make the AI Care Plan work
    const today = new Date()
    for (let i = 1; i <= 3; i++) {
        const logDate = new Date(today)
        logDate.setDate(logDate.getDate() - i)
        logDate.setHours(8, 0, 0, 0)

        await prisma.activityLog.create({
            data: {
                petId: demoPet.id,
                activityType: 'WALK',
                value: 30 + i * 5,
                notes: `Morning walk in the park ${i} days ago`,
                loggedAt: logDate,
            },
            // ignore unique constraints on seed by not explicitly preventing them
        })
    }

    console.log('Seed completed with Demo Owner/Pet.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
