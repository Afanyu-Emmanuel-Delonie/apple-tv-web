# Automatic Opportunity Expiration & Deletion System

## 🎯 Overview

The system automatically manages opportunity lifecycle:
1. **Deadline Validation** - Prevents setting deadlines in the past
2. **Auto-Expiration** - Expires opportunities when deadline passes
3. **Auto-Deletion** - Deletes expired opportunities after 5 days
4. **Notifications** - Sends notifications for both actions

---

## 🔄 How It Works

### 1. Deadline Validation
- ✅ Date picker prevents selecting past dates
- ✅ `min` attribute set to today's date
- ✅ Helper text: "Deadline cannot be in the past"
- ✅ Form validation ensures future dates only

### 2. Automatic Expiration
**When**: Opportunity deadline passes
**Action**: 
- Status changes from "active" to "expired"
- `expiryDate` field set to current timestamp
- Notification created: "Opportunity Expired"

**Example**:
```
Opportunity: "Software Engineer"
Deadline: March 30, 2024
Status: active

[March 31, 2024 - System Check]
→ Deadline passed
→ Status: expired
→ expiryDate: 2024-03-31T00:00:00Z
→ Notification: "Software Engineer has expired and will be auto-deleted in 5 days"
```

### 3. Automatic Deletion
**When**: 5 days after expiration
**Action**:
- Opportunity permanently deleted from database
- Notification created: "Opportunity Auto-Deleted"

**Example**:
```
Opportunity: "Software Engineer"
expiryDate: March 31, 2024
Status: expired

[April 5, 2024 - System Check]
→ 5 days since expiration
→ Opportunity deleted
→ Notification: "Software Engineer was automatically deleted 5 days after expiration"
```

---

## ⏰ System Check Schedule

The system runs automatic checks:
- **On Admin Login**: Immediate check when admin accesses panel
- **Every Hour**: Background job runs every 60 minutes
- **Manual Refresh**: When clicking "Refresh" button in opportunities page

---

## 📊 Timeline Example

```
Day 0 (March 25)
├─ Opportunity created
├─ Deadline: March 30, 2024
└─ Status: active

Day 5 (March 30)
└─ Deadline reached (still active until next check)

Day 6 (March 31) - System Check
├─ Deadline passed detected
├─ Status → expired
├─ expiryDate → March 31, 2024
└─ Notification: "Expired, will be deleted in 5 days"

Day 7-10 (April 1-4)
└─ Opportunity remains expired (countdown: 4, 3, 2, 1 days)

Day 11 (April 5) - System Check
├─ 5 days since expiration
├─ Opportunity deleted
└─ Notification: "Auto-deleted"
```

---

## 🔔 Notifications

### Expiration Notification
```json
{
  "type": "opportunity_expired",
  "title": "Opportunity Expired",
  "message": "\"Software Engineer\" has expired and will be auto-deleted in 5 days.",
  "relatedId": "opp_123",
  "relatedType": "opportunity",
  "read": false,
  "createdAt": "2024-03-31T00:00:00Z"
}
```

### Deletion Notification
```json
{
  "type": "opportunity_deleted",
  "title": "Opportunity Auto-Deleted",
  "message": "\"Software Engineer\" was automatically deleted 5 days after expiration.",
  "relatedId": "opp_123",
  "relatedType": "opportunity",
  "read": false,
  "createdAt": "2024-04-05T00:00:00Z"
}
```

---

## 🎨 Admin UI Indicators

### Active Opportunity
```
┌─────────────────────────────────────┐
│ Software Engineer                   │
│ [ACTIVE]                            │
│ Deadline: March 30, 2024            │
│                                     │
│ [View] [Edit] [Expire] [Delete]    │
└─────────────────────────────────────┘
```

### Expired Opportunity
```
┌─────────────────────────────────────┐
│ Software Engineer                   │
│ [EXPIRED]                           │
│ Auto-delete in 3 days               │
│                                     │
│ [View] [Edit] [Reactivate] [Delete]│
└─────────────────────────────────────┘
```

---

## 🛠️ Technical Implementation

### Files Created/Modified

1. **opportunityService.js** (NEW)
   - `processExpiredOpportunities()` - Main processing function
   - `getDaysUntilDeletion()` - Calculate days remaining
   - `isDeadlinePassed()` - Check if deadline passed
   - `isValidDeadline()` - Validate deadline not in past

2. **OpportunityExpirationJob.jsx** (NEW)
   - Background job component
   - Runs every hour
   - Checks and processes expired opportunities

3. **AdminLayout.jsx** (MODIFIED)
   - Includes OpportunityExpirationJob component
   - Runs automatically when admin is logged in

