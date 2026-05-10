export type Role = 'COLLABORATEUR' | 'MANAGER' | 'RH' | 'ADMIN'

export type RequestStatus =
  | 'DRAFT'
  | 'PENDING_MANAGER'
  | 'PENDING_RH'
  | 'APPROVED'
  | 'REFUSED'
  | 'CANCELLED'

export type LeaveType =
  | 'CP'
  | 'RTT'
  | 'SANS_SOLDE'
  | 'MALADIE'
  | 'MATERNITE'
  | 'PATERNITE'
  | 'EVENEMENT_FAMILIAL'
  | 'RECUPERATION_FERIE'

export interface UserPublic {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  region: string | null
  department: string | null
  matricule: string | null
  entryDate: Date | string
  avatarColor: string | null
  managerId: string | null
}

export interface LeaveBalanceSummary {
  id: string
  userId: string
  leaveType: string
  fiscalYear: string
  balanceStart: number
  acquired: number
  consumed: number
  pending: number
  publicHolidayWorked: number
}

export interface LeaveRequestSummary {
  id: string
  userId: string
  user?: UserPublic
  leaveType: string
  startDate: Date | string
  endDate: Date | string
  workingDays: number
  status: string
  reason?: string | null
  refusedReason?: string | null
  createdAt: Date | string
}

export interface RemoteWorkSummary {
  id: string
  userId: string
  user?: UserPublic
  type: string
  date: Date | string
  weekNumber: number
  yearNumber: number
  status: string
  reason?: string | null
  createdAt: Date | string
}

export interface NotificationSummary {
  id: string
  userId: string
  title: string
  body: string
  isRead: boolean
  type: string
  createdAt: Date | string
}
