# Reports Page Fix: Sustainable Monthly Aggregation

## Problem Solved
Your Reports page wasn't showing Voice Inquiries, System Appointments, or Engine Minutes Used because the `monthly_reports` table was never populated. The `refresh_monthly_report` RPC was only called once (at onboarding) and had no triggers to keep it updated when call logs or appointments changed.

## Solution Implemented
A **self-maintaining monthly aggregation pipeline** using Supabase database triggers:

```
NEW CALL LOG/APPOINTMENT INSERTED/UPDATED/DELETED
  ↓
Database trigger fires
  ↓
Calls upsert_monthly_report() for the relevant month
  ↓
monthly_reports table auto-updates with accurate metrics
  ↓
Reports page always shows current data
```

---

## What Was Built

### 1. **Supabase Database Functions & Triggers** (Manual Setup Required)
- `upsert_monthly_report(p_clinic_config_id, p_month)` — aggregates call_logs + appointments for a month
- Trigger on `call_logs` — fires on INSERT/UPDATE/DELETE
- Trigger on `appointments` — fires on INSERT/UPDATE/DELETE

**File:** `SUPABASE_SETUP.md` (contains all SQL to run)

### 2. **Backfill API Endpoint** 
**File:** `app/api/reports/backfill/route.ts`

Authenticates user → finds all historical months in call_logs → seeds them into monthly_reports. Safe to run multiple times (idempotent).

**Usage:**
```typescript
POST /api/reports/backfill
```

Returns:
```json
{
  "message": "Backfill completed",
  "monthsProcessed": 6,
  "totalMonths": 6,
  "success": true
}
```

### 3. **Settings Panel "Sync Report Data" Button**
**File:** `components/dashboard/settings/ClinicSettingsPanel.tsx`

New UI button in Settings → Data Management section. Calls `/api/reports/backfill` to populate historical months. Shows loading state and success/error toast.

---

## How to Activate

### Step 1: Run Supabase SQL (One-Time Setup)
1. Go to **Supabase Dashboard > SQL Editor**
2. Open `SUPABASE_SETUP.md` in this repo
3. Run Steps 1–4 in order (copy-paste each SQL block)
4. If you get "constraint already exists", that's fine—keep going

### Step 2: Deploy the Code
```bash
git add .
git commit -m "feat: add sustainable monthly reports aggregation with db triggers"
git push
# Deploy to Vercel (automatic or manual)
```

### Step 3: Backfill Historical Data
1. Navigate to **Dashboard > Settings**
2. Scroll down to **Data Management**
3. Click **Sync Report Data**
4. Wait for success toast (usually <5 seconds)
5. Navigate to **Reports** page
6. Confirm Voice Inquiries, System Appointments, and Engine Minutes now populate

---

## How It Works Day-to-Day

| Event | Result |
|---|---|
| New call logged | Trigger fires → monthly_reports auto-updates ✅ |
| Appointment created | Trigger fires → monthly_reports auto-updates ✅ |
| Call/appointment cancelled | Trigger fires → monthly_reports refreshes ✅ |
| Data correction (edit) | Trigger fires → relevant month refreshes ✅ |
| Admin clicks "Sync Report Data" | Backfill endpoint seeds all historical months ✅ |

**No manual refresh needed.** The Reports page always shows current data.

---

## Architecture Notes

### Why Database Triggers?
- **Self-maintaining:** No matter how data gets into the DB (app, n8n, direct Supabase), triggers fire
- **Fast:** Pre-aggregated `monthly_reports` means O(1) reads for the Reports page
- **Scalable:** Works equally fast with 1 clinic or 1000 clinics
- **Resilient:** No scheduled jobs that can fail; no API endpoints to call

### Why the Backfill Endpoint?
- Seeds `monthly_reports` from existing `call_logs` + `appointments` (one-time historical population)
- Safe to call multiple times (upserts, not inserts)
- Gives admins a "recovery" button if data somehow gets out of sync

---

## Files Changed/Created

```
Created:
  ✅ app/api/reports/backfill/route.ts          (API endpoint for backfill)
  ✅ SUPABASE_SETUP.md                          (SQL instructions)
  ✅ REPORTS_FIX_SUMMARY.md                     (this file)

Modified:
  ✅ components/dashboard/settings/ClinicSettingsPanel.tsx
     - Added syncing state
     - Added handleSyncReports() function
     - Added "Sync Report Data" button in Data Management section
```

---

## Verification Checklist

After running the SQL + deploying the code:

- [ ] Supabase SQL ran without errors
- [ ] App deployed successfully
- [ ] Settings page loads without errors
- [ ] Click "Sync Report Data" → see success toast
- [ ] Navigate to Reports page
- [ ] Voice Inquiries card shows a number (not "—")
- [ ] System Appointments shows a number
- [ ] Engine Minutes Used shows minutes (not "—")
- [ ] Trend charts show 6 months of history
- [ ] Efficiency Rating percentage displays correctly

---

## Troubleshooting

**Q: I see "No data to backfill" but I have calls logged**
- A: Check your call_logs table directly in Supabase. If rows exist but have no `created_at`, that's the issue. All calls should have `created_at` filled.

**Q: Reports page still shows no data after backfill**
- A: 
  1. Hard refresh the page (Ctrl+Shift+R)
  2. Check Supabase SQL: run `SELECT * FROM monthly_reports ORDER BY report_month DESC LIMIT 3;`
  3. If no rows show up, check the backfill API response in browser DevTools for errors

**Q: Sync button shows error**
- A: Check browser console (F12) for the error. Common issues:
  - Not logged in
  - User is not admin/owner
  - No calls in call_logs table yet

**Q: New calls aren't updating the reports in real-time**
- A: The trigger is firing, but the Reports page caches data client-side. Click "Sync Report Data" or refresh the page.

---

## Next Steps (Optional Enhancements)

- Add a real-time sync indicator to the Reports page using Supabase realtime subscriptions
- Expose `upsert_monthly_report` as a typed RPC in `lib/database.types.ts` for better DX
- Add a scheduled job (Vercel Cron) to call `/api/reports/backfill` daily for extra resilience

---

**Status:** ✅ Ready to implement  
**Effort:** ~30 minutes (mostly running SQL)  
**Impact:** Reports page fully functional, always-current analytics
