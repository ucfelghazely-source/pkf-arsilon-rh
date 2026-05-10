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

  const request = await prisma.leaveRequest.findUnique({
    where: { id },
    include: { user: true },
  })
  if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const { action, reason } = body

  if (action === 'approve') {
    if (approver.role !== 'MANAGER' && approver.role !== 'RH' && approver.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    const updated = await prisma.leaveRequest.update({ where: { id }, data: { status: 'APPROVED' } })
    await prisma.approval.create({
      data: { approverId: approver.id, leaveRequestId: id, status: 'APPROVED', step: 1 },
    })
    await prisma.notification.create({
      data: {
        userId: request.userId,
        title: 'Demande CP approuvée',
        body: `Votre demande CP a été approuvée par ${approver.firstName} ${approver.lastName}`,
        type: 'CP',
        leaveRequestId: id,
      },
    })
    return NextResponse.json({ request: updated })
  }

  if (action === 'refuse') {
    if (approver.role !== 'MANAGER' && approver.role !== 'RH' && approver.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    const updated = await prisma.leaveRequest.update({
      where: { id },
      data: { status: 'REFUSED', refusedReason: reason ?? 'Refusé' },
    })
    await prisma.approval.create({
      data: { approverId: approver.id, leaveRequestId: id, status: 'REFUSED', comment: reason, step: 1 },
    })
    await prisma.notification.create({
      data: {
        userId: request.userId,
        title: 'Demande CP refusée',
        body: `Votre demande CP a été refusée : ${reason ?? 'Refusé par le manager'}`,
        type: 'CP',
        leaveRequestId: id,
      },
    })
    return NextResponse.json({ request: updated })
  }

  if (action === 'cancel') {
    if (request.userId !== approver.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    if (request.status !== 'PENDING_MANAGER') {
      return NextResponse.json({ error: 'Impossible d\'annuler' }, { status: 400 })
    }
    const updated = await prisma.leaveRequest.update({
      where: { id },
      data: { status: 'CANCELLED', refusedReason: 'Annulé par le collaborateur' },
    })
    return NextResponse.json({ request: updated })
  }

  return NextResponse.json({ error: 'Action invalide' }, { status: 400 })
}
