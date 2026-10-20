# Impruv — Frontend

Impruv is a customer feedback management platform designed to help companies collect, organize, and turn customer feedback into meaningful product improvements.

This repository contains the frontend application, providing the interface for users to manage organizations, projects, and customer feedback through a centralized workspace.

## Features

- **Authentication:** Sign in and account registration.
- **Organization management:** Create and manage organizations.
- **Project management:** Organize projects within an organization.
- **Feedback management:** Access and manage feedback submitted by customers.
- **Team management:** Manage organization members according to their roles and permissions.
- **Public feedback submission:** Allow customers to submit feedback through project-specific public pages.
- **Role-based interface:** Adapt available actions and navigation according to the user's role within the selected organization.

## Tech Stack

| Technology | Purpose |
|---|---|
| React | Component-based user interface |
| TypeScript | Static typing and improved maintainability |
| Vite | Development server and build tooling |
| React Router | Client-side routing and navigation |
| Axios | HTTP communication with the backend API |
| Tailwind CSS | Utility-first styling |

## Architecture

The application follows a component-based architecture, organized around the main features and responsibilities of the product.

### Main architectural concepts

- **Component-based UI:** Reusable components keep the interface consistent and reduce duplication.
- **Feature-oriented organization:** Application screens and related components are grouped by their responsibilities.
- **API service layer:** Dedicated API services centralize HTTP communication and separate backend integration from UI components.
- **Client-side routing:** React Router handles navigation between application screens without requiring a full page reload.
- **Environment-based configuration:** The backend API URL is configured through environment variables, allowing the application to run against different environments.

### High-level request flow

```text
User Interaction
       |
       v
React Pages and Components
       |
       v
API Service Layer
       |
       v
Axios HTTP Client
       |
       v
Backend REST API
```

The frontend is responsible for rendering the user interface, handling navigation and user interactions, and communicating with the backend. Business rules, authorization, and data persistence are handled by the backend.

### Authentication and authorization

The application communicates with the backend using HTTP requests and supports cookie-based authentication.

Authentication state and access to protected functionality depend on the backend's session and authorization rules. Organization roles determine which management actions are available to each user.

The backend remains the source of truth for authorization; hiding or disabling frontend controls is not a substitute for server-side permission checks.

### Client-side routing and deployment

The application uses React Router to map URLs to React components.

Because this is a single-page application (SPA), the production hosting environment must serve `index.html` for frontend routes that do not correspond to physical files. This allows direct navigation and page refreshes on routes such as `/overview`, `/projects`, and `/sign-in`.

## Getting Started

### Prerequisites

- Node.js
- npm
- Access to a running instance of the Impruva backend API, or a locally running backend

### Installation

Clone the repository and install its dependencies:

```bash
git clone https://github.com/michelzaum/feedback-system-web.git
cd feedback-system-web
npm install
```

### Environment Variables

Create a `.env.development` file in the project root:

```env
VITE_API_URL=http://localhost:3001
```

Replace the URL with the address of your backend API if it runs on a different host or port.

For production, configure `VITE_API_URL` to point to the deployed backend API in your hosting provider's environment settings.

> **Note:** Vite exposes variables prefixed with `VITE_` to client-side code. Never store passwords, private API keys, or other secrets in these variables.

### Run Locally

Start the development server:

```bash
npm run dev
```

Vite will display the local URL in the terminal, typically `http://localhost:5173`.

### Build for Production

Generate the production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Backend Integration

The frontend communicates with a separate REST API responsible for authentication, organizations, projects, team membership, and feedback data.

The backend manages business logic, access control, and database operations. This separation allows the frontend and backend to be developed and deployed independently.

## Deployment

The frontend is deployed on Render as a static web application.

The production build is generated using Vite, and the published output is served by the hosting platform. SPA rewrite rules ensure that client-side routes resolve correctly when accessed directly or refreshed.

The backend API and database are deployed separately.

## Project Goals

Impruv is being developed to provide a practical workflow for collecting customer feedback and helping teams translate customer insights into actionable product improvements.

The project also explores maintainable frontend architecture, typed development with TypeScript, API integration, authentication, and production deployment.

## License

No license has been specified yet. All rights are reserved by the project owner unless a license is added to this repository.
