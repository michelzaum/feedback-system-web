# AGENTS.md

## Project Overview
React + TypeScript + Vite + Tailwind CSS v4 + shadcn/ui + Zustand + React Router project.

## Build & Lint Commands
- `npm run build` — TypeScript check + Vite build
- `npm run lint` — ESLint
- `npm run lint:fix` — ESLint with auto-fix
- `npm run typecheck` — `tsc --noEmit`

## Project Structure
- `src/api/auth.ts` — API functions: `signIn`, `signUp`, `me`
- `src/pages/sign-in/` — Sign-in page + `useSignIn` hook
- `src/pages/sign-up/` — Sign-up page + `useSignUp` hook
- `src/store/auth.ts` — Zustand auth store with `login(user?)`, `logout()`, `user`, `isAuthenticated`
- `src/components/` — UI components and component-level hooks
- `src/pages/` — Page components (sign-in, sign-up, dashboard)
- `src/layouts/` — Layout components (AppLayout, AuthLayout)
- `src/components/ui/` — shadcn/ui components (sidebar, dropdown-menu, etc.)
- `src/api/request.ts` — Axios instance with interceptors

## Auth Pattern
- `User` interface: `{ id?: string; name?: string; email: string; avatar?: string }`
- After sign-in, call `/me` endpoint to get user info, then `login({ name, email })` to store in Zustand
- Sign-up does NOT authenticate the user — it creates an account and redirects to sign-in
- `NavUser` component reads `authUser` from `useAuthStore` to display name + email in sidebar
- `AppSidebar` reads from auth store, passes user to `NavUser`

## Hook Pattern
- Hooks encapsulate business logic (API calls, auth store, navigation)
- Pages compose hooks with UI components
- Example: `useSignIn()` returns `{ isLoading, onSubmit }`, page passes `onSubmit` to `LoginForm`
- Existing hooks: `useCreateOrganization`, `useCreateProject`, `useSignIn`

## Code Conventions
- Use `@/` path aliases for `src/`
- No comments unless asked for
- Keep responses concise
- Always verify build passes (`npm run build`) after code changes
- When the user asks you to do something, take action without asking permission
- Use `todowrite` for multi-step tasks

## Component Patterns
- UI components receive `onSubmit` handlers from hooks/pages
- Forms use `FormData` to extract values (`e.currentTarget`)
- `useAuthStore` is imported from `@/store/auth`
- Sidebar uses `Sidebar`, `SidebarFooter`, `SidebarHeader`, etc. from `@/components/ui/sidebar`

## Important
- **NEVER commit changes unless explicitly asked by the user. ALWAYS wait for explicit permission before committing.**
- The `/me` endpoint returns `{ message, name, email, avatar? }` and must be called after sign-in to get user name
- Sign-up does not return a token, so it does not authenticate the user
- Sign-in calls `signIn` then `me()` sequentially, not in parallel
- Never hardcode user data in components — always read from `useAuthStore`
- Sign-in calls `signIn` then `me()` sequentially, not in parallel
