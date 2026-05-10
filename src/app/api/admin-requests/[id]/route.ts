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

  if (approver.role !== 'RH' && approver.role !== 'ADMIN' && approver.role !== 'MANAGER') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const { action } = body

  if (action === 'approve') {
    const updated = await prisma.adminRequest.update({ where: { id }, data: { status: 'APPROVED' } })
    return NextResponse.json({ request: updated })
  }

  if (action === 'refuse') {
    const updated = await prisma.adminRequest.update({ where: { id }, data: { status: 'REFUSED' } })
    return NextResponse.json({ request: updated })
  }

  return NextResponse.json({ error: 'Action invalide' }, { status: 400 })
}
