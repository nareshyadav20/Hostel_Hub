# 📱 Tenant Portal Complete API Guide

**Base URL**: `https://livora-hostel-hub-1.onrender.com`

> All routes require: `Authorization: Bearer <token>` header

---

## 🔐 Authentication (Shared)

### 1. Register as Tenant
```dart
POST /api/auth/register
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password",
  "phone": "9876543210",
  "role": "TENANT"
}

Response (201):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "TENANT"
  }
}
```

### 2. Login
```dart
POST /api/auth/login
Body: {
  "email": "john@example.com",
  "password": "secure_password"
}
```

### 3. Get Current User
```dart
GET /api/auth/me
Response: { "user": { /* user details */ } }
```

---

## 🏘️ Explore & Browse Hostels (Public)

### Get All Hostels with Filtering
```dart
GET /api/buildings/public?page=1&limit=20&city=Bengaluru&genderType=Male&minPrice=5000&maxPrice=15000

Response (200):
{
  "buildings": [
    {
      "_id": "building_123",
      "name": "Sunrise PG",
      "address": "12 MG Road",
      "locationCity": "Bengaluru",
      "images": ["/uploads/building/img1.jpg"],
      "startingPrice": 8000,
      "amenities": ["WiFi", "AC", "Meals"],
      "genderType": "Male",
      "rating": 4.8,
      "occupancy": "85%"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 45, "pages": 3 }
}
```

### Get Hostel Detail Page
```dart
GET /api/buildings/public/{buildingId}

Response includes:
- Building info
- All floors with rooms
- Available beds with details
- Reviews and ratings
- Owner contact info
- Amenities list
```

### Get Platform Statistics
```dart
GET /api/buildings/public/stats

Response: {
  "tenants": 1250,
  "properties": 45,
  "cities": 8,
  "avgRating": 4.6
}
```

---

## 📅 Booking Management

### Create Booking
```dart
POST /api/bookings

Body: {
  "buildingId": "building_123",
  "bedId": "bed_1",
  "category": "Standard",
  "moveInDate": "2026-06-15T00:00:00Z",
  "totalAmount": 15000,
  "securityDeposit": 5000,
  "paymentMethod": "UPI",  // UPI | Cash | Card | Bank Transfer
  "guestName": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "specialRequests": "Need WiFi enabled"
}

Response (201):
{
  "_id": "booking_123",
  "status": "pending",  // pending | confirmed | checked-in | checked-out
  "buildingName": "Sunrise PG",
  "roomName": "204",
  "moveInDate": "2026-06-15",
  "totalAmount": 15000
}

Error (400): "You already have an active booking"
```

### Get My Bookings
```dart
GET /api/bookings/me?status=active

Response (200): [
  {
    "_id": "booking_123",
    "buildingName": "Sunrise PG",
    "roomName": "204",
    "bedName": "204-A",
    "moveInDate": "2026-06-15",
    "status": "confirmed",
    "totalAmount": 15000
  }
]
```

### Get Booking Details
```dart
GET /api/bookings/me/{bookingId}

Response includes:
- Full booking details
- Payment status
- Building details
- Room information
- Owner contact
```

### Cancel Booking
```dart
PATCH /api/bookings/{bookingId}/cancel

Body: {
  "cancellationReason": "Found better option"
}

Response (200): { "message": "Booking cancelled" }
Error (400): "Cannot cancel confirmed booking"
```

---

## 💰 Payments & Invoices

### Get Payment History
```dart
GET /api/payments/me?type=Rent&status=Paid

Response (200): [
  {
    "_id": "payment_1",
    "amount": 9000,
    "type": "Rent",  // Rent | Security | Maintenance | Food
    "status": "Paid",  // Paid | Pending | Failed
    "month": "June 2026",
    "date": "2026-06-01",
    "invoice": "INV-2026-001"
  }
]
```

### Record Payment
```dart
POST /api/payments

Body: {
  "buildingId": "building_123",
  "amount": 9000,
  "type": "Rent",
  "method": "UPI",  // UPI | Cash | Card | Bank Transfer
  "month": "June 2026",
  "invoice": "INV-2026-001"
}

Response (201): { "message": "Payment recorded" }
```

### Download Invoice
```dart
GET /api/payments/{paymentId}/invoice

Response (200): {
  "invoiceUrl": "https://...invoice.pdf"
}
```

---

## 📣 Complaints & Maintenance

### Create Complaint
```dart
POST /api/complaints (multipart/form-data)

Fields:
- title: "Broken AC"
- description: "AC not working for 3 days"
- category: "Maintenance"  // Maintenance | Safety | Cleanliness | Other
- priority: "High"  // High | Medium | Low
- attachments: [image files]

Response (201):
{
  "_id": "complaint_123",
  "status": "open",
  "createdAt": "2026-06-01T10:00:00Z"
}
```

