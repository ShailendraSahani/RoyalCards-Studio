# SSE Error Fix Plan

## Issue
`[Realtime] SSE Error: {}` - Console error when connecting to realtime endpoint

## Root Causes
1. The `/api/realtime` endpoint returns 401 when session is not available
2. userId from session might be email (not valid ObjectId) causing MongoDB watch errors
3. Client-side error handling doesn't log meaningful information

## Fix Plan

### 1. Fix API route error handling
- [ ] Improve error handling in `/api/realtime/route.ts` to handle non-ObjectId userId
- [ ] Add proper error messages in SSE response instead of HTTP status codes

### 2. Fix userId handling
- [ ] Support both email and ObjectId formats for userId
- [ ] Add fallback logic for different user identification methods

### 3. Improve client-side error logging
- [ ] Add better error logging in `useRealtime.ts`
- [ ] Handle 401 errors gracefully with user-friendly messages
- [ ] Add connection state tracking for better UX
