-- ============================================================
-- PKF Arsilon Casablanca — Seed Data SQL
-- Généré automatiquement depuis Suivi_CP___Télétravail.xlsx
-- FY2024 · FY2025 · FY2026
-- ============================================================

BEGIN;

-- ─── JOURS FÉRIÉS MAROC ──────────────────────────────────

INSERT INTO "PublicHoliday" (id, date, name, country, "isWorked") VALUES
  ('ph_001', '2025-01-01', 'Jour de l''An', 'MA', false),
  ('ph_002', '2025-01-11', 'Fête de l''Indépendance', 'MA', false),
  ('ph_003', '2025-05-01', 'Fête du Travail', 'MA', false),
  ('ph_004', '2025-07-30', 'Fête du Trône', 'MA', false),
  ('ph_005', '2025-08-14', 'Allégeance Oued-Eddahab', 'MA', false),
  ('ph_006', '2025-08-20', 'Révolution du Roi et du Peuple', 'MA', false),
  ('ph_007', '2025-08-21', 'Fête de la Jeunesse', 'MA', false),
  ('ph_008', '2025-11-06', 'Marche Verte', 'MA', false),
  ('ph_009', '2025-11-18', 'Fête de l''Indépendance', 'MA', false),
  ('ph_010', '2026-01-01', 'Jour de l''An', 'MA', false),
  ('ph_011', '2026-01-11', 'Fête de l''Indépendance', 'MA', false),
  ('ph_012', '2026-05-01', 'Fête du Travail', 'MA', false),
  ('ph_013', '2026-07-30', 'Fête du Trône', 'MA', false);

-- ─── QUOTAS TÉLÉTRAVAIL ──────────────────────────────────

INSERT INTO "RemoteWorkQuota" (id, name, "maxPerWeek", "maxPerMonth", "validFrom", "isActive") VALUES
  ('quota_std', 'standard',  2, 12, '2024-09-01', true),
  ('quota_ram', 'ramadan',   3, 60, '2026-02-23', true);

-- ─── USERS ────────────────────────────────────────────────

