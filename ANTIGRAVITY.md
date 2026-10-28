# ANTIGRAVITY WORKSPACE GUIDELINES & PROJECT ARCHITECTURE

## 🎯 PROJECT IDENTITY & OVERVIEW
- **Project Name:** FlashGroup (Càng đông, càng rẻ)
- **Domain:** Social Group Buying Marketplace & Smart Locker Logistics (Nền tảng mua gom siêu cục bộ theo khu dân cư, KTX, tòa nhà văn phòng kết hợp nhận hàng qua tủ Locker thông minh).
- **Notice on Legacy Code:** The old "Trạm Nghỉ" / "Cupfy" project has been completely replaced. Do NOT revert, restore, or mix in any legacy Next.js / Trạm Nghỉ files.

---

## 🌐 DEPLOYMENT & ENVIRONMENTS
1. **Production Live URL:** `https://cupfy.space` (and `https://www.cupfy.space`)
   - Platform: Vercel (Auto-deployed from GitHub repo `chitintran-hash/done.` branch `main`).
   - Config: `vercel.json` (Vite framework preset, outputDirectory `dist`, SPA fallback rewrite to `/index.html`).
2. **Local Development:** `http://localhost:5173/`
   - Command: `npm run dev`
3. **Build & Type Check:**
   - Command: `npm run build` (`tsc -b && vite build`)
   - Rule: Always verify that `npm run build` succeeds with 0 TypeScript errors before pushing.

---

## 🏗 TECH STACK
- **Framework & Tooling:** React 18, Vite 5, TypeScript 5.6, Tailwind CSS 3.4
- **Routing:** React Router DOM v6
- **Maps:** MapLibre GL JS (Vector map tiles with Vietnamese street labels) + Leaflet fallback
- **State & Storage:** Dual-mode architecture:
  - Local Storage Prototype Fallback (`flashgroup_v3_*` keys).
  - Supabase client (`@supabase/supabase-js`) for realtime synchronization when keys are provided.
- **Icons & UI Components:** Lucide React, Custom Mobile Bottom Navigation Bar, Presenter Panel.

---

## 🔑 CRITICAL ARCHITECTURAL RULES FOR ANTIGRAVITY
1. **Instant Access / Zero Blockers:**
   - In `src/App.tsx`, `useLocalDemoMode` MUST remain initialized to `true` (or fallback to true when Supabase env vars are absent).
   - `currentUser` MUST default to `createInitialUsers()[0]` (Buyer: Nguyễn Minh Anh) so that any judge, teacher, or user opening `https://cupfy.space` immediately sees the interactive app instead of being blocked by a login or setup screen.
2. **Key Demo Scenarios (Must Preserve):**
   - **Deal Dâu Tây Đà Lạt (`room-dau-dalat`):**
     - Starts at 19/20 participants (price 99.000đ).
     - Adding 1 participant triggers the 20/20 milestone, dropping price to 89.000đ.
     - Shared shipping math: 60.000đ / 20 = 3.000đ/buyer.
     - Checkout total: 89.000đ + 3.000đ = 92.000đ with Smart Locker QR code generation.
   - **3 User Roles:**
     - `buyer`: Discovery, FlashMap, My Rooms, Orders, Favorites, Support.
     - `supplier`: Supplier Dashboard, Catalog, Order Batching, Logistics Pickup QR scanning.
     - `admin`: Overview, User/Supplier management, Compliance, Settlement & Payouts.
   - **Presenter Quick Switcher:** Keep the floating presentation panel active for quick role switching during slide presentations.
3. **Git Collaboration Workflow:**
   - Pull before editing: `git pull origin main`
   - Test locally: `npm run dev` & `npm run build`
   - Push to auto-deploy: `git push origin main` -> Vercel updates `cupfy.space` automatically in ~30 seconds.
