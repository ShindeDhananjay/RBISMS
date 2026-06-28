// Role-based permission checker
// canAccess(role, module): boolean
// canEdit(role, module): boolean
// canDelete(role, module): boolean
// canExport(role): boolean
// MODULE permissions matrix:
//   SuperAdmin    → all modules (full CRUD)
//   CircleAdmin   → all modules (read + some edit)
//   DivisionAdmin → division scope (full CRUD)
//   SDI           → sub-division scope (full CRUD)
//   Postmaster    → HO/SO scope (full CRUD)
//   BPM           → own BO only (full CRUD)
//   ABPM          → own BO only (create/read)
//   MarketingExec → business modules only (full CRUD)
