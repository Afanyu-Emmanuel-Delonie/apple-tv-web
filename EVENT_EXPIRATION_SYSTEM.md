# Events Auto-Expiration System - Complete ✅

## 🎯 Overview

Events now have the same automatic lifecycle management as opportunities, with a **3-day grace period** for extensions.

---

## 🔄 How It Works

### 1. Date Validation
- ✅ Date picker prevents selecting past dates
- ✅ `min` attribute set to today's date
- ✅ Helper text: "Event date cannot be in the past"
- ✅ Form validation ensures future dates only

### 2. Automatic Expiration
**When**: Event date passes
**Action**: 
- Status changes from "active" to "expired"
- `expiryDate` field set to current timestamp
- Notification created: "Event Expired"

**Example**:
```
Event: "Tech Summit 2024"
Date: April 15, 2024
Status: active

[April 16, 2024 - System Check]
→ Event date passed
→ Status: expired
→ expiryDate: 2024-04-16T00:00:00Z
→ Notification: "Tech Summit 2024 has expired and will be auto-deleted in 3 days (in case of extensions)"
```

### 3. Automatic Deletion
**When**: 3 days after expiration
**Action**:
- Event permanently deleted from database
- Notification created: "Event Auto-Deleted"

**Why 3 days?**: Allows time for event extensions or date changes

**Example**:
```
Event: "Tech Summit 2024"
expiryDate: April 16, 2024
Status: expired

[April 19, 2024 - System Check]
→ 3 days since expiration
→ Event deleted
→ Notification: "Tech Summit 2024 was automatically deleted 3 days after expiration"
```

---

## ⏰ System Check Schedule

- **On Admin Login**: Immediate check when admin accesses panel
- **Every Hour**: Background job runs every 60 minutes
- **Manual Refresh**: When clicking "Refresh" button in events page

---

## 📊 Timeline Example

```
Day 0 (April 10)
├─ Event created
├─ Date: April 15, 2024
└─ Status: active

Day 5 (April 15)
└─ Event date reached (still active until next check)

Day 6 (April 16) - System Check
├─ Event date passed detected
├─ Status → expired
├─ expiryDate → April 16, 2024
└─ Notification: "Expired, will be deleted in 3 days"

Day 7-8 (April 17-18)
└─ Event remains expired (countdown: 2, 1 days)

Day 9 (April 19) - System Check
├─ 3 days since expiration
├─ Event deleted
└─ Notification: "Auto-deleted"
```

---

## 🔔 Notifications

### Expiration Notification
```json
{
  "type": "event_expired",
  "title": "Event Expired",
  "message": "\"Tech Summit 2024\" has expired and will be auto-deleted in 3 days (in case of extensions).",
  "relatedId": "event_123",
  "relatedType": "event",
  "read": false,
  "createdAt": "2024-04-16T00:00:00Z"
}
```

### Deletion Notification
```json
{
  "type": "event_deleted",
  "title": "Event Auto-Deleted",
  "message": "\"Tech Summit 2024\" was automatically deleted 3 days after expiration.",
  "relatedId": "event_123",
  "relatedType": "event",
  "read": false,
  "createdAt": "2024-04-19T00:00:00Z"
}
```

---

## 📝 Form Fields

### Required Fields (*)
1. **Event Image** - Optional upload with preview
2. **Title** * - Event name
3. **Category** * - Conference, Workshop, Networking, Career Fair, Webinar, Summit
4. **Event Date** * - Date picker (YYYY-MM-DD)
5. **Location** * - Where the event takes place
6. **Price** * - Ticket price or "Free"
7. **Description** * - Event details, agenda, speakers
8. **Registration Link** * - URL to register

---

## 🎨 Admin UI Indicators

### Active Event
```
┌─────────────────────────────────────┐
│ Tech Summit 2024                    │
│ [ACTIVE]                            │
│ Date: Apr 15, 2024                  │
│                                     │
│ [View] [Edit] [Expire] [Delete]    │
└─────────────────────────────────────┘
```

### Expired Event
```
┌─────────────────────────────────────┐
│ Tech Summit 2024                    │
│ [EXPIRED]                           │
│ Auto-delete in 2 days               │
│                                     │
│ [View] [Edit] [Reactivate] [Delete]│
└─────────────────────────────────────┘
```

---

## 📦 5 Sample Events Ready to Seed

1. **Tech Summit Cameroon 2024** (Conference)
   - Date: April 15, 2024
   - Location: Hilton Hotel, Yaoundé
   - Price: 25,000 FCFA