INSERT INTO "User" (id, email, "firstName", "lastName", matricule, "codeDossier", role, region, department, "entryDate", "isActive") VALUES
  ('usr_001', 'g.chard@arsilon.com',         'Ghita',     'CHARD',        '65001', 'FR29', 'COLLABORATEUR', 'IDF',  'Audit',          '2023-09-11', true),
  ('usr_002', 'c.amensar@arsilon.com',        'Chaima',    'AMENSAR',      '65002', 'FR29', 'COLLABORATEUR', 'SO',   'Audit',          '2023-09-18', true),
  ('usr_003', 'r.bartali@arsilon.com',        'Reda',      'BARTALI',      '65003', 'FR29', 'COLLABORATEUR', 'SUD',  'Audit',          '2024-09-09', true),
  ('usr_004', 'a.elmouttaki@arsilon.com',     'Aicha',     'EL MOUTTAKI',  '65004', 'FR29', 'COLLABORATEUR', 'SUD',  'Audit',          '2024-09-09', true),
  ('usr_005', 'l.beloubir@arsilon.com',       'Lina',      'BELOUBIR',     '65005', 'FR29', 'COLLABORATEUR', 'SUD',  'Audit',          '2024-09-09', true),
  ('usr_006', 'k.hlaibi@arsilon.com',         'Kawtar',    'HLAIBI',       '65006', 'FR29', 'COLLABORATEUR', 'SO',   'Audit',          '2024-09-09', true),
  ('usr_007', 's.eddiani@arsilon.com',        'Samia',     'EDDIANI',      '65007', 'FR29', 'COLLABORATEUR', 'SO',   'Audit',          '2024-10-21', true),
  ('usr_008', 's.abderrazzak@arsilon.com',    'Salma',     'ABDERRAZZAK',  '65008', 'FR29', 'COLLABORATEUR', 'RABE', 'Audit',          '2024-09-09', true),
  ('usr_009', 'k.redouane@arsilon.com',       'Kawtar',    'REDOUANE',     '65009', 'FR29', 'COLLABORATEUR', 'NORD', 'Audit',          '2024-09-09', true),
  ('usr_010', 'm.demouche@arsilon.com',       'Marwa',     'DEMOUCHE',     '65010', 'FR29', 'COLLABORATEUR', 'NORD', 'Audit',          '2024-09-09', true),
  ('usr_011', 'h.touta@arsilon.com',          'Hiba',      'TOUTA',        '65011', 'FR29', 'COLLABORATEUR', 'IDF',  'Audit',          '2024-09-09', true),
  ('usr_012', 'z.zemroun@arsilon.com',        'Zineb',     'ZEMROUN',      '65012', 'FR29', 'COLLABORATEUR', 'IDF',  'Audit',          '2024-09-09', true),
  ('usr_013', 'm.sadki@arsilon.com',          'Maha',      'SADKI',        '65013', 'FR29', 'COLLABORATEUR', 'IDF',  'Audit',          '2024-09-09', true),
  ('usr_014', 'i.yamini@arsilon.com',         'Intissar',  'YAMINI',       '65014', 'FR29', 'COLLABORATEUR', 'GO',   'Audit',          '2024-09-09', true),
  ('usr_015', 'a.lhamime@arsilon.com',        'Amina',     'LHAMIME',      '65015', 'FR29', 'COLLABORATEUR', 'CDG',  'Audit',          '2024-10-15', true),
  ('usr_016', 'z.chihab@arsilon.com',         'Zakaria',   'CHIHAB',       '65016', 'FR29', 'COLLABORATEUR', 'IT',   'IT',             '2025-01-20', true),
  ('usr_017', 'y.touhami@arsilon.com',        'Youssef',   'TOUHAMI',      '65017', 'FR29', 'COLLABORATEUR', 'ITRA', 'Audit',          '2024-09-09', true),
  ('usr_018', 'h.louali@arsilon.com',         'Hamza',     'LOUALI',       '65018', 'FR29', 'COLLABORATEUR', 'IDF',  'Audit',          '2025-01-06', true),
  ('usr_mgr', 'y.el-ghazely@arsilon.com',     'Youssef',   'EL GHAZELY',   '65916', 'FR29', 'MANAGER',       'ALL',  'Management',     '2020-09-01', true),
  ('usr_rh',  'v.duclos@arsilon.com',         'Véronique', 'DUCLOS',       '65100', 'FR29', 'RH',            'RH',   'RH',             '2018-01-01', true);

-- Affecter le manager
UPDATE "User" SET "managerId" = 'usr_mgr' 
WHERE id NOT IN ('usr_mgr', 'usr_rh');

-- ─── SOLDES CP FY26 ───────────────────────────────────────
-- Source: onglet "CP FY26 (saisi par Marine)"

