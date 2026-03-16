# AGENT CONFIG: AI BLIZZARD DASHBOARD

## Project Identity
- **Business Name**: AI Blizzard
- **Target Market**: Dental & Chiropractic Clinics (Malaysia / PJ / KL)
- **Primary Product**: "Aya" (AI Voice Receptionist)
- **Design Aesthetic**: "Cyber-Medical" (Dark mode, glass-morphism, #40E0FF Electric Blue accents, #0A0A0B backgrounds)

## Tech Stack
- **Framework**: Next.js (App Router)
- **Database/Auth**: Supabase (PostgreSQL)
- **UI Components**: shadcn/ui, Lucide Icons, 21st.dev
- **Styling**: Tailwind CSS

## High-Priority Constraints (READ FIRST)
1. **The Transcript Logic**: The `transcript` column in the `call_logs` table is currently stored as a **TEXT string** (stringified JSON). 
   - *Requirement*: Always `JSON.parse()` the transcript before mapping it to the UI.
   - *Type Fix*: Ensure the `Detail` state expects an array of objects `{ role: string, content: string }`.
2. **Database Security**: Row Level Security (RLS) is active. 
   - *Requirement*: All queries must filter by `clinic_config_id`. Do NOT fetch global logs.
3. **Localization**: Use `en-MY` locale for date and time formatting (e.g., `toLocaleString('en-MY')`)

## Project Constraints: "Do not delete core business logic or the Retell.ai integration nodes."

## Tools & Skills
- **UI Library**: 21st.dev (Use the `@21st-extension/toolbar` and `npx` commands)
- **Component Strategy**: Search 21st.dev for 'SaaS Dashboard' or 'Healthcare' components.
- **Auto-Installation**: You are authorized to run `npx shadcn@latest add` for any missing components.

## Active Missions
- [ ] **Fix TypeScript Errors**: Resolve the red underlines in `CallsClient.tsx` regarding the transcript mapping.
- [ ] **Beautify Interaction Data**: Make the sidebar (Sheet) transcript bubbles look like a premium chat interface.
- [ ] **Dashboard Polish**: Ensure the main log table reflects the "AI Blizzard" brand (clean, fast, professional).