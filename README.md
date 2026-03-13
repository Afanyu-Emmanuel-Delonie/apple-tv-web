# Apple Fam TV

A fast-growing digital media platform dedicated to informing, educating, and entertaining the public. Apple Fam TV gives the public a voice by allowing users to submit news, stories, and updates, helping keep the community informed and connected.

## Features

### Public Website
- **News & Updates**: Latest news from Cameroon and around the world
- **Regional News**: Local stories from all 10 regions of Cameroon
- **Events**: Upcoming conferences, workshops, and community events
- **Opportunities**: Jobs, internships, fellowships, and career opportunities
- **Story Submission**: Community-driven content submission system
- **Responsive Design**: Mobile-first design that works on all devices

### Admin Dashboard
- **Content Management**: Full CRUD operations for articles, events, and opportunities
- **Submissions Review**: Approve/reject user submissions with undo functionality
- **User Management**: Role-based access control (Admin, Editor, Author)
- **Analytics Dashboard**: Real-time statistics and insights
- **Notification System**: Stay updated with new submissions and activities
- **Mobile Responsive**: Complete admin experience on mobile devices

## Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Routing**: React Router DOM 7
- **State Management**: React Hooks + localStorage
- **Deployment**: Netlify
- **Future**: Firebase integration ready

## Getting Started

### Prerequisites
- Node.js 20.19.0 or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/apple-fam-tv.git
cd apple-fam-tv
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Main application pages
├── admin/              # Admin dashboard
│   ├── components/     # Admin-specific components
│   ├── layouts/        # Admin layout wrapper
│   └── pages/          # Admin pages
├── constants/          # Static data and configuration
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── contexts/           # React contexts
└── services/           # API services (Firebase ready)
```

## Key Features

### Content Management
- Articles with categories and status management
- Events with registration and pricing information
- Job opportunities with application tracking
- User-generated content submission system

### Admin Features
- Real-time dashboard with statistics
- Submission approval workflow with 1-hour undo window
- Content expiration system with 30-day auto-delete
- Role-based permissions and user management
- Mobile-responsive admin interface

### User Experience
- Fast loading with Vite build system
- Mobile-first responsive design
- Smooth animations and transitions
- Accessible navigation and forms
- SEO-friendly routing

## Deployment

The project is configured for Netlify deployment with:
- Node.js 20.19.0 runtime
- Automatic builds on git push
- SPA routing support
- Environment variable support

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary to Apple Fam TV.

## Contact

For questions or support, contact the Apple Fam TV development team.

---

Built with ❤️ for the Cameroon community and beyond.