4. **AdminOpportunities.jsx** (MODIFIED)
   - Date picker with `min` attribute
   - Helper text for deadline validation
   - Updated expiration message (5 days instead of 30)
   - Manual check on page load

---

## 🔧 Configuration

### Change Auto-Delete Period

To change from 5 days to another period:

**In opportunityService.js:**
```javascript
// Change this line:
const deleteDate = new Date(expiry.getTime() + 5 * 24 * 60 * 60 * 1000);

// To (for example, 7 days):
const deleteDate = new Date(expiry.getTime() + 7 * 24 * 60 * 60 * 1000);
```

**In AdminOpportunities.jsx:**
```javascript
// Update the message:
message: `... will be automatically deleted after 7 days.`

// Update the calculation:
const deleteDate = new Date(expiry.getTime() + 7 * 24 * 60 * 60 * 1000);
```

### Change Check Frequency

**In OpportunityExpirationJob.jsx:**
```javascript
// Current: Every hour (3600000 ms)
const interval = setInterval(() => {
  checkExpiredOpportunities();
}, 3600000);

// Change to every 30 minutes:
}, 1800000);

// Change to every 6 hours:
}, 21600000);
```

---

## 📋 Admin Actions

### Manual Expiration
Admins can manually expire an opportunity:
1. Click "Expire" button
2. Confirm action
3. Opportunity status → expired
4. 5-day countdown starts

### Reactivation
Admins can reactivate expired opportunities:
1. Click "Reactivate" button
2. Status → active
3. expiryDate cleared
4. Countdown cancelled

### Manual Deletion
Admins can delete anytime:
1. Click "Delete" button
2. Confirm action
3. Immediate permanent deletion
4. No countdown

---

## 🧪 Testing

### Test Deadline Validation
1. Create new opportunity
2. Try to select yesterday's date
3. ✅ Should be disabled/grayed out
4. Select today or future date
5. ✅ Should work

### Test Auto-Expiration
1. Create opportunity with deadline = today
2. Wait for next system check (or refresh page)
3. ✅ Should auto-expire
4. ✅ Should show "Auto-delete in 5 days"
5. ✅ Should create notification

### Test Auto-Deletion
1. Manually expire an opportunity
2. Change expiryDate to 5 days ago (in database)
3. Refresh admin page
4. ✅ Opportunity should be deleted
5. ✅ Should create deletion notification

### Test Reactivation
1. Expire an opportunity
2. Click "Reactivate"
3. ✅ Status should be active
4. ✅ expiryDate should be null
5. ✅ Countdown should disappear

---

## 🚨 Important Notes

### Database Timestamps
- All dates stored in ISO 8601 format
- Example: `2024-03-30T00:00:00Z`
- Timezone-aware comparisons

### Notification Storage
- Stored in `notifications` collection
- Linked to opportunity via `relatedId`
- Can be viewed in admin notifications page

### Performance
- Batch processing (all opportunities checked at once)
- Efficient queries (no unnecessary reads)
- Minimal database writes (only when changes needed)

### Edge Cases Handled
- ✅ Opportunity without deadline
- ✅ Opportunity already expired
- ✅ Opportunity deleted manually before auto-delete
- ✅ Multiple opportunities expiring same day
- ✅ System offline during expiration time

---

## 📈 Monitoring

### Check System Status
```javascript
// In browser console (admin page):
import { processExpiredOpportunities } from './services/firebase/opportunityService';

// Run manual check:
const result = await processExpiredOpportunities();
console.log(result);
// Output: { success: true, processedCount: 3 }
```

### View Logs
- Check browser console for processing logs
- Look for: "✅ Expired: [title]"
- Look for: "🗑️ Deleted: [title]"

---

## 🎉 Benefits

1. **Automatic Cleanup** - No manual intervention needed
2. **User Notifications** - Admins stay informed
3. **Grace Period** - 5 days to reactivate if needed
4. **Data Integrity** - Old opportunities don't clutter database
5. **User Experience** - Public only sees active opportunities
6. **Transparency** - Clear countdown and notifications

---

## 🔮 Future Enhancements

Possible improvements:
- Email notifications to admins
- Configurable grace period per opportunity
- Archive instead of delete
- Bulk reactivation
- Expiration reports
- Custom notification preferences

---

## ✅ Summary

The automatic expiration and deletion system:
- ✅ Prevents past deadlines
- ✅ Auto-expires when deadline passes
- ✅ Auto-deletes after 5 days
- ✅ Sends notifications for both actions
- ✅ Runs automatically every hour
- ✅ Allows manual intervention
- ✅ Provides clear UI indicators
- ✅ Maintains data integrity

**Everything is automated and working!** 🚀
