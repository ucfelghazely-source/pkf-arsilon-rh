import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const approver = await prisma.user.findUnique({ where: { email: session.user.email! } })
  if (!approver) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const request = await prisma.remoteWorkRequest.findUnique({ where: { id } })
  if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const { action, reason } = body

  if (action === 'approve') {
    if (approver.role !== 'MANAGER' && approver.role !== 'RH' && approver.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    const weekUsed = await prisma.remoteWorkRequest.count({
      where: {
        userId: request.userId,
        weekNumber: request.weekNumber,
        yearNumber: request.yearNumber,
        status: 'APPROVED',
        id: { not: id },
      },
    })
    if (weekUsed >= 2) {
      return NextResponse.json({ error: 'Quota 2j/semaine déjà atteint pour ce collaborateur' }, { status: 400 })
    }
    const updated = await prisma.remoteWorkRequest.update({ where: { id }, data: { status: 'APPROVED' } })
    await prisma.approval.create({
      data: { approverId: approver.id, remoteWorkRequestId: id, status: 'APPROVED', step: 1 },
    })
    await prisma.notification.create({
      data: {
        userId: request.userId,
        title: 'Demande TT approuvée',
        body: `Votre demande TT a été approuvée par ${approver.firstName} ${approver.lastName}`,
        type: 'TT',
        remoteWorkRequestId: id,
      },
    })
    return NextResponse.json({ request: updated })
  }

  if (action === 'refuse') {
    if (approver.role !== 'MANAGER' && approver.role !== 'RH' && approver.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    const updated = await prisma.remoteWorkRequest.update({
      where: { id },
      data: { status: 'REFUSED', refusedReason: reason ?? 'Refusé' },
    })
    await prisma.notification.create({
      data: {
        userId: request.userId,
        title: 'Demande TT refusée',
        body: `Votre demande TT a été refusée : ${reason ?? 'Refusé par le manager'}`,
        type: 'TT',
        remoteWorkRequestId: id,
      },
    })
    return NextResponse.json({ request: updated })
  }

  if (action === 'cancel') {
    if (request.userId !== approver.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    if (request.status !== 'PENDING_MANAGER') {
      return NextResponse.json({ error: 'Impossible d\'annuler' }, { status: 400 })
    }
    const updated = await prisma.remoteWorkRequest.update({
      where: { id },
      data: { status: 'CANCELLED', refusedReason: 'Annulé par le collaborateur' },
    })
    return NextResponse.json({ request: updated })
  }

  return NextResponse.json({ error: 'Action invalide' }, { status: 400 })
}
