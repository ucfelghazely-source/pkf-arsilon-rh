import { PrismaClient } from '@prisma/client'
import { hashSync } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding PKF Arsilon RH database...')

  // Nettoyage préalable pour permettre les relances
  await prisma.auditLog.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.approval.deleteMany()
  await prisma.adminRequest.deleteMany()
  await prisma.remoteWorkRequest.deleteMany()
  await prisma.leaveRequest.deleteMany()
  await prisma.leaveBalance.deleteMany()
  await prisma.remoteWorkQuota.deleteMany()
  await prisma.publicHoliday.deleteMany()
  // Users en dernier (FK contraintes)
  await prisma.user.deleteMany({ where: { managerId: { not: null } } })
  await prisma.user.deleteMany()

  // Jours fériés Maroc
  await prisma.publicHoliday.createMany({
    data: [
      { id: 'ph_001', date: new Date('2025-01-01'), name: "Jour de l'An",               country: 'MA' },
      { id: 'ph_002', date: new Date('2025-01-11'), name: "Fête de l'Indépendance",     country: 'MA' },
      { id: 'ph_003', date: new Date('2025-05-01'), name: 'Fête du Travail',            country: 'MA' },
      { id: 'ph_004', date: new Date('2025-07-30'), name: 'Fête du Trône',              country: 'MA' },
      { id: 'ph_005', date: new Date('2025-08-14'), name: 'Allégeance Oued-Eddahab',   country: 'MA' },
      { id: 'ph_006', date: new Date('2025-08-20'), name: 'Révolution du Roi et du Peuple', country: 'MA' },
      { id: 'ph_007', date: new Date('2025-08-21'), name: 'Fête de la Jeunesse',        country: 'MA' },
      { id: 'ph_008', date: new Date('2025-11-06'), name: 'Marche Verte',               country: 'MA' },
      { id: 'ph_009', date: new Date('2025-11-18'), name: "Fête de l'Indépendance",     country: 'MA' },
      { id: 'ph_010', date: new Date('2026-01-01'), name: "Jour de l'An",               country: 'MA' },
      { id: 'ph_011', date: new Date('2026-01-11'), name: "Fête de l'Indépendance",     country: 'MA' },
      { id: 'ph_012', date: new Date('2026-05-01'), name: 'Fête du Travail',            country: 'MA' },
      { id: 'ph_013', date: new Date('2026-05-14'), name: 'Ascension',                  country: 'MA' },
      { id: 'ph_014', date: new Date('2026-07-30'), name: 'Fête du Trône',              country: 'MA' },
    ],
  })

  // Quotas télétravail
  await prisma.remoteWorkQuota.createMany({
    data: [
      { id: 'quota_std', name: 'standard', maxPerWeek: 2, maxPerMonth: 12, validFrom: new Date('2024-09-01'), isActive: true },
      { id: 'quota_ram', name: 'ramadan',  maxPerWeek: 3, maxPerMonth: 60, validFrom: new Date('2026-02-23'), isActive: true },
    ],
  })

  // ─── UTILISATEURS ─────────────────────────────────────────
  const pwHash = hashSync('Casablanca2024!', 12)

  // Créer d'abord le manager et la RH (sans managerId)
  await prisma.user.upsert({
    where: { id: 'usr_mgr' },
    update: {},
    create: {
      id: 'usr_mgr',
      email: 'youssef.el-ghazely@arsilon.com',
      password: pwHash,
      firstName: 'Youssef',
      lastName: 'EL GHAZELY',
      matricule: '65916',
      codeDossier: 'FR29',
      role: 'MANAGER',
      region: 'ALL',
      department: 'Management',
      entryDate: new Date('2020-09-01'),
      isActive: true,
      avatarColor: '3B82C4',
    },
  })

  await prisma.user.upsert({
    where: { id: 'usr_rh' },
    update: {},
    create: {
      id: 'usr_rh',
      email: 'v.duclos@arsilon.com',
      firstName: 'Véronique',
      lastName: 'DUCLOS',
      matricule: '65100',
      codeDossier: 'FR29',
      role: 'RH',
      region: 'RH',
      department: 'RH',
      entryDate: new Date('2018-01-01'),
      isActive: true,
      avatarColor: '059669',
    },
  })

  // Collaborateurs
  const collaborateurs = [
    { id: 'usr_001', email: 'g.chard@arsilon.com',        firstName: 'Ghita',    lastName: 'CHARD',        matricule: '65001', region: 'IDF',  department: 'Audit', entryDate: '2023-09-11', avatarColor: '7C3AED' },
    { id: 'usr_002', email: 'c.amensar@arsilon.com',      firstName: 'Chaima',   lastName: 'AMENSAR',      matricule: '65002', region: 'SO',   department: 'Audit', entryDate: '2023-09-18', avatarColor: 'D97706' },
    { id: 'usr_003', email: 'r.bartali@arsilon.com',      firstName: 'Reda',     lastName: 'BARTALI',      matricule: '65003', region: 'SUD',  department: 'Audit', entryDate: '2024-09-09', avatarColor: 'DC2626' },
    { id: 'usr_004', email: 'a.elmouttaki@arsilon.com',   firstName: 'Aicha',    lastName: 'EL MOUTTAKI',  matricule: '65004', region: 'SUD',  department: 'Audit', entryDate: '2024-09-09', avatarColor: '0891B2' },
    { id: 'usr_005', email: 'l.beloubir@arsilon.com',     firstName: 'Lina',     lastName: 'BELOUBIR',     matricule: '65005', region: 'SUD',  department: 'Audit', entryDate: '2024-09-09', avatarColor: '4F46E5' },
    { id: 'usr_006', email: 'k.hlaibi@arsilon.com',       firstName: 'Kawtar',   lastName: 'HLAIBI',       matricule: '65006', region: 'SO',   department: 'Audit', entryDate: '2024-09-09', avatarColor: '059669' },
    { id: 'usr_007', email: 's.eddiani@arsilon.com',      firstName: 'Samia',    lastName: 'EDDIANI',      matricule: '65007', region: 'SO',   department: 'Audit', entryDate: '2024-10-21', avatarColor: 'BE185D' },
    { id: 'usr_008', email: 's.abderrazzak@arsilon.com',  firstName: 'Salma',    lastName: 'ABDERRAZZAK',  matricule: '65008', region: 'RABE', department: 'Audit', entryDate: '2024-09-09', avatarColor: '92400E' },
    { id: 'usr_009', email: 'k.redouane@arsilon.com',     firstName: 'Kawtar',   lastName: 'REDOUANE',     matricule: '65009', region: 'NORD', department: 'Audit', entryDate: '2024-09-09', avatarColor: '1E40AF' },
    { id: 'usr_010', email: 'm.demouche@arsilon.com',     firstName: 'Marwa',    lastName: 'DEMOUCHE',     matricule: '65010', region: 'NORD', department: 'Audit', entryDate: '2024-09-09', avatarColor: '7C3AED' },
    { id: 'usr_011', email: 'h.touta@arsilon.com',        firstName: 'Hiba',     lastName: 'TOUTA',        matricule: '65011', region: 'IDF',  department: 'Audit', entryDate: '2024-09-09', avatarColor: '0F766E' },
    { id: 'usr_012', email: 'z.zemroun@arsilon.com',      firstName: 'Zineb',    lastName: 'ZEMROUN',      matricule: '65012', region: 'IDF',  department: 'Audit', entryDate: '2024-09-09', avatarColor: '6D28D9' },
    { id: 'usr_013', email: 'm.sadki@arsilon.com',        firstName: 'Maha',     lastName: 'SADKI',        matricule: '65013', region: 'IDF',  department: 'Audit', entryDate: '2024-09-09', avatarColor: 'BE185D' },
    { id: 'usr_014', email: 'i.yamini@arsilon.com',       firstName: 'Intissar', lastName: 'YAMINI',       matricule: '65014', region: 'GO',   department: 'Audit', entryDate: '2024-09-09', avatarColor: '059669' },
    { id: 'usr_015', email: 'a.lhamime@arsilon.com',      firstName: 'Amina',    lastName: 'LHAMIME',      matricule: '65015', region: 'CDG',  department: 'Audit', entryDate: '2024-10-15', avatarColor: 'D97706' },
    { id: 'usr_016', email: 'z.chihab@arsilon.com',       firstName: 'Zakaria',  lastName: 'CHIHAB',       matricule: '65016', region: 'IT',   department: 'IT',    entryDate: '2025-01-20', avatarColor: '2563A8' },
    { id: 'usr_017', email: 'y.touhami@arsilon.com',      firstName: 'Youssef',  lastName: 'TOUHAMI',      matricule: '65017', region: 'ITRA', department: 'Audit', entryDate: '2024-09-09', avatarColor: 'DC2626' },
    { id: 'usr_018', email: 'h.louali@arsilon.com',       firstName: 'Hamza',    lastName: 'LOUALI',       matricule: '65018', region: 'IDF',  department: 'Audit', entryDate: '2025-01-06', avatarColor: '7C3AED' },
  ]

  for (const c of collaborateurs) {
    await prisma.user.upsert({
      where: { id: c.id },
      update: {},
      create: {
        ...c,
        codeDossier: 'FR29',
        role: 'COLLABORATEUR',
        entryDate: new Date(c.entryDate),
        isActive: true,
        managerId: 'usr_mgr',
      },
    })
  }

  // ─── SOLDES CP FY26 ───────────────────────────────────────
  const cpBalances = [
    { id: 'lb_001', userId: 'usr_003', balanceStart: 12.05, acquired: 17.5,   consumed: 23,   publicHolidayWorked: 0 },
    { id: 'lb_002', userId: 'usr_004', balanceStart: 12.05, acquired: 17.5,   consumed: 19,   publicHolidayWorked: 0 },
    { id: 'lb_003', userId: 'usr_005', balanceStart: 13.05, acquired: 17.5,   consumed: 24,   publicHolidayWorked: 0 },
    { id: 'lb_004', userId: 'usr_002', balanceStart: 14.45, acquired: 14.0,   consumed: 25.5, publicHolidayWorked: 2 },
    { id: 'lb_005', userId: 'usr_006', balanceStart: 12.05, acquired: 17.5,   consumed: 22,   publicHolidayWorked: 2 },
    { id: 'lb_006', userId: 'usr_007', balanceStart: 13.35, acquired: 17.5,   consumed: 25,   publicHolidayWorked: 3 },
    { id: 'lb_007', userId: 'usr_008', balanceStart: 12.05, acquired: 17.5,   consumed: 24,   publicHolidayWorked: 2 },
    { id: 'lb_008', userId: 'usr_009', balanceStart: 13.05, acquired: 12.5,   consumed: 23,   publicHolidayWorked: 0 },
    { id: 'lb_009', userId: 'usr_010', balanceStart: 12.05, acquired: 17.5,   consumed: 21.5, publicHolidayWorked: 2 },
    { id: 'lb_010', userId: 'usr_001', balanceStart: 17.86, acquired: 9.879,  consumed: 13,   publicHolidayWorked: 0 },
    { id: 'lb_011', userId: 'usr_011', balanceStart: 13.05, acquired: 17.5,   consumed: 23,   publicHolidayWorked: 2 },
    { id: 'lb_012', userId: 'usr_012', balanceStart: 12.05, acquired: 17.5,   consumed: 22,   publicHolidayWorked: 2 },
    { id: 'lb_013', userId: 'usr_013', balanceStart: 11.55, acquired: 17.5,   consumed: 21,   publicHolidayWorked: 2 },
    { id: 'lb_014', userId: 'usr_014', balanceStart: 11.05, acquired: 14.875, consumed: 18,   publicHolidayWorked: 0 },
    { id: 'lb_015', userId: 'usr_015', balanceStart: 10.625,acquired: 17.5,   consumed: 23,   publicHolidayWorked: 1 },
    { id: 'lb_016', userId: 'usr_016', balanceStart: 9.95,  acquired: 17.5,   consumed: 23.5, publicHolidayWorked: 2 },
    { id: 'lb_017', userId: 'usr_017', balanceStart: 9.05,  acquired: 17.5,   consumed: 29,   publicHolidayWorked: 0 },
  ]

  for (const b of cpBalances) {
    await prisma.leaveBalance.upsert({
      where: { userId_leaveType_fiscalYear: { userId: b.userId, leaveType: 'CP', fiscalYear: 'FY26' } },
      update: {},
      create: { ...b, leaveType: 'CP', fiscalYear: 'FY26' },
    })
  }

  // Soldes RTT
  const rttBalances = [
    { id: 'lb_tt_001', userId: 'usr_002', consumed: 12 },
    { id: 'lb_tt_002', userId: 'usr_001', consumed: 12 },
    { id: 'lb_tt_003', userId: 'usr_006', consumed: 9  },
    { id: 'lb_tt_004', userId: 'usr_009', consumed: 8  },
  ]
  for (const b of rttBalances) {
    await prisma.leaveBalance.upsert({
      where: { userId_leaveType_fiscalYear: { userId: b.userId, leaveType: 'RTT', fiscalYear: 'FY26' } },
      update: {},
      create: { id: b.id, userId: b.userId, leaveType: 'RTT', fiscalYear: 'FY26', acquired: 12, consumed: b.consumed },
    })
  }

  // ─── DEMANDES CONGÉS ──────────────────────────────────────
  const leaveRequests = [
    { id: 'lr_001', userId: 'usr_003', leaveType: 'CP',                  startDate: '2025-08-04', endDate: '2025-08-15', workingDays: 12, status: 'APPROVED', createdAt: '2025-07-15' },
    { id: 'lr_002', userId: 'usr_006', leaveType: 'CP',                  startDate: '2025-08-04', endDate: '2025-08-15', workingDays: 12, status: 'APPROVED', createdAt: '2025-07-16' },
    { id: 'lr_003', userId: 'usr_007', leaveType: 'CP',                  startDate: '2025-08-01', endDate: '2025-08-15', workingDays: 13, status: 'APPROVED', createdAt: '2025-07-17' },
    { id: 'lr_004', userId: 'usr_001', leaveType: 'CP',                  startDate: '2025-12-15', endDate: '2025-12-31', workingDays: 12, status: 'APPROVED', createdAt: '2025-12-01' },
    { id: 'lr_005', userId: 'usr_002', leaveType: 'RECUPERATION_FERIE',  startDate: '2026-01-14', endDate: '2026-01-14', workingDays:  1, status: 'APPROVED', createdAt: '2026-01-10' },
    { id: 'lr_006', userId: 'usr_009', leaveType: 'CP',                  startDate: '2026-01-13', endDate: '2026-01-13', workingDays:  1, status: 'APPROVED', createdAt: '2026-01-07' },
    { id: 'lr_007', userId: 'usr_017', leaveType: 'CP',                  startDate: '2026-04-01', endDate: '2026-04-15', workingDays: 11, status: 'APPROVED', createdAt: '2026-03-20' },
    { id: 'lr_008', userId: 'usr_003', leaveType: 'CP',                  startDate: '2026-04-28', endDate: '2026-04-30', workingDays:  2, status: 'APPROVED', createdAt: '2026-04-22' },
    { id: 'lr_009', userId: 'usr_003', leaveType: 'CP',                  startDate: '2026-07-06', endDate: '2026-07-18', workingDays:  9, status: 'PENDING_MANAGER', createdAt: '2026-05-05' },
    { id: 'lr_010', userId: 'usr_004', leaveType: 'CP',                  startDate: '2026-08-03', endDate: '2026-08-28', workingDays: 19, status: 'APPROVED', createdAt: '2026-04-20' },
    { id: 'lr_011', userId: 'usr_010', leaveType: 'CP',                  startDate: '2026-07-01', endDate: '2026-07-31', workingDays: 22, status: 'APPROVED', createdAt: '2026-04-22' },
    { id: 'lr_012', userId: 'usr_005', leaveType: 'CP',                  startDate: '2026-06-01', endDate: '2026-06-13', workingDays: 10, status: 'PENDING_MANAGER', createdAt: '2026-05-08' },
  ]

  for (const lr of leaveRequests) {
    await prisma.leaveRequest.upsert({
      where: { id: lr.id },
      update: {},
      create: {
        id: lr.id,
        userId: lr.userId,
        leaveType: lr.leaveType,
        startDate: new Date(lr.startDate),
        endDate: new Date(lr.endDate),
        workingDays: lr.workingDays,
        status: lr.status,
        createdAt: new Date(lr.createdAt),
      },
    })
  }

  // ─── DEMANDES TÉLÉTRAVAIL ─────────────────────────────────
  const remoteWork = [
    { id: 'rw_001', userId: 'usr_002', date: '2026-05-06', weekNumber: 19, yearNumber: 2026, status: 'APPROVED',        createdAt: '2026-05-04' },
    { id: 'rw_002', userId: 'usr_002', date: '2026-05-08', weekNumber: 19, yearNumber: 2026, status: 'APPROVED',        createdAt: '2026-05-04' },
    { id: 'rw_003', userId: 'usr_001', date: '2026-05-04', weekNumber: 19, yearNumber: 2026, status: 'APPROVED',        createdAt: '2026-05-01' },
    { id: 'rw_004', userId: 'usr_001', date: '2026-05-07', weekNumber: 19, yearNumber: 2026, status: 'APPROVED',        createdAt: '2026-05-01' },
    { id: 'rw_005', userId: 'usr_006', date: '2026-05-11', weekNumber: 20, yearNumber: 2026, status: 'PENDING_MANAGER', createdAt: '2026-05-08' },
    { id: 'rw_006', userId: 'usr_001', date: '2026-05-12', weekNumber: 20, yearNumber: 2026, status: 'PENDING_MANAGER', createdAt: '2026-05-08' },
    { id: 'rw_007', userId: 'usr_001', date: '2026-05-14', weekNumber: 20, yearNumber: 2026, status: 'PENDING_MANAGER', createdAt: '2026-05-08' },
    { id: 'rw_008', userId: 'usr_009', date: '2026-05-13', weekNumber: 20, yearNumber: 2026, status: 'PENDING_MANAGER', createdAt: '2026-05-09' },
  ]

  for (const rw of remoteWork) {
    await prisma.remoteWorkRequest.upsert({
      where: { id: rw.id },
      update: {},
      create: {
        id: rw.id,
        userId: rw.userId,
        type: 'REGULAR',
        date: new Date(rw.date),
        weekNumber: rw.weekNumber,
        yearNumber: rw.yearNumber,
        status: rw.status,
        createdAt: new Date(rw.createdAt),
      },
    })
  }

  // ─── APPROBATIONS ─────────────────────────────────────────
  await prisma.approval.createMany({
    data: [
      { id: 'appr_001', approverId: 'usr_mgr', leaveRequestId:      'lr_001', status: 'APPROVED', step: 1 },
      { id: 'appr_002', approverId: 'usr_rh',  leaveRequestId:      'lr_001', status: 'APPROVED', step: 2 },
      { id: 'appr_003', approverId: 'usr_mgr', leaveRequestId:      'lr_007', status: 'APPROVED', comment: 'OK pour cette période', step: 1 },
      { id: 'appr_004', approverId: 'usr_rh',  leaveRequestId:      'lr_007', status: 'APPROVED', comment: 'Validé malgré solde négatif — accord exceptionnel', step: 2 },
      { id: 'appr_tt_001', approverId: 'usr_mgr', remoteWorkRequestId: 'rw_001', status: 'APPROVED', step: 1 },
      { id: 'appr_tt_002', approverId: 'usr_mgr', remoteWorkRequestId: 'rw_002', status: 'APPROVED', step: 1 },
      { id: 'appr_tt_003', approverId: 'usr_mgr', remoteWorkRequestId: 'rw_003', status: 'APPROVED', step: 1 },
      { id: 'appr_tt_004', approverId: 'usr_mgr', remoteWorkRequestId: 'rw_004', status: 'APPROVED', step: 1 },
    ],
  })

  // ─── DEMANDES ADM ─────────────────────────────────────────
  await prisma.adminRequest.upsert({
    where: { id: 'adm_001' },
    update: {},
    create: {
      id: 'adm_001',
      userId: 'usr_007',
      type: 'ATTESTATION_TRAVAIL',
      status: 'APPROVED',
      createdAt: new Date('2026-05-02'),
    },
  })
  await prisma.adminRequest.upsert({
    where: { id: 'adm_002' },
    update: {},
    create: {
      id: 'adm_002',
      userId: 'usr_015',
      type: 'REMBOURSEMENT_TRANSPORT',
      status: 'PENDING_RH',
      createdAt: new Date('2026-04-28'),
    },
  })

  // ─── NOTIFICATIONS ────────────────────────────────────────
  await prisma.notification.createMany({
    data: [
      { id: 'n1', userId: 'usr_mgr', title: 'Demande TT en attente', body: 'HLAIBI Kawtar — Demande TT 11 Mai en attente', type: 'TT', isRead: false, remoteWorkRequestId: 'rw_005' },
      { id: 'n2', userId: 'usr_mgr', title: 'Demande CP en attente', body: 'BARTALI Reda — Demande CP Juillet en attente', type: 'CP', isRead: false, leaveRequestId: 'lr_009' },
      { id: 'n3', userId: 'usr_mgr', title: 'Demande CP en attente', body: 'BELOUBIR Lina — Demande CP Juin en attente', type: 'CP', isRead: false, leaveRequestId: 'lr_012' },
      { id: 'n4', userId: 'usr_mgr', title: 'Demande TT en attente', body: 'REDOUANE Kawtar — Demande TT 13 Mai en attente', type: 'TT', isRead: false, remoteWorkRequestId: 'rw_008' },
    ],
  })

  // ─── AUDIT LOG ────────────────────────────────────────────
  await prisma.auditLog.upsert({
    where: { id: 'al_001' },
    update: {},
    create: {
      id: 'al_001',
      userId: 'usr_rh',
      action: 'IMPORT_EXCEL',
      entity: 'LeaveBalance',
      entityId: 'FY26',
      newValue: JSON.stringify({ source: 'Suivi_CP_Télétravail_Casablanca.xlsx', records: 17 }),
      createdAt: new Date('2026-05-10T09:00:00'),
    },
  })

  console.log('✅ Seed terminé avec succès.')
  console.log('   Email   : youssef.el-ghazely@arsilon.com')
  console.log('   Mot de passe : Casablanca2024!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
