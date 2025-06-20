# RentHub - Rental Marketplace Platform

A modern, full-stack rental marketplace platform built with React, TypeScript, and Supabase. RentHub connects people who want to rent items with those who have items to share, creating a trusted community marketplace.

## 🚀 Features Implemented (Phase 1)

### Core Architecture

- **React 18** with TypeScript for type safety
- **React Router** for client-side routing
- **Tailwind CSS** with custom blue color scheme
- **Supabase** integration for backend services
- **Context API** for global state management

### Pages & Functionality

- **Homepage**: Hero section, search bar, featured categories, recent listings, trust & safety info
- **Browse/Search Page**: Advanced filtering, product grid/list view, sorting options
- **Responsive Design**: Mobile-first design that works on all devices
- **Navigation**: Sticky header with user authentication states

### UI Components

- Modern blue color scheme (#3B82F6, #1E40AF, #60A5FA)
- Custom search bar with location and category filters
- Product cards with image galleries and pricing
- Interactive filters and sorting options
- Responsive navigation with mobile menu

### Backend Integration

- Supabase client setup and configuration
- Database schema for users, products, categories, images, and messages
- Authentication context ready for user management
- Type-safe database interactions with TypeScript

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Routing**: React Router DOM
- **UI Components**: Radix UI primitives with custom styling
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State Management**: React Context API
- **Build Tool**: Vite
- **Package Manager**: npm

## 🎨 Design System

### Colors

- **Primary Blue**: #3B82F6 (main actions, headers)
- **Dark Blue**: #1E40AF (text, borders)
- **Light Blue**: #60A5FA (accents, hover states)
- **Background**: #F8FAFC (light gray-blue)

### Typography

- **Font Family**: Inter
- **Headers**: Bold, 24-32px
- **Body**: Regular, 16px
- **Components**: Consistent spacing and rounded corners

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/          # Navigation, Layout components
│   ├── common/          # Shared components like SearchBar
│   └── ui/              # Radix UI components (buttons, cards, etc.)
├── context/             # React Context providers
├── lib/                 # Utilities and Supabase client
├── pages/               # Route components
│   ├── auth/           # Authentication pages
│   ├── Home.tsx        # Main landing page
│   ├── Browse.tsx      # Search and browse page
│   └── ...             # Other page components
└── App.tsx             # Main app with routing
```

## 🚧 Features to Implement (Next Phases)

### Authentication System

- Email/password login and registration
- User profile management
- Admin role management
- Protected routes

### Product Management

- Add/edit product listings
- Image upload with Supabase Storage
- Product categories and pricing
- Availability management

### Communication

- Real-time messaging between users
- Product inquiry system
- WhatsApp and email integration

### Advanced Features

- User verification system
- Reviews and ratings
- Geographic search
- Admin dashboard

## 🏃‍♂️ Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start development server:**

   ```bash
   npm run dev
   ```

3. **Type checking:**

   ```bash
   npm run typecheck
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🔧 Configuration

The application is configured to work with the provided Supabase instance:

- **URL**: https://epneefbwjmqwitpguwk.supabase.co
- **API Key**: Configured in `src/lib/supabase.ts`

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: < 768px (single column, touch-optimized)
- **Tablet**: 768px - 1199px (adapted grid layout)
- **Desktop**: 1200px+ (full multi-column layout)

## 🎯 Current Status

This is Phase 1 of the RentHub platform, focusing on:

- ✅ Foundation architecture and setup
- ✅ Homepage with search and categories
- ✅ Browse/search functionality with filters
- ✅ Responsive design and navigation
- ✅ Database integration setup
- 🚧 Authentication (placeholder pages ready)
- 🚧 Product management (to be implemented)
- 🚧 Messaging system (to be implemented)

The application is production-ready for the implemented features and can be incrementally enhanced with additional functionality.