### Get My Complaints
```dart
GET /api/complaints/me?status=open

Response: [
  {
    "_id": "complaint_123",
    "title": "Broken AC",
    "status": "in-progress",
    "priority": "High",
    "createdAt": "2026-06-01T10:00:00Z",
    "resolvedAt": null
  }
]
```

### Get Complaint Details
```dart
GET /api/complaints/{complaintId}

Response includes:
- Full complaint details
- Status history
- Comments from owner
- Attachments
```

### Add Comment to Complaint
```dart
POST /api/complaints/{complaintId}/comments

Body: { "comment": "Please update on progress" }

Response (201): { "message": "Comment added" }
```

---

## 👤 Tenant Portal - Profile & Features

### Get Complete Profile Dashboard
```dart
GET /api/tenant-portal/complete-profile

Response (200):
{
  "tenant": {
    "_id": "tenant_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "photo": "/uploads/profile/photo_xxx.jpg",
    "building": {
      "name": "Sunrise PG",
      "address": "12 MG Road"
    },
    "roomName": "204",
    "bedName": "204-A",
    "moveInDate": "2026-01-15"
  },
  "payments": [
    { "_id", "amount", "type", "status", "date", "month" }
  ],
  "complaints": [
    { "_id", "title", "status", "priority", "createdAt" }
  ],
  "history": {
    "laundry": [...],
    "visitors": [...],
    "leaves": [...]
  },
  "rewards": {
    "points": 350,
    "tier": "Silver"
  }
}
```

### Upload Profile Photo
```dart
POST /api/tenant-portal/upload-photo (multipart/form-data)

File: photo (JPEG/PNG, max 5MB)

Response (200): {
  "message": "Photo uploaded successfully",
  "photo": {
    "photoUrl": "/uploads/profile/photo_xxx.jpg"
  }
}
```

### Update Profile Information
```dart
PATCH /api/tenant-portal/update-profile

Body: {
  "firstName": "John",
  "lastName": "Doe",
  "phone": "9876543210",
  "emergencyContact": "Jane Doe",
  "emergencyPhone": "9123456789"
}

Response (200): { "message": "Profile updated" }
```

---

## 🏘️ Community Features

### Create Community Report
```dart
POST /api/tenant-portal/community-reports (multipart/form-data)

Fields:
- title: "Noisy Neighbour"
- type: "Noise"  // Noise | Safety | Cleanliness | Behavior | Other
- details: "Loud music after 11 PM"
- location: "Block B, Room 104"
- attachments: [files]

Response (201): { "_id", "status", "createdAt" }
```

### Get Community Reports
```dart
GET /api/tenant-portal/community-reports

Response: [
  {
    "id": "report_1",
    "title": "Noisy Neighbour",
    "type": "Noise",
    "status": "under-review",
    "createdAt": "2026-06-01T10:00:00Z"
  }
]
```

### Trigger SOS Alert
```dart
POST /api/tenant-portal/sos-alerts

Body: {
  "type": "Emergency",  // Emergency | Medical | Safety | Other
  "message": "Immediate assistance needed",
  "location": "Block A, Room 201",
  "latitude": "12.9716",
  "longitude": "77.5946"
}

Response (201):
{
  "message": "SOS alert triggered",
  "emergencyServices": [{ "contact": "...", "name": "..." }]
}
```

---

## 🎁 Wishlist & Rewards

### Get Wishlist
```dart
GET /api/tenant-portal/wishlist

Response: [
  {
    "_id": "wishlist_1",
    "buildingId": "building_456",
    "buildingName": "Sunset PG",
    "addedAt": "2026-05-20"
  }
]
```

### Add to Wishlist
```dart
POST /api/tenant-portal/wishlist

Body: {
  "buildingId": "building_456",
  "buildingName": "Sunset PG"
}

Response (201): { "message": "Added to wishlist" }
```

### Remove from Wishlist
```dart
DELETE /api/tenant-portal/wishlist/{buildingId}

Response (200): { "message": "Removed from wishlist" }
```

### Get Rewards Info
```dart
GET /api/tenant-portal/rewards/me

Response: {
  "points": 350,
  "lifetimeEarned": 500,
  "tier": "Silver",  // Silver | Gold | Platinum
  "nextTierPoints": 100
}
```

---

## 👥 Guest Management

### Request Guest Pass
```dart
POST /api/tenant-portal/guest-passes

Body: {
  "visitorName": "Priya Kumar",
  "visitorPhone": "9123456789",
  "visitDate": "2026-06-05T14:00:00Z",
  "purpose": "Meeting",
  "durationHours": 4
}

Response (201): {
  "pass": {
    "_id": "pass_123",
    "visitorName": "Priya Kumar",
    "passCode": "GP-2026-001",
    "status": "pending"  // pending | approved | rejected | expired
  }
}
```