2. **Digital Marketing Workshop** (Workshop)
   - Date: March 28, 2024
   - Location: Innovation Hub, Douala
   - Price: 15,000 FCFA

3. **Startup Networking Mixer** (Networking)
   - Date: April 5, 2024
   - Location: The Lounge, Buea
   - Price: Free

4. **Career Fair 2024** (Career Fair)
   - Date: April 20, 2024
   - Location: University of Buea Campus
   - Price: Free

5. **Web Development Bootcamp** (Webinar)
   - Date: April 10, 2024
   - Location: Online (Zoom)
   - Price: 10,000 FCFA

---

## 🛠️ Technical Implementation

### Files Created

1. **eventService.js** (NEW)
   - `processExpiredEvents()` - Main processing function
   - `getDaysUntilDeletion()` - Calculate days remaining (3 days)
   - `isEventDatePassed()` - Check if event date passed
   - `isValidEventDate()` - Validate event date

2. **EventExpirationJob.jsx** (NEW)
   - Background job component
   - Runs every hour automatically
   - Silent operation (no UI)

3. **SeedEvents.jsx** (NEW)
   - Seed component for 5 sample events
   - Green button in bottom-right corner
   - Click "Seed Now" to add events

### Files Modified

1. **AdminEvents.jsx**
   - Firebase integration (CRUD operations)
   - Image upload with preview
   - Date picker with validation
   - Registration link field
   - 3-day auto-delete countdown
   - Refresh button
   - Loading states

2. **AdminLayout.jsx**
   - Added EventExpirationJob component
   - Runs automatically when admin logged in

---

## 🚀 How to Seed Events

1. **Login to admin panel**
2. **Go to Events page**
3. **Click green "Seed Now" button** (bottom-right corner)
4. **Wait for success message**
5. **Click "Refresh"** button or press F5
6. **See 5 events!**

---

## 🎯 Key Differences from Opportunities

| Feature | Opportunities | Events |
|---------|--------------|--------|
| **Grace Period** | 5 days | 3 days |
| **Reason** | Job applications | Event extensions |
| **Date Field** | Deadline | Event Date |
| **Link Field** | Application Link | Registration Link |
| **Seed Button Color** | Blue | Green |

---

## ✅ Complete Feature List

### Admin Panel
- ✅ Create new events
- ✅ Edit existing events
- ✅ Delete events
- ✅ Expire events (auto-delete after 3 days)
- ✅ Reactivate expired events
- ✅ Upload event images
- ✅ Preview images before upload
- ✅ Remove/replace images
- ✅ Date picker with validation
- ✅ Registration link field
- ✅ Search events
- ✅ Filter by category
- ✅ Filter by status
- ✅ View event details
- ✅ Refresh data from database
- ✅ Loading states
- ✅ Error handling
- ✅ Success/error notifications

### Background System
- ✅ Automatic expiration when event date passes
- ✅ Automatic deletion 3 days after expiration
- ✅ Notifications for both actions
- ✅ Runs every hour
- ✅ Runs on admin login
- ✅ Manual check on page refresh

---

## 🧪 Testing Checklist

### Date Validation
- [ ] Try to select yesterday's date (should be disabled)
- [ ] Select today's date (should work)
- [ ] Select future date (should work)

### Auto-Expiration
- [ ] Create event with date = today
- [ ] Wait for system check (or refresh page)
- [ ] Verify event auto-expired
- [ ] Check notification created
- [ ] Verify 3-day countdown

### Auto-Deletion
- [ ] Manually expire an event
- [ ] Change expiryDate to 3 days ago (in database)
- [ ] Refresh admin page
- [ ] Verify event deleted
- [ ] Check deletion notification

### Reactivation
- [ ] Expire an event
- [ ] Click "Reactivate"
- [ ] Verify status is active
- [ ] Verify expiryDate is null
- [ ] Verify countdown disappeared

### Image Upload
- [ ] Create event with image
- [ ] Create event without image
- [ ] Edit event and add image
- [ ] Edit event and remove image
- [ ] Try uploading file > 5MB (should fail)

---

## 📈 Summary

✅ Events now have automatic lifecycle management
✅ Date picker prevents past dates
✅ Auto-expires when event date passes
✅ Auto-deletes after 3 days (for extensions)
✅ Sends notifications for both actions
✅ Runs automatically every hour
✅ Image upload with preview
✅ Registration link field
✅ 5 sample events ready to seed
✅ Complete Firebase integration

**Everything is ready to use!** 🎉
