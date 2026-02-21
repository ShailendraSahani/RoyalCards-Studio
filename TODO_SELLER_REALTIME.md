# Become Seller - Real-time Implementation Plan

## Phase 1: Backend - Real-time SSE Endpoint ✅
- [x] Create `/api/seller/realtime` endpoint for seller status updates
- [x] Update admin users API to broadcast status changes via SSE

## Phase 2: Frontend - Become Seller Page with Real-time ✅
- [x] Add SSE connection to become-seller page
- [x] Add toast notifications for status changes
- [x] Auto-refresh session when status changes to approved

## Phase 3: Seller Dashboard (when approved) ✅
- [x] Create seller dashboard page at `/seller/dashboard`
- [x] Add seller-specific cards management
- [x] Add seller-specific orders view
- [x] Create seller API routes (stats, products, orders)

## Phase 4: Navigation Updates ✅
- [x] Update Navbar to show Seller Dashboard link for approved sellers
- [x] Conditionally show "Become a Seller" vs "Seller Dashboard"

## Files Created:
1. `/api/seller/realtime/route.ts` - SSE endpoint for seller status
2. `/hooks/useSellerRealtime.ts` - Custom hook for realtime updates
3. `/seller/dashboard/page.tsx` - Seller dashboard
4. `/api/seller/stats/route.ts` - Seller stats API
5. `/api/seller/products/route.ts` - Seller products API
6. `/api/seller/orders/route.ts` - Seller orders API

## Files Modified:
1. `/become-seller/page.tsx` - Added real-time updates and toast notifications
2. `/components/Navbar.tsx` - Added seller dashboard link

## Testing:
- [x] Test seller registration
- [x] Test admin approval
- [x] Test real-time update on become-seller page
- [x] Test seller dashboard access

## How It Works:
1. User submits seller request from `/become-seller`
2. Admin approves/rejects from `/admin/users`
3. User receives real-time notification when status changes
4. Once approved, user can access `/seller/dashboard`
5. Navbar shows "Seller Dashboard" instead of "Become a Seller"
