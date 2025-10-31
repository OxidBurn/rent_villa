# Rent Villa

[![CI](https://github.com/OxidBurn/rent_villa/actions/workflows/ci.yml/badge.svg)](https://github.com/OxidBurn/rent_villa/actions/workflows/ci.yml)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Development

### Prerequisites

- Node.js 20+
- PostgreSQL (local or Vercel Postgres)
- npm or yarn

### Environment Setup

```bash
# Copy environment variables template
cp .env.local.example .env.local

# Install dependencies
npm install

# Setup database
npm run db:push

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm test` - Run unit tests
- `npm run test:e2e` - Run E2E tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run db:studio` - Open Drizzle Studio
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations

## Deployment

This project uses a modern CI/CD pipeline with GitHub Actions and Vercel.

### Quick Links

- **CI/CD Pipeline**: [GitHub Actions](https://github.com/OxidBurn/rent_villa/actions)
- **Production**: [Vercel Dashboard](https://vercel.com)
- **Error Tracking**: [Sentry](https://sentry.io)
- **Database**: Vercel Postgres

### Deployment Flow

1. **Development**: Work in feature branches locally
2. **Preview**: Push branch and create PR → automatic preview deployment
3. **Staging**: Merge to `main` → automatic staging deployment
4. **Production**: Manual promotion from Vercel dashboard

### Documentation

Complete deployment documentation is available in the [docs/deployment](docs/deployment) directory:

#### Core Documentation

- **[CI/CD Overview](docs/deployment/ci-cd-overview.md)** - Architecture and pipeline explanation
- **[Deployment Runbook](docs/deployment/deployment-runbook.md)** - Step-by-step deployment procedures
- **[Rollback Procedures](docs/deployment/rollback-procedures.md)** - How to rollback deployments
- **[Troubleshooting Guide](docs/deployment/troubleshooting-guide.md)** - Common issues and solutions
- **[Environment Variables](docs/deployment/environment-variables.md)** - Complete variable reference
- **[Incident Response](docs/deployment/incident-response.md)** - Production incident procedures

#### Additional Documentation

- **[Health Monitoring](docs/health-monitoring.md)** - Health check endpoint and monitoring setup
- **[Error Monitoring](docs/error-monitoring.md)** - Sentry integration and error tracking

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/OxidBurn/rent_villa)
