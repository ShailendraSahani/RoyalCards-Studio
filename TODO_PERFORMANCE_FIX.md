# Performance Fix TODO List

## Priority 1: Critical Fixes
- [ ] 1. Fix MongoDB double connection (mongodb.ts) - Using both MongoClient and Mongoose
- [ ] 2. Fix homepage polling (page.tsx) - Remove 30-second interval polling
- [ ] 3. Remove console.log from middleware

## Priority 2: High Impact
- [ ] 4. Optimize CSS - Remove blocking Google Fonts import
- [ ] 5. Add caching to cards API route
- [ ] 6. Optimize real-time connection settings

## Priority 3: Nice to Have
- [ ] 7. Reduce Framer Motion bundle size
- [ ] 8. Add image optimization
- [ ] 9. Lazy load components
