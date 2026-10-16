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
- `src/store/auth.ts` — Zustand auth store with `login(user?)`, `logout()`, `user`, `isAuthenticated`, `organizationsWithProjects`, `setOrganizationsWithProjects`
- `src/components/` — UI components and component-level hooks
- `src/pages/` — Page components (sign-in, sign-up, dashboard, select-org, no-organization, members, projects)
- `src/layouts/` — Layout components (AppLayout, AuthLayout)
- `src/components/ui/` — shadcn/ui components (sidebar, dropdown-menu, etc.)
- `src/api/request.ts` — Axios instance with interceptors

## Auth Pattern
- `User` interface: `{ id?: string; name?: string; email: string; avatar?: string }`
- `OrganizationWithProjects` interface: `Organization & { projects: Project[] }`
- After sign-in, call `/me` endpoint to get user info, then `login({ name, email })` to store in Zustand
- Sign-up does NOT authenticate the user — it creates an account and redirects to sign-in
- Sign-in fetches both `getOrganizations()` and `getProjects()`, maps them into `organizationsWithProjects`, then passes to `login()` and `setOrganizationsWithProjects()`
- `NavUser` component reads `authUser` from `useAuthStore` to display name + email in sidebar
- `AppSidebar` reads from auth store, passes user to `NavUser`
- Sign-in calls `signIn` then `me()` sequentially, not in parallel

## Hook Pattern
- Hooks encapsulate ALL business logic (API calls, auth store, navigation, local state)
- Page components are thin — they destructure from hooks and render JSX only
- Page components should NOT have their own `useState` — all state moves into hooks
- Hooks return all state variables AND handlers to the page component
- Example: `useMembers()` returns `{ members, isLoading, refetch, selectedOrganization, isModalOpen, editingMember, isEditDialogOpen, isDeleteDialogOpen, handleEdit, handleDelete, onUpdateRole, onConfirmDelete, toggleIsModalOpen, setIsEditDialogOpen, setEditingMember, setIsDeleteDialogOpen }`
- Example: `useProject()` returns `{ project, isLoading, isSaving, publicUrl, navigate, editingName, nameValue, setNameValue, handleSaveName, setEditingName }`
- Navigation (`useNavigate`) and routing params (`useParams`) are called inside hooks, not page components
- Existing hooks: `useCreateOrganization`, `useCreateProject`, `useSignIn`, `useSignUp`, `useMembers`, `useProject`, `useNoOrganization`, `useSelectOrg`

## Code Conventions
- Use `@/` path aliases for `src/`
- No comments unless asked for
- Keep responses concise
- Always verify build passes (`npm run build`) after code changes
- When the user asks you to do something, take action without asking permission
- Use `todowrite` for multi-step tasks
- All copy added should be in Portuguese
- Always add `hover:cursor-pointer` to clickable elements (buttons, links, etc.)
- Always add a `;` at the end of lines
- Add blank lines between logical blocks in hooks (after `try`, `catch`, `finally`, before `toast`, before `navigate`, etc.)

## Component Patterns
- UI components receive all state and handlers from hooks/pages
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
