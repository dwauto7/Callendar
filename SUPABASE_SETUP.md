# Supabase Setup: Monthly Reports Auto-Aggregation

## Prerequisites
- You have access to your Supabase project dashboard
- You are in the correct project (production or staging)

---

## Step 1: Create the Unique Constraint (if not exists)

In **Supabase Dashboard > SQL Editor**, run:

```sql
-- Add unique constraint on (clinic_config_id, report_month) if it doesn't exist
ALTER TABLE monthly_reports
  ADD CONSTRAINT monthly_reports_clinic_month_unique
  UNIQUE (clinic_config_id, report_month)
  DEFERRABLE INITIALLY DEFERRED;
```

**Note:** If you get an error "constraint already exists", that's fine — proceed to Step 2.

---

## Step 2: Create the Main Aggregation Function

```sql
-- Core aggregation function
CREATE OR REPLACE FUNCTION upsert_monthly_report(
  p_clinic_config_id uuid,
  p_month            date   -- any date in the target month, e.g. '2025-03-15'
)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_month_start   date    := date_trunc('month', p_month)::date;
  v_month_end     date    := (date_trunc('month', p_month) + interval '1 month')::date;
  v_calls         integer := 0;
  v_minutes       numeric := 0;
  v_bookings      integer := 0;
  v_revenue       numeric := 0;
  v_period        text;
BEGIN
  -- Aggregate calls for this month
  SELECT
    COUNT(*)::integer,
    COALESCE(SUM(duration_min), 0)
  INTO v_calls, v_minutes
  FROM call_logs
  WHERE clinic_config_id = p_clinic_config_id
    AND created_at >= v_month_start
    AND created_at <  v_month_end;

  -- Aggregate non-cancelled appointments booked this month
  SELECT
    COUNT(*)::integer,
    COALESCE(SUM(projected_revenue), 0)
  INTO v_bookings, v_revenue
  FROM appointments
  WHERE clinic_id = p_clinic_config_id
    AND status    != 'Cancelled'
    AND created_at >= v_month_start
    AND created_at <  v_month_end;

  -- Human-readable period label
  v_period := trim(to_char(v_month_start, 'Month')) || ' ' || to_char(v_month_start, 'YYYY');

  -- Upsert: insert or update the monthly row
  INSERT INTO monthly_reports (
    clinic_config_id,
    report_month,
    report_period,
    total_calls,
    total_bookings,
    total_minutes_used,
    gross_revenue_generated
  )
  VALUES (
    p_clinic_config_id,
    v_month_start,
    v_period,
    v_calls,
    v_bookings,
    v_minutes,
    v_revenue
  )
  ON CONFLICT (clinic_config_id, report_month)
  DO UPDATE SET
    total_calls             = EXCLUDED.total_calls,
    total_bookings          = EXCLUDED.total_bookings,
    total_minutes_used      = EXCLUDED.total_minutes_used,
    gross_revenue_generated = EXCLUDED.gross_revenue_generated,
    report_period           = EXCLUDED.report_period;
END;
$$;
```

---

## Step 3: Create Trigger on `call_logs`

```sql
CREATE OR REPLACE FUNCTION trg_fn_refresh_report_from_calls()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM upsert_monthly_report(OLD.clinic_config_id, OLD.created_at::date);
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM upsert_monthly_report(NEW.clinic_config_id, NEW.created_at::date);
    -- Refresh old month too if the call moved across months (data corrections)
    IF date_trunc('month', NEW.created_at) <> date_trunc('month', OLD.created_at) THEN
      PERFORM upsert_monthly_report(OLD.clinic_config_id, OLD.created_at::date);
    END IF;
  ELSE
    PERFORM upsert_monthly_report(NEW.clinic_config_id, NEW.created_at::date);
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_monthly_report_calls ON call_logs;
CREATE TRIGGER trg_monthly_report_calls
AFTER INSERT OR UPDATE OR DELETE ON call_logs
FOR EACH ROW EXECUTE FUNCTION trg_fn_refresh_report_from_calls();
```

---

## Step 4: Create Trigger on `appointments`

```sql
CREATE OR REPLACE FUNCTION trg_fn_refresh_report_from_appointments()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM upsert_monthly_report(OLD.clinic_id, OLD.created_at::date);
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM upsert_monthly_report(NEW.clinic_id, NEW.created_at::date);
    IF date_trunc('month', NEW.created_at) <> date_trunc('month', OLD.created_at) THEN
      PERFORM upsert_monthly_report(OLD.clinic_id, OLD.created_at::date);
    END IF;
  ELSE
    PERFORM upsert_monthly_report(NEW.clinic_id, NEW.created_at::date);
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_monthly_report_appointments ON appointments;
CREATE TRIGGER trg_monthly_report_appointments
AFTER INSERT OR UPDATE OR DELETE ON appointments
FOR EACH ROW EXECUTE FUNCTION trg_fn_refresh_report_from_appointments();
```

---

## Step 5: Verify Setup

In SQL Editor, run a quick test:

```sql
-- Test: Call the function directly for a clinic (replace UUID with a real one)
SELECT upsert_monthly_report('your-clinic-config-id-here'::uuid, now()::date);

-- Then check that monthly_reports was populated/updated:
SELECT * FROM monthly_reports 
WHERE clinic_config_id = 'your-clinic-config-id-here'::uuid
ORDER BY report_month DESC LIMIT 1;
```

---

## How It Works Now

1. **New Data:** When a call is logged or appointment is created, the trigger automatically calls `upsert_monthly_report` → monthly stats update in real-time ✅

2. **Data Corrections:** If a call/appointment is edited or deleted, the relevant month's report refreshes ✅

3. **Historical Backfill:** Use the **"Sync Report Data"** button in Settings to populate all historical months from existing `call_logs` + `appointments` (calls the `/api/reports/backfill` endpoint) ✅

4. **Reports Page:** Now pulls accurate, always-fresh data from `monthly_reports` ✅

---

## Troubleshooting

**Q: I got "constraint already exists" error**
- A: That's fine, it means it's already set up. Continue to Step 2.

**Q: The trigger function fails with "clinic_config_id not found"**
- A: Check that your `call_logs` table has a `clinic_config_id` column (it should). Run: `SELECT column_name FROM information_schema.columns WHERE table_name='call_logs';`

**Q: Monthly reports still not showing after running the sync**
- A: Check `monthly_reports` table directly in Supabase. If rows exist with the right data, the Reports page component may need a hard refresh (Ctrl+Shift+R). If rows are empty, check browser console for API errors.

**Q: Data is outdated in reports**
- A: The next INSERT/UPDATE/DELETE on `call_logs` or `appointments` will trigger a refresh. Or click "Sync Report Data" in Settings to force a refresh.
