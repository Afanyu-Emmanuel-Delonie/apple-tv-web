# Apple TV - File Structure Documentation

## Project Overview
A modern news and opportunities platform built with React, Vite, and Firebase.

---

## Directory Structure

```
src/
├── admin/                      # Admin dashboard module
│   ├── components/            # Reusable admin components
│   │   ├── ConfirmDialog.jsx # Confirmation dialog for destructive actions
│   │   ├── Modal.jsx         # Reusable modal component
│   │   └── Toast.jsx         # Toast notification component
│   ├── layouts/              # Admin layout wrappers
│   │   └── AdminLayout.jsx   # Main admin layout with sidebar & header
│   ├── pages/                # Admin page components
│   │   ├── AdminArticles.jsx      # Articles management (CRUD)
│   │   ├── AdminDashboard.jsx     # Dashboard with stats & overview
│   │   ├── AdminEvents.jsx        # Events management (CRUD)
│   │   ├── AdminLogin.jsx         # Admin login page
│   │   ├── AdminNotifications.jsx # Notifications management
│   │   ├── AdminOpportunities.jsx # Opportunities management (CRUD)
│   │   ├── AdminRegister.jsx      # Admin registration page
│   │   ├── AdminSettings.jsx      # Admin settings page
│   │   ├── AdminSubmissions.jsx   # User submissions review
│   │   └── AdminUsers.jsx         # User management (CRUD)
│   └── styles/               # Admin-specific styles
│       └── responsive.css    # Responsive utility styles
│
├── app/                       # Application core
│   └── App.jsx               # Main app component with routing
│
├── assets/                    # Static assets
│   ├── latest-news/          # News article images
│   ├── apple-tv-logo.png     # Brand logo
│   └── vite.svg              # Vite logo
│
├── components/                # Reusable UI components
│   ├── navigation/           # Navigation components
│   │   └── Navbar.jsx        # Main navigation bar
│   ├── FeaturedHighlights.jsx # Featured content section
│   ├── Footer.jsx            # Site footer
│   ├── Hero.jsx              # Hero section
│   ├── LatestNews.jsx        # Latest news section
│   ├── NoContent.jsx         # Empty state component
│   ├── OpportunitiesCTA.jsx  # Opportunities call-to-action
│   ├── RegionalNews.jsx      # Regional news section
│   ├── ScrollToTop.jsx       # Auto-scroll to top on route change
│   └── whatsappCTA.jsx       # WhatsApp call-to-action
│
├── constants/                 # Static data and configuration
│   ├── events.js             # Events data
│   ├── highlights.js         # Featured highlights data
│   ├── navigation.js         # Navigation menu items
│   ├── news.js               # News articles data
│   ├── opportunities.js      # Opportunities data
│   ├── regionalNews.js       # Regional news data
│   └── scholarships.js       # Scholarships data
│
├── hooks/                     # Custom React hooks
│   └── useNetworkStatus.js   # Network connectivity detection
│
├── layouts/                   # Layout wrappers
│   └── MainLayout.jsx        # Main site layout with navbar & footer
│
├── pages/                     # Page components
│   ├── AboutUs.jsx           # About us page
│   ├── ArticleDetailsPage.jsx # Single article view
│   ├── Category.jsx          # Category listing page
│   ├── EventDetailsPage.jsx  # Single event view
│   ├── Events.jsx            # Events listing page
│   ├── Home.jsx              # Homepage
│   ├── NetworkError.jsx      # Offline error page
│   ├── NotFound.jsx          # 404 page
│   ├── Opportunities.jsx     # Opportunities listing page
│   ├── RegionalNewsPage.jsx  # Regional news page
│   ├── ScholarshipsPage.jsx  # Scholarships page
│   └── SubmitStory.jsx       # User submission form
│
├── services/                  # External services integration
│   └── firebase/             # Firebase configuration & services
│       └── client.js         # Firebase client setup
│
├── index.css                  # Global styles
└── main.jsx                   # Application entry point
```

---

## Planned Structure for Firebase Integration

```
src/
├── services/
│   └── firebase/
│       ├── config.js          # Firebase configuration
│       ├── auth.js            # Authentication services
│       ├── firestore.js       # Firestore database services
│       ├── storage.js         # Firebase Storage services
│       └── index.js           # Barrel export
│
├── contexts/                  # React Context providers
│   ├── AuthContext.jsx        # Authentication context
│   └── ThemeContext.jsx       # Theme context (if needed)
│
├── utils/                     # Utility functions
│   ├── formatters.js          # Date, currency formatters
│   ├── validators.js          # Form validation helpers
│   └── helpers.js             # General helper functions
│
└── types/                     # TypeScript types (future)
    ├── user.ts
    ├── article.ts
    └── submission.ts
```

