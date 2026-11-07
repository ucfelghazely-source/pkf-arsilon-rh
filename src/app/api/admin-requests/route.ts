import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const dbUser = await prisma.user.findUnique({ where: { email: session.user.email! } })
  if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const body = await req.json()
  const { type, payload } = body

  if (!type) return NextResponse.json({ error: 'Type requis' }, { status: 400 })

  const request = await prisma.adminRequest.create({
    data: {
      userId: dbUser.id,
      type,
      status: 'PENDING_RH',
      payload: payload ? JSON.stringify(payload) : null,
    },
  })

  const rh = await prisma.user.findFirst({ where: { role: 'RH' } })
  if (rh) {
    await prisma.notification.create({
      data: {
        userId: rh.id,
        title: 'Demande administrative',
        body: `${dbUser.firstName} ${dbUser.lastName} — Formulaire ${type.replace(/_/g, ' ')}`,
        type: 'ADM',
        adminRequestId: request.id,
      },
    })
  }

  return NextResponse.json({ request }, { status: 201 })
}
