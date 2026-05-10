import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const dbUser = await prisma.user.findUnique({ where: { email: session.user.email! } })
  if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const requests = await prisma.remoteWorkRequest.findMany({
    where: { userId: dbUser.id },
    orderBy: { date: 'desc' },
  })

  return NextResponse.json({ requests })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const dbUser = await prisma.user.findUnique({ where: { email: session.user.email! } })
  if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const body = await req.json()
  const { date, weekNumber, yearNumber, reason } = body

  if (!date || !weekNumber || !yearNumber) {
    return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
  }

  // Vérification quota 2j/semaine
  const weekUsed = await prisma.remoteWorkRequest.count({
    where: {
      userId: dbUser.id,
      weekNumber,
      yearNumber,
      status: { in: ['APPROVED', 'PENDING_MANAGER'] },
    },
  })

  if (weekUsed >= 2) {
    return NextResponse.json({ error: 'Quota 2j/semaine déjà atteint pour cette semaine' }, { status: 400 })
  }

  // Vérification pas de doublon même date
  const existingDate = await prisma.remoteWorkRequest.findFirst({
    where: {
      userId: dbUser.id,
      date: new Date(date),
      status: { in: ['APPROVED', 'PENDING_MANAGER'] },
    },
  })
  if (existingDate) {
    return NextResponse.json({ error: 'Une demande TT existe déjà pour cette date' }, { status: 400 })
  }

  const request = await prisma.remoteWorkRequest.create({
    data: {
      userId: dbUser.id,
      type: 'REGULAR',
      date: new Date(date),
      weekNumber,
      yearNumber,
      reason,
      status: 'PENDING_MANAGER',
    },
  })

  // Notification au manager
  const manager = await prisma.user.findFirst({ where: { role: 'MANAGER' } })
  if (manager) {
    await prisma.notification.create({
      data: {
        userId: manager.id,
        title: 'Demande TT en attente',
        body: `${dbUser.firstName} ${dbUser.lastName} — Demande TT en attente`,
        type: 'TT',
        remoteWorkRequestId: request.id,
      },
    })
  }

  return NextResponse.json({ request }, { status: 201 })
}
