# Netlify Deployment Guide

## Prerequisites
- GitHub account
- Netlify account (free tier works perfectly)
- Your project pushed to GitHub

## Quick Deploy Steps

### Option 1: Deploy via Netlify UI (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub" and authorize Netlify
   - Select your repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`
   
   (These are already configured in `netlify.toml`)

4. **Deploy**
   - Click "Deploy site"
   - Wait 2-3 minutes for build to complete
   - Your site will be live at `https://random-name.netlify.app`

5. **Custom Domain (Optional)**
   - Go to Site settings → Domain management
   - Add custom domain
   - Follow DNS configuration instructions

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize and Deploy**
   ```bash
   netlify init
   netlify deploy --prod
   ```

## Environment Variables (For Firebase Integration)

When you're ready to integrate Firebase:

1. Go to Site settings → Environment variables
2. Add these variables:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

## Important Files

- **netlify.toml** - Main configuration file
- **public/_redirects** - SPA routing fallback
- **.env.example** - Template for environment variables

## Continuous Deployment

Once connected to GitHub:
- Every push to `main` branch automatically deploys
- Pull requests create deploy previews
- Rollback to previous deploys anytime

## Build Optimization

The project is already optimized with:
- Vite for fast builds
- Code splitting
- Asset optimization
- Tree shaking

## Troubleshooting

### Build Fails
- Check Node version is 18+
- Verify all dependencies in package.json
- Check build logs in Netlify dashboard

### Routes Not Working
- Ensure `_redirects` file exists in `public/`
- Check `netlify.toml` has redirect rules

### Images Not Loading
- Use relative paths: `/src/assets/image.png`
- Or use absolute URLs for external images

## Post-Deployment Checklist

- [ ] Test all routes (home, news, events, opportunities, about, submit-story)
- [ ] Test admin routes (/admin/login, /admin/dashboard, etc.)
- [ ] Verify responsive design on mobile
- [ ] Check browser console for errors
- [ ] Test form submissions (localStorage)
- [ ] Verify navigation and footer links

## Performance Tips

1. **Enable Asset Optimization** (Netlify Settings)
   - Pretty URLs
   - Asset optimization
   - Bundle optimization

2. **Add Headers** (Optional - create `public/_headers`)
   ```
   /*
     X-Frame-Options: DENY
     X-XSS-Protection: 1; mode=block
     X-Content-Type-Options: nosniff
     Referrer-Policy: strict-origin-when-cross-origin
   ```

3. **Enable HTTPS** (Automatic on Netlify)

## Monitoring

- View analytics in Netlify dashboard
- Set up form notifications
- Monitor build times
- Check bandwidth usage

## Support

- Netlify Docs: https://docs.netlify.com
- Vite Docs: https://vitejs.dev
- React Router: https://reactrouter.com

---

**Your site is ready to deploy! 🚀**

Estimated build time: 2-3 minutes
Estimated deploy time: 30 seconds