INSERT INTO "LeaveBalance" (id, "userId", "leaveType", "fiscalYear", "balanceStart", acquired, consumed, "publicHolidayWorked") VALUES
  ('lb_001', 'usr_003', 'CP', 'FY26', 12.05, 17.5,  23,   0),
  ('lb_002', 'usr_004', 'CP', 'FY26', 12.05, 17.5,  19,   0),
  ('lb_003', 'usr_005', 'CP', 'FY26', 13.05, 17.5,  24,   0),
  ('lb_004', 'usr_002', 'CP', 'FY26', 14.45, 14.0,  25.5, 2),
  ('lb_005', 'usr_006', 'CP', 'FY26', 12.05, 17.5,  22,   2),
  ('lb_006', 'usr_007', 'CP', 'FY26', 13.35, 17.5,  25,   3),
  ('lb_007', 'usr_008', 'CP', 'FY26', 12.05, 17.5,  24,   2),
  ('lb_008', 'usr_009', 'CP', 'FY26', 13.05, 12.5,  23,   0),
  ('lb_009', 'usr_010', 'CP', 'FY26', 12.05, 17.5,  21.5, 2),
  ('lb_010', 'usr_001', 'CP', 'FY26', 17.86, 9.879, 13,   0),
  ('lb_011', 'usr_011', 'CP', 'FY26', 13.05, 17.5,  23,   2),
  ('lb_012', 'usr_012', 'CP', 'FY26', 12.05, 17.5,  22,   2),
  ('lb_013', 'usr_013', 'CP', 'FY26', 11.55, 17.5,  21,   2),
  ('lb_014', 'usr_014', 'CP', 'FY26', 11.05, 14.875,18,   0),
  ('lb_015', 'usr_015', 'CP', 'FY26', 10.625,17.5,  23,   1),
  ('lb_016', 'usr_016', 'CP', 'FY26', 9.95,  17.5,  23.5, 2),
  ('lb_017', 'usr_017', 'CP', 'FY26', 9.05,  17.5,  29,   0);

-- Soldes RTT FY26 (télétravail quota mensuel = 12j)
INSERT INTO "LeaveBalance" (id, "userId", "leaveType", "fiscalYear", "balanceStart", acquired, consumed) VALUES
  ('lb_tt_001', 'usr_002', 'RTT', 'FY26', 0, 12, 12),
  ('lb_tt_002', 'usr_001', 'RTT', 'FY26', 0, 12, 12),
  ('lb_tt_003', 'usr_006', 'RTT', 'FY26', 0, 12, 9),
  ('lb_tt_004', 'usr_009', 'RTT', 'FY26', 0, 12, 8);

-- ─── QUELQUES DEMANDES CP HISTORIQUES (FY26) ─────────────

INSERT INTO "LeaveRequest" (id, "userId", "leaveType", "startDate", "endDate", "workingDays", status, "createdAt") VALUES
  ('lr_001', 'usr_003', 'CP', '2025-08-04', '2025-08-15', 12, 'APPROVED', '2025-07-15 09:00:00'),
  ('lr_002', 'usr_006', 'CP', '2025-08-04', '2025-08-15', 12, 'APPROVED', '2025-07-16 10:00:00'),
  ('lr_003', 'usr_007', 'CP', '2025-08-01', '2025-08-15', 13, 'APPROVED', '2025-07-17 09:30:00'),
  ('lr_004', 'usr_001', 'CP', '2025-12-15', '2025-12-31', 12, 'APPROVED', '2025-12-01 08:00:00'),
  ('lr_005', 'usr_002', 'RECUPERATION_FERIE', '2026-01-14', '2026-01-14', 1, 'APPROVED', '2026-01-10 09:00:00'),
  ('lr_006', 'usr_009', 'CP', '2026-01-13', '2026-01-13', 1, 'APPROVED', '2026-01-07 08:30:00'),
  ('lr_007', 'usr_017', 'CP', '2026-04-01', '2026-04-15', 11, 'APPROVED', '2026-03-20 09:00:00'),
  ('lr_008', 'usr_003', 'CP', '2026-04-28', '2026-04-30', 2, 'APPROVED', '2026-04-22 10:00:00');

-- ─── DEMANDES TÉLÉTRAVAIL RÉCENTES ────────────────────────

