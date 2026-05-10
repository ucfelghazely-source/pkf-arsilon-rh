import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const dbUser = await prisma.user.findUnique({ where: { email: session.user.email! } })
  if (!dbUser) return NextResponse.json({ notifications: [] })

  const notifications = await prisma.notification.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  return NextResponse.json({ notifications })
}

export async function PATCH() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const dbUser = await prisma.user.findUnique({ where: { email: session.user.email! } })
  if (!dbUser) return NextResponse.json({ ok: true })

  await prisma.notification.updateMany({
    where: { userId: dbUser.id, isRead: false },
    data: { isRead: true },
  })

  return NextResponse.json({ ok: true })
}