### Get Guest Passes
```dart
GET /api/tenant-portal/guest-passes

Response: [
  {
    "passCode": "GP-2026-001",
    "visitorName": "Priya Kumar",
    "visitDate": "2026-06-05",
    "status": "approved"
  }
]
```

---

## 📤 Leave Requests

### Request Leave/Going Out
```dart
POST /api/tenant-portal/leave-requests

Body: {
  "fromDate": "2026-06-10T00:00:00Z",
  "toDate": "2026-06-15T00:00:00Z",
  "reason": "Visiting home town"
}

Response (201): {
  "_id": "leave_123",
  "status": "pending",  // pending | approved | rejected
  "duration": "5 days"
}
```

### Get Leave History
```dart
GET /api/tenant-portal/leave-requests

Response: [
  {
    "fromDate": "2026-06-10",
    "toDate": "2026-06-15",
    "reason": "Visiting home",
    "status": "approved"
  }
]
```

---

## 🔔 Notifications

### Get All Notifications
```dart
GET /api/notifications?page=1&limit=50

Response: [
  {
    "_id": "notif_1",
    "type": "payment",  // payment | complaint | booking | system
    "title": "Payment Due",
    "message": "Rent payment due on June 1st",
    "read": false,
    "createdAt": "2026-06-01T10:00:00Z"
  }
]
```

### Mark Notification Read
```dart
PATCH /api/notifications/{notificationId}/read

Response (200): { "message": "Marked as read" }
```

### Mark All Read
```dart
POST /api/notifications/mark-all-read

Response (200): { "message": "All marked as read" }
```

### Delete Notification
```dart
DELETE /api/notifications/{notificationId}

Response (200): { "message": "Deleted" }
```

---

## 📋 Common Tenant Workflows

### Workflow 1: New Tenant Onboarding
```
1. Register → POST /api/auth/register
2. Browse Hostels → GET /api/buildings/public
3. View Details → GET /api/buildings/public/{buildingId}
4. Create Booking → POST /api/bookings
5. Make Payment → POST /api/payments
6. Upload Photo → POST /api/tenant-portal/upload-photo
7. Update Profile → PATCH /api/tenant-portal/update-profile
8. View Dashboard → GET /api/tenant-portal/complete-profile
```

### Workflow 2: Monthly Rent Payment
```
1. Get Tenant Dashboard → GET /api/tenant-portal/complete-profile
2. Check Pending Payments → Review payments array
3. Record Payment → POST /api/payments
4. Download Invoice → GET /api/payments/{paymentId}/invoice
5. Get Confirmation → Listen to Socket.io 'paymentReceived' event
```

### Workflow 3: Report Maintenance Issue
```
1. Create Complaint → POST /api/complaints (with photo attachments)
2. Get Complaints → GET /api/complaints/me
3. Add Comment → POST /api/complaints/{complaintId}/comments
4. Check Status → Listen to Socket.io 'complaintStatusChanged' event
5. Resolve Complaint → View status updates
```

### Workflow 4: Guest Visit
```
1. Request Guest Pass → POST /api/tenant-portal/guest-passes
2. Get Pass Details → GET /api/tenant-portal/guest-passes
3. Share Pass Code with Visitor
4. View Pass Status → Check response status (pending/approved)
5. Guest Entry using Pass Code
```

---

## ⚡ Performance Tips for Tenants

1. **Cache Building Lists** - Use local caching for /api/buildings/public
2. **Lazy Load Images** - Load images only when visible
3. **Use Socket.io** - Listen for real-time updates instead of polling
4. **Batch Requests** - Get complete profile once using /api/tenant-portal/complete-profile
5. **Compress Images** - Reduce size before uploading (max 5MB, 1024x1024)
6. **Debounce Searches** - Wait 500ms before searching
7. **Offline Support** - Save failed requests for sync when online
8. **Token Refresh** - Refresh token before expiry using Socket.io auth

---

## ❌ Common Tenant Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Active booking exists" | Duplicate booking attempt | Cancel existing booking first |
| "Email already registered" | Email taken | Use forgot password or try different email |
| "Photo upload failed" | File too large or wrong format | Max 5MB, JPEG/PNG only |
| "SOS already triggered" | Too many SOS calls | Wait 5 minutes before next SOS |
| "Permission denied" | Room doesn't belong to you | Contact property owner |
| "Expired booking" | Moved out date passed | Contact owner to resolve |

---

## 🔐 Tenant Security Tips

✅ **DO:**
- Store JWT in `flutter_secure_storage`
- Clear token on logout
- Enable biometric authentication
- Verify SSL certificates
- Use strong passwords (min 8 chars)

❌ **DON'T:**
- Share booking/payment IDs in chat
- Store token in SharedPreferences
- Bypass SSL verification
- Save payment card details locally
- Share emergency contact details publicly

---

*For advanced features, see [COMPLETE API GUIDE](./API_FOR_FLUTTER.md)*
