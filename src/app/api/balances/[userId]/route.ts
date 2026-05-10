import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (session.user.role !== 'RH' && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden — RH only' }, { status: 403 })
  }

  const body = await req.json()
  const { balanceStart, acquired, consumed, publicHolidayWorked, fiscalYear = 'FY26', leaveType = 'CP' } = body

  const updated = await prisma.leaveBalance.updateMany({
    where: { userId, leaveType, fiscalYear },
    data: { balanceStart, acquired, consumed, publicHolidayWorked },
  })

  const modifier = await prisma.user.findUnique({ where: { email: session.user.email! } })
  if (modifier) {
    await prisma.auditLog.create({
      data: {
        userId: modifier.id,
        action: 'BALANCE_UPDATED',
        entity: 'LeaveBalance',
        entityId: `${userId}_${leaveType}_${fiscalYear}`,
        newValue: JSON.stringify({ balanceStart, acquired, consumed, publicHolidayWorked }),
      },
    })
  }

  return NextResponse.json({ updated })
}
