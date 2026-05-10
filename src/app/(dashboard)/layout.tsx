import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Topbar } from '@/components/layout/Topbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { ToastProvider } from '@/components/ui/Toast'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const pendingCount = await prisma.leaveRequest.count({
    where: { status: 'PENDING_MANAGER' },
  }) + await prisma.remoteWorkRequest.count({
    where: { status: 'PENDING_MANAGER' },
  }) + await prisma.adminRequest.count({
    where: { status: 'PENDING_RH' },
  })

  return (
    <ToastProvider>
      <Topbar />
      <div className="shell">
        <Sidebar role={session.user.role} pendingCount={pendingCount} />
        <main className="main">{children}</main>
      </div>
    </ToastProvider>
  )
}