INSERT INTO "RemoteWorkRequest" (id, "userId", type, date, "weekNumber", "yearNumber", status, "createdAt") VALUES
  ('rw_001', 'usr_002', 'REGULAR', '2026-05-06', 19, 2026, 'APPROVED',        '2026-05-04 08:00:00'),
  ('rw_002', 'usr_002', 'REGULAR', '2026-05-08', 19, 2026, 'APPROVED',        '2026-05-04 08:00:00'),
  ('rw_003', 'usr_001', 'REGULAR', '2026-05-04', 19, 2026, 'APPROVED',        '2026-05-01 09:00:00'),
  ('rw_004', 'usr_001', 'REGULAR', '2026-05-07', 19, 2026, 'APPROVED',        '2026-05-01 09:00:00'),
  ('rw_005', 'usr_006', 'REGULAR', '2026-05-11', 20, 2026, 'PENDING_MANAGER', '2026-05-08 09:00:00'),
  ('rw_006', 'usr_001', 'REGULAR', '2026-05-12', 20, 2026, 'PENDING_MANAGER', '2026-05-08 10:00:00'),
  ('rw_007', 'usr_001', 'REGULAR', '2026-05-14', 20, 2026, 'PENDING_MANAGER', '2026-05-08 10:05:00');

-- ─── APPROBATIONS ─────────────────────────────────────────

INSERT INTO "Approval" (id, "approverId", "leaveRequestId", status, comment, step) VALUES
  ('appr_001', 'usr_mgr', 'lr_001', 'APPROVED', NULL, 1),
  ('appr_002', 'usr_rh',  'lr_001', 'APPROVED', NULL, 2),
  ('appr_003', 'usr_mgr', 'lr_007', 'APPROVED', 'OK pour cette période', 1),
  ('appr_004', 'usr_rh',  'lr_007', 'APPROVED', 'Validé malgré solde négatif — accord exceptionnel', 2);

INSERT INTO "Approval" (id, "approverId", "remoteWorkRequestId", status, step) VALUES
  ('appr_tt_001', 'usr_mgr', 'rw_001', 'APPROVED', 1),
  ('appr_tt_002', 'usr_mgr', 'rw_002', 'APPROVED', 1),
  ('appr_tt_003', 'usr_mgr', 'rw_003', 'APPROVED', 1),
  ('appr_tt_004', 'usr_mgr', 'rw_004', 'APPROVED', 1);

-- ─── AUDIT LOG initial ────────────────────────────────────

INSERT INTO "AuditLog" (id, "userId", action, entity, "entityId", "newValue", "createdAt") VALUES
  ('al_001', 'usr_rh', 'IMPORT_EXCEL', 'LeaveBalance', 'FY26', '{"source":"Suivi_CP_Télétravail_Casablanca.xlsx","records":17}', '2026-05-10 09:00:00');

COMMIT;

-- ─── VUES UTILES ──────────────────────────────────────────

CREATE OR REPLACE VIEW v_cp_summary AS
SELECT
  u."firstName" || ' ' || u."lastName" AS collaborateur,
  u.region,
  u."entryDate",
  lb."balanceStart"                    AS solde_n1,
  lb.acquired                          AS cp_acquis,
  lb.consumed                          AS cp_pris,
  lb."balanceStart" + lb.acquired - lb.consumed AS solde_actuel,
  lb."publicHolidayWorked"             AS jf_travailles
FROM "LeaveBalance" lb
JOIN "User" u ON u.id = lb."userId"
WHERE lb."leaveType" = 'CP'
  AND lb."fiscalYear" = 'FY26'
  AND u."isActive" = true
ORDER BY u.region, u."lastName";

CREATE OR REPLACE VIEW v_tt_weekly AS
SELECT
  u."firstName" || ' ' || u."lastName" AS collaborateur,
  u.region,
  rw."weekNumber",
  rw."yearNumber",
  COUNT(*) AS jours_tt,
  COUNT(*) FILTER (WHERE rw.status = 'APPROVED')       AS jours_approuves,
  COUNT(*) FILTER (WHERE rw.status = 'PENDING_MANAGER') AS jours_en_attente
FROM "RemoteWorkRequest" rw
JOIN "User" u ON u.id = rw."userId"
GROUP BY u.id, u."firstName", u."lastName", u.region, rw."weekNumber", rw."yearNumber"
ORDER BY rw."yearNumber" DESC, rw."weekNumber" DESC;
