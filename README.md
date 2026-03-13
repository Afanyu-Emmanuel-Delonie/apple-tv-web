# Apple Fam TV - Digital Media Platform

A fast-growing digital media platform dedicated to informing, educating, and entertaining the public. Apple Fam TV gives the public a voice by allowing users to submit news, stories, and updates, helping keep the community informed and connected.

## 🌐 Live Website
**Production URL**: https://apple-fam-tv.web.app

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Security & Analytics](#security--analytics)
- [Admin Dashboard](#admin-dashboard)
- [Content Management](#content-management)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

## ✨ Features

### 🌍 Public Website
- **News & Updates**: Latest news from Cameroon and around the world
- **Regional News**: Local stories from all 10 regions of Cameroon
- **International News**: Global news with dedicated filtering
- **Business News**: Economic and business updates
- **Events**: Upcoming conferences, workshops, and community events
- **Opportunities**: Jobs, internships, fellowships, and career opportunities
- **Story Submission**: Community-driven content submission system
- **Responsive Design**: Mobile-first design that works on all devices
- **SEO Optimized**: Meta tags, structured data, and search engine optimization
- **WhatsApp Integration**: Direct community channel access

### 🔧 Admin Dashboard
- **Content Management**: Full CRUD operations for articles, events, and opportunities
- **Submissions Review**: Approve/reject user submissions with undo functionality
- **User Management**: Role-based access control (Admin, Editor, Author)
- **Analytics Dashboard**: Real-time statistics and insights
- **Notification System**: Dynamic notifications for all admin activities
- **Mobile Responsive**: Complete admin experience on mobile devices
- **Duplicate Prevention**: Intelligent duplicate detection across all content types
- **Content Expiration**: Automatic content lifecycle management

### 🔒 Security Features
- **Role-Based Access Control**: Admin, Editor, and Author permissions
- **Firebase Security Rules**: Production-ready database security
- **Authentication System**: Secure login and session management
- **Input Validation**: XSS protection and data sanitization
- **HTTPS Enforcement**: SSL encryption for all communications

### 📊 Analytics & Tracking
- **Google Analytics 4**: Comprehensive user behavior tracking
- **Page View Tracking**: Automatic route-based analytics
- **Content Interaction**: Article, event, and opportunity engagement
- **Form Submissions**: Story submission and admin action tracking
- **User Engagement**: Click tracking, scroll depth, time on page
- **Search Analytics**: Search term and category tracking
- **Privacy Compliant**: GDPR-ready data handling

## 🛠 Tech Stack

### Frontend
- **React 19**: Latest React with concurrent features
- **Vite**: Fast build tool and development server
- **Tailwind CSS 4**: Utility-first CSS framework
- **React Router DOM 7**: Client-side routing
- **Lucide React**: Modern icon library

### Backend & Services
- **Firebase**: Complete backend-as-a-service
  - **Firestore**: NoSQL database with real-time updates
  - **Authentication**: User management and security
  - **Hosting**: Static site hosting with CDN
  - **Storage**: File upload and management (pending setup)
  - **Analytics**: Google Analytics 4 integration

### Development Tools
- **ESLint**: Code linting and quality
- **Node.js 20.19.0**: Runtime environment
- **Git**: Version control
- **Firebase CLI**: Deployment and management

## 🚀 Getting Started

### Prerequisites
- Node.js 20.19.0 or higher
- npm or yarn
- Firebase CLI (for deployment)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/apple-fam-tv.git
cd apple-fam-tv
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your Firebase configuration
```

4. **Start development server**
```bash
npm run dev
```

5. **Open in browser**
```
http://localhost:5173
```

### Environment Variables
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GA_MEASUREMENT_ID=your_ga_measurement_id
```

## 📁 Project Structure

```
src/
├── admin/                  # Admin dashboard
│   ├── components/         # Admin-specific components
│   ├── layouts/           # Admin layout wrapper
│   ├── pages/             # Admin pages
│   └── styles/            # Admin-specific styles
├── app/                   # Main application
│   └── App.jsx            # Root component with routing
├── components/            # Reusable UI components
├── constants/             # Static data and configuration
├── contexts/              # React contexts (Auth, etc.)
├── hooks/                 # Custom React hooks
├── layouts/               # Page layout components
├── pages/                 # Main application pages
├── services/              # API services and Firebase
│   └── firebase/          # Firebase configuration and services
├── utils/                 # Utility functions
│   ├── analytics.js       # Google Analytics utilities
│   ├── seo.js            # SEO optimization utilities
│   ├── imageCompression.js # Image optimization
│   └── textUtils.js      # Text processing utilities
└── types/                 # TypeScript type definitions
```

## 🔒 Security & Analytics

### Security Implementation
- **Firestore Rules**: Role-based database access control
- **Authentication**: Firebase Auth with custom user roles
- **Input Validation**: XSS protection and data sanitization
- **HTTPS**: Automatic SSL through Firebase Hosting
- **Admin Protection**: Protected routes and role verification

### Analytics Tracking
- **Page Views**: Automatic tracking on all routes
- **Content Interactions**: Article, event, opportunity views
- **Form Submissions**: Story submissions and admin actions
- **User Engagement**: Comprehensive interaction tracking
- **Search Behavior**: Search terms and category analytics
- **Admin Activities**: Complete admin action monitoring

## 👨‍💼 Admin Dashboard

### Access Levels
- **Admin**: Full system access, user management, all content operations
- **Editor**: Content management, submission approval, user content editing
- **Author**: Personal content management, own submissions only

### Key Features
- **Dashboard**: Real-time statistics and content overview
- **Articles**: Create, edit, delete news articles with category management
- **Events**: Manage community events with registration and pricing
- **Opportunities**: Job postings, internships, and career opportunities
- **Submissions**: Review and approve user-submitted content
- **Users**: User management and role assignment (Admin/Editor only)
- **Notifications**: Real-time system notifications and activity tracking

### Admin URLs
- **Login**: `/admin/login`
- **Dashboard**: `/admin/dashboard`
- **Articles**: `/admin/articles`
- **Events**: `/admin/events`
- **Opportunities**: `/admin/opportunities`
- **Submissions**: `/admin/submissions`
- **Users**: `/admin/users`

## 📝 Content Management

### Content Types
1. **Articles**: News stories with categories (International, Business, Regional, Politics, Entertainment)
2. **Events**: Community events with dates, locations, and registration
3. **Opportunities**: Jobs, internships, fellowships with application details
4. **Submissions**: User-generated content pending approval

### Content Lifecycle
- **Draft**: Initial creation state
- **Active**: Published and visible to public
- **Inactive**: Hidden from public view
- **Expired**: Automatically expired based on date rules

### Submission Workflow
1. **User Submission**: Public users submit stories, jobs, or opportunities
2. **Admin Review**: Editors/Admins review submissions
3. **Approval/Rejection**: Content approved moves to appropriate collection
4. **Notification**: System creates notifications for all actions
5. **Publication**: Approved content becomes publicly visible

## 🚀 Deployment

### Production Deployment
The application is deployed on Firebase Hosting with the following features:
- **Automatic HTTPS**: SSL certificates managed by Firebase
- **Global CDN**: Fast content delivery worldwide
- **Custom Domain**: Support for custom domain configuration
- **Caching**: Optimized caching headers for performance

### Build Commands
```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Deploy to Firebase
npm run deploy

# Deploy specific services
firebase deploy --only hosting
firebase deploy --only firestore:rules
firebase deploy --only storage
```

### Deployment Scripts
- **deploy.sh**: Unix/Linux deployment script
- **deploy.bat**: Windows deployment script
- **firebase.json**: Firebase configuration
- **firestore.rules**: Database security rules
- **storage.rules**: File storage security rules

## 📡 API Documentation

### Firebase Collections

#### Articles
```javascript
{
  id: "string",
  title: "string",
  content: "string",
  excerpt: "string",
  category: "string",
  author: "string",
  imageUrl: "string",
  videoUrl: "string",
  status: "draft|active|inactive|expired",
  createdAt: "timestamp",
  updatedAt: "timestamp",
  createdBy: "string"
}
```

#### Events
```javascript
{
  id: "string",
  title: "string",
  description: "string",
  date: "timestamp",
  location: "string",
  price: "string",
  registrationUrl: "string",
  imageUrl: "string",
  status: "draft|active|inactive|expired",
  createdAt: "timestamp",
  createdBy: "string"
}
```

#### Opportunities
```javascript
{
  id: "string",
  title: "string",
  description: "string",
  type: "job|internship|fellowship|volunteering|grant",
  company: "string",
  location: "string",
  salary: "string",
  deadline: "timestamp",
  applicationUrl: "string",
  status: "draft|active|inactive|expired",
  createdAt: "timestamp",
  createdBy: "string"
}
```

#### Users
```javascript
{
  id: "string",
  email: "string",
  displayName: "string",
  role: "admin|editor|author",
  createdAt: "timestamp",
  lastLogin: "timestamp",
  isActive: "boolean"
}
```

### Security Rules
- **Public Read**: Active content visible to all users
- **Authenticated Write**: Only authenticated users can create content
- **Role-Based Access**: Admins, Editors, and Authors have different permissions
- **Ownership Validation**: Users can only edit their own content (except Admins/Editors)

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Standards
- Follow ESLint configuration
- Use Tailwind CSS for styling
- Implement proper error handling
- Add comments for complex logic
- Test all new features
- Ensure mobile responsiveness

### Testing Checklist
- [ ] All pages load correctly
- [ ] Mobile responsiveness verified
- [ ] Admin functions work properly
- [ ] Security rules enforced
- [ ] Analytics tracking functional
- [ ] Form submissions working
- [ ] Image uploads functional
- [ ] SEO meta tags present

## 📞 Contact & Support

### Contact Information
- **Phone**: +237 6 99 24 23 82
- **WhatsApp Channel**: https://chat.whatsapp.com/CTBRFODXBbhH9bdLNSdZCo

### Important Links
- **Live Website**: https://apple-fam-tv.web.app
- **Firebase Console**: https://console.firebase.google.com/project/apple-fam-tv
- **Admin Dashboard**: https://apple-fam-tv.web.app/admin/dashboard
- **Submit Story**: https://apple-fam-tv.web.app/submit-story

### Legal Pages
- **Privacy Policy**: https://apple-fam-tv.web.app/privacy
- **Terms of Service**: https://apple-fam-tv.web.app/terms

## 📄 License

This project is private and proprietary to Apple Fam TV.

## 🏆 Achievements

- ✅ **Production Ready**: Live website with enterprise-level features
- ✅ **Security Implemented**: Comprehensive role-based access control
- ✅ **Analytics Integrated**: Complete user behavior tracking
- ✅ **Mobile Optimized**: Full responsive design across all devices
- ✅ **SEO Optimized**: Search engine friendly with structured data
- ✅ **Performance Optimized**: Fast loading with CDN and caching
- ✅ **Admin Dashboard**: Complete content management system
- ✅ **Community Features**: User submissions and engagement tools

---

**Built with ❤️ for the Cameroon community and beyond.**

*Last Updated: March 13, 2026*