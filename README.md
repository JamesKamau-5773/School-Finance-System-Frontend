# School Financial System - Frontend

A modern, responsive React-based financial management system for St. Gerald High School. Provides comprehensive cashbook, fee management, inventory tracking, and financial reporting capabilities with role-based access control.

## Project Overview

**Version:** 1.0.0
**Framework:** React 19.2.4 + Vite 8.0.1
**Styling:** TailwindCSS 4.2.2
**Build Size:** 177.87 kB (gzipped)
**Mobile Responsive:** 9/10 Rating

### Core Features

- Cashbook management with real-time balance tracking
- Fee master configuration and levy creation
- Student directory with payment history
- Inventory/Stock keeper management
- Store ledger transactions
- Financial audit reports (Trial Balance)
- User management and role assignment
- Profile settings with password management
- Multi-device support (mobile hamburger menu, tablet, desktop)

## Quick Start

### Installation

```bash
cd /home/james/projects/school-financial-system/frontend
npm install
```

### Development

```bash
npm run dev
```

Server runs at [http://localhost:5173](http://localhost:5173)

### Production Build

```bash
npm run build
```

Output: `dist/` directory (ready for deployment)

### Lint Code

```bash
npm run lint
```

## Documentation Structure

All documentation is organized by topic for easy reference:

- **[ARCHITECTURE.md](./documentation/ARCHITECTURE.md)** - Technical architecture, component organization, data flow
- **[BUILD.md](./documentation/BUILD.md)** - Build process, optimization, performance metrics
- **[ENVIRONMENT_SETUP.md](./documentation/ENVIRONMENT_SETUP.md)** - Environment variables, configuration
- **[FEATURES.md](./documentation/FEATURES.md)** - Feature documentation and workflows
- **[RBAC.md](./documentation/RBAC.md)** - Role-based access control matrix
- **[API_INTEGRATION.md](./documentation/API_INTEGRATION.md)** - API endpoints, authentication, error handling
- **[AUTHENTICATION.md](./documentation/AUTHENTICATION.md)** - JWT auth, password workflows, security
- **[MOBILE.md](./documentation/MOBILE.md)** - Mobile design, hamburger menu, responsive breakpoints
- **[TESTING.md](./documentation/TESTING.md)** - Testing procedures, utilities, coverage
- **[DEPLOYMENT.md](./documentation/DEPLOYMENT.md)** - Deployment guides, CI/CD, production considerations
- **[TROUBLESHOOTING.md](./documentation/TROUBLESHOOTING.md)** - Common issues and solutions

## Technology Stack

### Core Dependencies

- React 19.2.4 - UI Framework
- Vite 8.0.1 - Build tool and dev server
- React Router 7.0.2 - Client-side routing
- TailwindCSS 4.2.2 - Utility-first CSS
- Axios - HTTP client
- React Query - Server state management
- Lucide React - Icon library
- React Hook Form - Form management

### Dev Dependencies

- ESLint 9.x - Code linting
- PostCSS 8.4 - CSS processing
- Vitest - Unit testing
- React Testing Library - Component testing

## Project Structure

```
src/
	api/                 - HTTP client and API integrations
	auth/                - Authentication and RBAC
	components/          - Reusable UI components
	context/             - React context (global state)
	features/            - Feature-specific pages and workflows
	layout/              - Layout components (MainLayout)
	utils/               - Utility functions
	test/                - Test setup and fixtures
	App.jsx              - Root component
	main.jsx             - Entry point
	index.css            - Global styles
	App.css              - App-level styles
```

## Performance

- Build time: 1.3-1.7 seconds
- Chunk size: 177.87 kB gzipped (main bundle)
- First Contentful Paint: < 2s (production)
- Time to Interactive: < 3.5s (production)

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 12+, Chrome Mobile Latest

## Contributing

Follow the patterns and standards documented in [ARCHITECTURE.md](./documentation/ARCHITECTURE.md).

## License

Internal Project - St. Gerald High School

## Support

For issues:
1. Check [TROUBLESHOOTING.md](./documentation/TROUBLESHOOTING.md)
2. Review relevant feature documentation
3. Check git history for context: `git log --oneline`
4. Examine browser console for errors
