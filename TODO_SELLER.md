# Become Seller Feature - COMPLETED

## Phase 1: Backend ✅
- [x] 1. Update User Model - Add 'seller' role and seller-specific fields
- [x] 2. Create seller registration API route
- [x] 3. Update auth.ts to include seller in session
- [x] 4. Update TypeScript types for next-auth

## Phase 2: Frontend ✅
- [x] 5. Create Become Seller page (frontend form)
- [x] 6. Update Navbar - Make "Become a Seller" button work

## Phase 3: Admin Panel ✅
- [x] 7. Admin can view pending seller requests
- [x] 8. Admin can approve/reject seller requests
- [x] 9. Filter to show pending sellers

## Files Created/Modified:
1. src/models/User.ts - Added seller fields
2. src/lib/auth.ts - Added seller to session
3. src/types/next-auth.d.ts - Added seller types
4. src/app/api/seller/register/route.ts - Seller registration API
5. src/app/become-seller/page.tsx - Become seller page
6. src/components/Navbar.tsx - Added seller link
7. src/app/api/admin/users/route.ts - Added seller status update
8. src/app/admin/users/page.tsx - Admin seller approval UI