---

## Key Features by Module

### Public Site
- **Home**: Hero, latest news, featured highlights, regional news
- **Articles**: Category filtering, article details, search
- **Events**: Event listings, event details, filtering
- **Opportunities**: Job listings, filtering, pagination
- **Submissions**: User-submitted content form

### Admin Dashboard
- **Authentication**: Login, registration, role-based access
- **Content Management**: Articles, events, opportunities CRUD
- **Submissions**: Review, approve/reject user submissions
- **Users**: User management with roles (Admin, Editor, Author)
- **Notifications**: Real-time notification system
- **Analytics**: Dashboard with stats and insights

---

## State Management

### Current Approach
- **Local State**: useState for component-level state
- **localStorage**: Submissions, user preferences
- **Props**: Data passing between components

### Future Approach (with Firebase)
- **Firebase Realtime**: Live data synchronization
- **Context API**: Global state (auth, theme)
- **React Query**: Server state management (optional)

---

## Styling Approach

- **Tailwind CSS**: Utility-first CSS framework
- **Custom CSS**: Global styles in index.css
- **Responsive Design**: Mobile-first approach
- **Design System**:
  - Primary Color: #002fa7 (Brand Blue)
  - Success: #047857 (Green)
  - Warning: #ea580c (Orange)
  - Error: #dc2626 (Red)
  - Font: Playfair Display (headings), System fonts (body)

---

## Routing Structure

### Public Routes
```
/                           → Home
/category/:slug             → Category page
/regional-news              → Regional news
/article/:id                → Article details
/event/:id                  → Event details
/opportunities              → Opportunities listing
/events                     → Events listing
/about-us                   → About us
/submit-story               → Submission form
```

### Admin Routes
```
/admin/login                → Admin login
/admin/register             → Admin registration
/admin/dashboard            → Dashboard
/admin/articles             → Articles management
/admin/submissions          → Submissions review
/admin/events               → Events management
/admin/opportunities        → Opportunities management
/admin/users                → User management
/admin/notifications        → Notifications
/admin/settings             → Settings
```

---

## Data Flow

### Current (Development)
1. Static data from constants files
2. localStorage for submissions
3. Component state for UI interactions

### Future (Production with Firebase)
1. Firebase Authentication for users
2. Firestore for data storage
3. Firebase Storage for images
4. Real-time listeners for live updates
5. Cloud Functions for backend logic

---

## Component Patterns

### Reusable Components
- Modal, Toast, ConfirmDialog (Admin)
- NoContent (Empty states)
- ScrollToTop (Route behavior)

### Layout Components
- MainLayout (Public site)
- AdminLayout (Admin dashboard)

### Page Components
- Feature-specific pages
- Route-level components

---

## Best Practices

1. **Component Organization**
   - One component per file
   - Descriptive naming
   - Grouped by feature/module

2. **Code Style**
   - Functional components with hooks
   - Props destructuring
   - Early returns for conditionals

3. **Performance**
   - Lazy loading for routes (future)
   - Image optimization
   - Code splitting

4. **Accessibility**
   - Semantic HTML
   - ARIA labels
   - Keyboard navigation

5. **Security**
   - Input validation
   - XSS prevention
   - Role-based access control

---

## Next Steps (Firebase Integration)

1. **Setup Firebase Project**
   - Create Firebase project
   - Enable Authentication
   - Setup Firestore database
   - Configure Storage

2. **Implement Authentication**
   - Email/password auth
   - Role-based access
   - Protected routes

3. **Migrate Data**
   - Move constants to Firestore
   - Setup collections structure
   - Implement CRUD operations

4. **Real-time Features**
   - Live notifications
   - Real-time submissions
   - Live dashboard stats

5. **File Uploads**
   - Image upload for articles
   - File upload for submissions
   - Storage management

---

## Environment Variables (Future)

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## Scripts

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint src --ext js,jsx"
}
```

---

## Dependencies

### Core
- react, react-dom
- react-router-dom
- vite

### UI
- lucide-react (icons)
- tailwindcss

### Firebase (To be added)
- firebase
- react-firebase-hooks (optional)

---

## Notes

- All admin pages are fully responsive
- Empty states implemented throughout
- Network error handling in place
- Toast notifications for user feedback
- Confirmation dialogs for destructive actions
- localStorage integration for submissions
- Ready for Firebase integration

---

**Last Updated**: January 2024
**Version**: 1.0.0
**Status**: Development - Ready for Firebase Integration
