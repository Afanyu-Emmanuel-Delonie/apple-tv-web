# Opportunities Feature - Complete Guide

## ✅ What's Been Implemented

### 1. **Firebase Integration**
- ✅ Opportunities stored in Firestore database
- ✅ Images stored in Firebase Storage
- ✅ Full CRUD operations (Create, Read, Update, Delete)

### 2. **Image Upload Feature**
- ✅ Optional cover image upload
- ✅ Image preview before upload
- ✅ Remove/replace image functionality
- ✅ Default gradient background if no image
- ✅ 5MB file size limit
- ✅ Supports PNG, JPG, JPEG formats

### 3. **Admin Panel Features**
- ✅ Add/Edit/Delete opportunities
- ✅ Image picker with preview
- ✅ Application link field (required)
- ✅ Expire/Reactivate functionality
- ✅ Search and filter by category/status
- ✅ Refresh button to reload data
- ✅ Loading states

### 4. **Public Pages**
- ✅ Opportunities listing page
- ✅ Opportunity details page
- ✅ "Apply Now" button with external link
- ✅ Shows image or default gradient
- ✅ Only shows active opportunities
- ✅ Click to view full details

---

## 🚀 How to Seed 5 Opportunities

### Method 1: Using the Seed Button (EASIEST)

1. **Login to Admin Panel**
   - Go to: `http://localhost:5173/admin/login`
   - Login with your admin account

2. **Navigate to Opportunities**
   - Click "Opportunities" in the sidebar

3. **Click "Seed Now" Button**
   - You'll see a blue box in the bottom-right corner
   - Click the "Seed Now" button
   - Wait for the success message

4. **Refresh the Page**
   - Press F5 or click the "Refresh" button
   - You should see 5 new opportunities

5. **Remove the Seed Component** (Optional)
   - After seeding, you can remove the seed button
   - Open: `src/admin/pages/AdminOpportunities.jsx`
   - Remove these lines:
     ```jsx
     import SeedOpportunities from "./SeedOpportunities";
     ```
     and
     ```jsx
     <SeedOpportunities />
     ```

---

## 📸 How to Add Images to Opportunities

### Adding Image When Creating New Opportunity

1. Click "Add Opportunity" button
2. Fill in all required fields
3. In the "Cover Image" section:
   - Click the upload area
   - Select an image from your computer (PNG/JPG, max 5MB)
   - Preview will appear
   - To remove: Click the X button on the preview
4. Click "Add Opportunity"
5. Image will be uploaded to Firebase Storage automatically

### Adding Image to Existing Opportunity

1. Click the "Edit" button on any opportunity
2. Scroll to "Cover Image" section
3. Click upload area to add/replace image
4. Click "Save Changes"

### Default Behavior (No Image)

- If no image is uploaded, a beautiful blue gradient will be used
- This ensures all opportunities look professional
- You can add images later by editing

---

## 🎨 Image Recommendations

**Best Practices:**
- **Size**: 1200x800px or similar aspect ratio (3:2)
- **Format**: JPG or PNG
- **File Size**: Under 2MB for faster loading
- **Content**: Professional, relevant to the opportunity
- **Quality**: High resolution, clear and sharp

**Good Image Ideas:**
- Office/workspace photos
- Team collaboration images
- Technology/computer setups
- Professional headshots
- Company logos with background
- Industry-related imagery

---

## 🔗 Application Links

Each opportunity requires an application link. You can use:

- **Google Forms**: `https://forms.gle/yourformid`
- **Company Career Page**: `https://company.com/careers/apply`
- **Email**: `mailto:jobs@company.com`
- **External Job Board**: `https://linkedin.com/jobs/...`
- **Custom Application Portal**: Any valid URL

---

## 📝 The 5 Seeded Opportunities

1. **Software Engineer - Full Stack** (Jobs)
   - Tech Solutions Africa
   - Douala, Cameroon
   - 500,000 - 800,000 FCFA

2. **Marketing Intern** (Internships)
   - Digital Marketing Hub
   - Yaoundé, Cameroon
   - 150,000 FCFA/month

3. **African Leadership Fellowship Program** (Fellowships)
   - Leadership Institute
   - Pan-African (Remote)
   - Fully Funded

4. **Data Analyst** (Jobs)
   - Analytics Pro Cameroon
   - Remote
   - 400,000 - 600,000 FCFA

5. **Small Business Development Grant** (Grants)
   - Entrepreneurship Fund Cameroon
   - Cameroon
   - Up to 5,000,000 FCFA

---

## 🧪 Testing the Feature

### Test the Admin Panel:
1. ✅ Create a new opportunity with image
2. ✅ Create a new opportunity without image
3. ✅ Edit an opportunity and add image
4. ✅ Edit an opportunity and remove image
5. ✅ Delete an opportunity
6. ✅ Expire an opportunity
7. ✅ Reactivate an expired opportunity
8. ✅ Search for opportunities
9. ✅ Filter by category
10. ✅ Filter by status

### Test the Public Pages:
1. ✅ Visit `/opportunities` - see all active opportunities
2. ✅ Click on an opportunity - see details page
3. ✅ Click "Apply Now" - opens application link in new tab
4. ✅ Check that expired opportunities don't show
5. ✅ Check that images display correctly
6. ✅ Check that default gradient shows when no image

---

## 🐛 Troubleshooting

### Seed Button Not Working?
- Make sure you're logged in as admin
- Check browser console for errors (F12)
- Verify Firebase is configured in `.env` file

### Images Not Uploading?
- Check file size (must be under 5MB)
- Verify file format (PNG, JPG, JPEG only)
- Check Firebase Storage rules
- Look for errors in browser console

### Opportunities Not Showing?
- Click the "Refresh" button in admin panel
- Check that opportunities have status "active"
- Verify Firebase connection
- Check browser console for errors

---

## 🎉 You're All Set!

Your opportunities feature is now fully functional with:
- ✅ Database integration
- ✅ Image upload capability
- ✅ 5 sample opportunities ready to seed
- ✅ Beautiful public-facing pages
- ✅ Complete admin management

**Next Steps:**
1. Seed the 5 opportunities
2. Add real images to make them look professional
3. Update application links to real URLs
4. Share the opportunities page with your users!
