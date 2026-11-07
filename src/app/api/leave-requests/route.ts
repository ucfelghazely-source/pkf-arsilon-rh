import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const dbUser = await prisma.user.findUnique({ where: { email: session.user.email! } })
  if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const requests = await prisma.leaveRequest.findMany({
    where: { userId: dbUser.id },
    include: { approvals: { include: { approver: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ requests })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const dbUser = await prisma.user.findUnique({ where: { email: session.user.email! } })
  if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const body = await req.json()
  const { startDate, endDate, leaveType, workingDays, reason } = body

  if (!startDate || !endDate || !leaveType || !workingDays) {
    return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
  }

  const request = await prisma.leaveRequest.create({
    data: {
      userId: dbUser.id,
      leaveType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      workingDays,
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
        title: 'Demande CP en attente',
        body: `${dbUser.firstName} ${dbUser.lastName} — Demande CP en attente de validation`,
        type: 'CP',
        leaveRequestId: request.id,
      },
    })
  }

  return NextResponse.json({ request }, { status: 201 })
}
