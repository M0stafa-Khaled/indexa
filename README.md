<div align="center">
  <img src="./public/logo.svg" alt="Indexa Logo" width="120" height="120" />
  
  # Indexa
  
  ### Organize Your Digital World
  
  <p>A hierarchical, authenticated information indexing platform for managing bookmarks and digital resources in a deeply nested tree structure.</p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
  [![Prisma](https://img.shields.io/badge/Prisma-7.6-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
  
  [Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Deployment](#-deployment) • [Documentation](#-documentation)
  
</div>

---

## 📖 About

**Indexa** is a modern bookmark management and information indexing platform that helps you organize your digital resources in a hierarchical tree structure. Whether you're managing personal bookmarks, building a knowledge base, or organizing team resources, Indexa provides an intuitive interface with powerful features.

> **Note:** This project was built with AI assistance as a development aid, but the architecture, design decisions, and implementation were guided by human oversight and requirements. AI tools were used to accelerate development while maintaining code quality and best practices.

## ✨ Features

### Core Functionality
- 🗂️ **Hierarchical Organization** - Organize bookmarks in unlimited nested folders
- 🔐 **User Authentication** - Secure authentication with NextAuth.js
- ⭐ **Favorites System** - Mark important items for quick access
- 🔍 **Search & Filter** - Quickly find bookmarks across your entire tree
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🎨 **Dark Mode Support** - Easy on the eyes with theme switching

### Technical Features
- 🚀 **Production-Ready SEO** - Comprehensive meta tags, Open Graph, Twitter Cards
- 📊 **Structured Data** - JSON-LD schemas for search engines
- 🔒 **Security Headers** - HSTS, CSP, X-Frame-Options, and more
- ⚡ **Performance Optimized** - AVIF/WebP images, compression, caching
- 📱 **PWA Support** - Progressive Web App with offline capabilities
- 🎯 **Type-Safe** - Full TypeScript implementation
- 🗄️ **Database-Driven** - PostgreSQL with Prisma ORM

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js 16.2](https://nextjs.org/) (App Router)
- **Language:** [TypeScript 5.0](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4.2](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Forms:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

### Backend
- **Runtime:** Node.js
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma 7.6](https://www.prisma.io/)
- **Authentication:** [NextAuth.js v5](https://next-auth.js.org/)
- **Validation:** [Zod](https://zod.dev/)

### DevOps & Tooling
- **Package Manager:** pnpm
- **Linting:** ESLint
- **Deployment:** Standalone output (Docker-ready)

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **pnpm** 8.x or higher
- **PostgreSQL** 14.x or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/m0stafa-khaled/indexa.git
   cd indexa
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/indexa"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"  # Generate with: openssl rand -base64 32
   
   # App
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Push database schema
   pnpm db:push
   
   # Or run migrations
   pnpm db:migrate
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Database Schema

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String?
  nodes     BookmarkNode[]
}

model BookmarkNode {
  id          String    @id @default(uuid())
  userId      String
  parentId    String?
  type        NodeType  # BOOKMARK | FOLDER
  title       String
  description String?
  url         String?
  isFavorite  Boolean
  parent      BookmarkNode?
  children    BookmarkNode[]
}
```

## 🔧 Available Scripts

```bash
# Development
pnpm dev              # Start development server

# Production
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:push          # Push schema to database
pnpm db:migrate       # Run migrations
pnpm db:generate      # Generate Prisma client
pnpm db:reset         # Reset database

# Code Quality
pnpm lint             # Run ESLint
```

```bash
# Build production bundle
pnpm build
```
---

<div align="center">
  
  **Made with ❤️ and ⚡ AI assistance**
  
  [Report Bug](https://github.com/m0stafa-khaled/indexa/issues) • [Request Feature](https://github.com/m0stafa-khaled/indexa/issues)
  
</div>
