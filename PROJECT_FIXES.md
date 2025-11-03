# Project Startup Issues and Solutions

This document outlines the problems that prevented the project from starting and the solutions implemented to fix them.

## Issues Found and Fixed

### 1. Stripe Environment Variable Mismatch

**Problem**: The application was failing to start with the error:
```
error: Neither apiKey nor config.authenticator provided
```

**Root Cause**: In [`src/Backend/Webhook.ts`](src/Backend/Webhook.ts:4), the code was trying to access `process.env.STRIPE_SECRET_KEY` but the environment variable in [`.env`](.env:4) was named `STRIPE_SECRET` (without the `_KEY` suffix).

**Solution**: Changed the environment variable reference in [`Webhook.ts`](src/Backend/Webhook.ts:4) from:
```typescript
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
```
to:
```typescript
const stripe = new Stripe(process.env.STRIPE_SECRET!, {
```

### 2. Missing Stripe Webhook Secret

**Problem**: The [`Webhook.ts`](src/Backend/Webhook.ts:8) file was trying to access `process.env.STRIPE_WEBHOOK_SECRET` which wasn't defined in the [`.env`](.env) file.

**Solution**: Added the missing environment variable to [`.env`](.env:6):
```
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

Note: You'll need to replace `whsec_your_webhook_secret_here` with your actual Stripe webhook secret.

### 3. Syntax Error in NotificationProvider.tsx

**Problem**: There was an orphaned `clearTimeout()` call without any arguments in [`src/components/NotificationProvider.tsx`](src/components/NotificationProvider.tsx:17).

**Solution**: Removed the orphaned `clearTimeout()` call from line 17.

### 4. Multiple Export Statements

**Problem**: Several components had duplicate `export default` statements:
- [`src/Pages/TokenLookup.tsx`](src/Pages/TokenLookup.tsx:102-104)
- [`src/Pages/PassReset.tsx`](src/Pages/PassReset.tsx:71-73)
- [`src/Pages/Main.tsx`](src/Pages/Main.tsx:342-344)

**Solution**: Removed the duplicate export statements from each file.

### 5. JSX Syntax Error in Main.tsx

**Problem**: In [`src/Pages/Main.tsx`](src/Pages/Main.tsx:171), there was a missing quote around the className attribute:
```jsx
<div className.prod-game-showcase">
```

**Solution**: Fixed the JSX syntax by adding the missing quote:
```jsx
<div className="prod-game-showcase">
```

## Verification

After implementing these fixes:
1. The server starts successfully with `bun run dev`
2. The application serves the HTML content without errors
3. All TypeScript compilation errors have been resolved

## Recommendations

1. **Environment Variables**: Make sure to replace the placeholder webhook secret with your actual Stripe webhook secret
2. **Code Review**: Consider implementing a linting setup to catch syntax errors and duplicate exports early
3. **Environment Variable Consistency**: Establish a consistent naming convention for environment variables across the project

## Files Modified

1. [`src/Backend/Webhook.ts`](src/Backend/Webhook.ts) - Fixed Stripe environment variable reference
2. [`.env`](.env) - Added missing STRIPE_WEBHOOK_SECRET
3. [`src/components/NotificationProvider.tsx`](src/components/NotificationProvider.tsx) - Removed orphaned clearTimeout()
4. [`src/Pages/TokenLookup.tsx`](src/Pages/TokenLookup.tsx) - Removed duplicate export
5. [`src/Pages/PassReset.tsx`](src/Pages/PassReset.tsx) - Removed duplicate export
6. [`src/Pages/Main.tsx`](src/Pages/Main.tsx) - Fixed JSX syntax and removed duplicate export

The project is now running successfully at http://localhost:3000