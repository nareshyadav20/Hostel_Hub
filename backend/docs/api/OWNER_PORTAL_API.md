# 🏢 Owner Portal Complete API Guide

**Base URL**: `https://livora-hostel-hub-1.onrender.com`

> All routes require: `Authorization: Bearer <token>` header with role=OWNER

---

## 🔐 Authentication

### 1. Register as Owner
```dart
POST /api/auth/register

Body: {
  "name": "Raj Kumar",
  "email": "owner@example.com",
  "password": "secure_password",
  "phone": "9876543210",
  "role": "OWNER"
}

Response (201):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "owner_123",
    "name": "Raj Kumar",
    "email": "owner@example.com",
    "role": "OWNER"
  }
}
```

### 2. Login
```dart
POST /api/auth/login

Body: {
  "email": "owner@example.com",
  "password": "secure_password"
}
```

---

## 📊 Owner Dashboard

### Get Dashboard Overview
```dart
GET /api/owner-portal/dashboard?buildingId=optional

Response (200):
{
  "stats": {
    "totalProperties": 3,
    "totalTenants": 45,
    "totalRevenue": 450000,
    "monthlyRevenue": 45000,
    "occupancyRate": "92%",
    "pendingPayments": 5,
    "openComplaints": 2,
    "emptyBeds": 3
  },
  "recentBookings": [
    {
      "_id": "booking_1",
      "tenantName": "John Doe",
      "buildingName": "Sunrise PG",
      "status": "pending",
      "amount": 15000,
      "date": "2026-06-01"
    }
  ],
  "pendingPayments": [
    {
      "_id": "payment_1",
      "tenantName": "Jane Doe",
      "amount": 9000,
      "dueDate": "2026-06-01",
      "status": "overdue"
    }
  ],
  "properties": [
    {
      "_id": "building_1",
      "name": "Sunrise PG",
      "occupancy": "85%",
      "revenue": 150000,
      "tenants": 15,
      "beds": 20
    }
  ]
}
```

### Get Property Details & Analytics
```dart
GET /api/owner-portal/property-details/{buildingId}

Response includes:
- Building information
- Floor-wise occupancy breakdown
- Room-wise details with pricing
- Bed availability status
- Monthly revenue breakdown
- Tenant list with details
- Complaint summary
- Payment status by tenant
```

### Get Detailed Analytics
```dart
GET /api/owner-portal/analytics?buildingId=optional&metric=revenue&fromDate=2026-01-01&toDate=2026-06-01

Response:
{
  "metric": "revenue",
  "data": [
    { "month": "January", "value": 40000 },
    { "month": "February", "value": 42000 },
    { "month": "March", "value": 45000 }
  ],
  "summary": {
    "total": 450000,
    "average": 42857,
    "highest": 45000,
    "lowest": 40000,
    "trend": "upward"
  }
}
```

---

## 🏢 Property Management

### Get All Properties
```dart
GET /api/buildings?lightweight=false

Response: [
  {
    "_id": "building_1",
    "name": "Sunrise PG",
    "address": "12 MG Road, Bengaluru",
    "locationCity": "Bengaluru",
    "genderType": "Male",
    "startingPrice": 8000,
    "amenities": ["WiFi", "AC", "Meals"],
    "images": [...],
    "floorsCount": 5,
    "totalBeds": 120,
    "availableBeds": 3,
    "occupancyRate": "97.5%",
    "rating": 4.8
  }
]

lightweighting tips:
- lightweight=true: Only building info (fast for dashboard)
- lightweight=false: Includes all floors, rooms, beds (for editing)
```

### Create New Property
```dart
POST /api/buildings (multipart/form-data)

Fields:
- name: "Sunrise PG"
- address: "12 MG Road"
- locationCity: "Bengaluru"
- genderType: "Male"  // Male | Female | Mixed
- startingPrice: 8000
- amenities: '["WiFi","AC","Meals"]'  (JSON stringified)
- description: "Premium PG with all amenities"
- images: [image files] (multipart)

Response (201):
{
  "_id": "building_123",
  "name": "Sunrise PG",
  "status": "active",
  "createdAt": "2026-06-01T10:00:00Z"
}
```

### Update Property
```dart
PATCH /api/buildings/{buildingId} (multipart/form-data)

Fields:
- name: "New Name" (optional)
- startingPrice: 9000 (optional)
- amenities: [...] (optional)
- description: "..." (optional)
- images: [new image files] (optional)
- removeImageIds: ["img_id_1", "img_id_2"] (optional)

Response (200): { "_id", "name", "updatedAt" }
```

### Delete Property
```dart
DELETE /api/buildings/{buildingId}

Conditions:
- No active bookings
- No pending payments

Response (200): { "message": "Property deleted" }
Error (400): "Cannot delete property with active bookings"
```

---

## 🏗️ Floor Management

### Get Floors
```dart
GET /api/floors/building/{buildingId}

Response: [
  {
    "_id": "floor_1",
    "floorName": "Ground Floor",
    "buildingId": "building_123",
    "roomsCount": 10,
    "totalBeds": 20,
    "availableBeds": 2
  }
]
```

### Create Floor
```dart
POST /api/floors

Body: {
  "buildingId": "building_123",
  "floorName": "First Floor"
}

Response (201): { "_id", "floorName", "roomsCount" }
```

### Update Floor
```dart
PATCH /api/floors/{floorId}

Body: {
  "floorName": "New Floor Name"
}

Response (200): { "_id", "floorName" }
```

### Delete Floor
```dart
DELETE /api/floors/{floorId}

Condition: No rooms in the floor

Response (200): { "message": "Floor deleted" }
```

---

## 🚪 Room Management

### Get Rooms in Floor
```dart
GET /api/rooms/floor/{floorId}

Response: [
  {
    "_id": "room_101",
    "roomName": "101",
    "category": "Standard",  // Standard | Premium | Deluxe
    "price": 8000,
    "capacity": 2,
    "bedsCount": 2,
    "occupancy": 1,
    "description": "Double room with AC",
    "images": [...]
  }
]
```

### Create Room
```dart
POST /api/rooms (multipart/form-data)

Fields:
- floorId: "floor_1"
- roomName: "101"
- category: "Standard"  // Standard | Premium | Deluxe
- price: 8000
- capacity: 2
- description: "Double room with AC"
- images: [image files]

Response (201): { "_id", "roomName", "price" }
```

### Update Room
```dart
PATCH /api/rooms/{roomId} (multipart/form-data)

Fields:
- roomName: "102" (optional)
- price: 9000 (optional)
- description: "..." (optional)
- images: [new images] (optional)

Response (200): { "_id", "roomName", "price" }
```

### Delete Room
```dart
DELETE /api/rooms/{roomId}

Condition: No beds in the room

Response (200): { "message": "Room deleted" }
```

---

## 🛏️ Bed Management

### Get All Beds
```dart
GET /api/beds?buildingId=optional

Response: [
  {
    "_id": "bed_1",
    "bedName": "101-A",
    "roomId": "room_101",
    "status": "available",  // available | occupied | maintenance
    "tenantId": null,
    "lastCleaned": "2026-06-01",
    "price": 8000
  }
]
```

### Create Bed
```dart
POST /api/beds

Body: {
  "roomId": "room_101",
  "bedName": "101-A"
}

Response (201): { "_id", "bedName", "status" }
```

### Update Bed Status
```dart
PATCH /api/beds/{bedId}

Body: {
  "status": "maintenance"  // available | occupied | maintenance
}

Response (200): { "_id", "status" }
```

### Delete Bed
```dart
DELETE /api/beds/{bedId}

Condition: Bed must be available

Response (200): { "message": "Bed deleted" }
```

---

## 📅 Booking Management (Owner View)

### Get All Bookings for Properties
```dart
GET /api/bookings/my-property?buildingId=optional&status=pending&fromDate=2026-01-01&toDate=2026-12-31

Status filter: pending | confirmed | checked-in | checked-out | cancelled

Response: [
  {
    "_id": "booking_123",
    "tenantName": "John Doe",
    "tenantPhone": "9876543210",
    "buildingName": "Sunrise PG",
    "roomName": "204",
    "moveInDate": "2026-06-15",
    "moveOutDate": null,
    "status": "pending",
    "totalAmount": 15000,
    "paymentStatus": "pending"
  }
]
```

### Update Booking Status
```dart
PATCH /api/bookings/{bookingId}/status

Body: {
  "status": "confirmed"  // confirmed | checked-in | checked-out | cancelled
}

Response (200): {
  "_id": "booking_123",
  "status": "confirmed",
  "updatedAt": "2026-06-01T10:30:00Z"
}
```

### Send Booking Confirmation
```dart
POST /api/bookings/{bookingId}/send-confirmation

Response (200): { "message": "Confirmation sent to tenant" }
```

---

## 💰 Payment Management (Owner View)

### Get All Payments from Properties
```dart
GET /api/payments/my-property?buildingId=optional&fromDate=2026-01-01&toDate=2026-12-31

Response: [
  {
    "_id": "payment_1",
    "tenantName": "John Doe",
    "buildingName": "Sunrise PG",
    "amount": 9000,
    "type": "Rent",
    "status": "Paid",
    "method": "UPI",
    "date": "2026-06-01",
    "month": "June 2026"
  }
]
```

### Get Payment Statistics
```dart
GET /api/payments/my-property/stats?buildingId=optional

Response:
{
  "totalReceived": 450000,
  "pendingPayments": 27000,
  "monthlyRevenue": 45000,
  "averageOccupancy": "92%",
  "collectionRate": "98.5%",
  "delayedPayments": 3,
  "breakdown": {
    "byMonth": [...],
    "byType": { "Rent": 400000, "Security": 50000 },
    "byStatus": { "Paid": 450000, "Pending": 27000 }
  }
}
```

### Send Payment Reminder
```dart
POST /api/payments/{paymentId}/send-reminder

Response (200): { "message": "Reminder sent to tenant" }
```

---

## 📣 Complaints Management (Owner View)

### Get All Complaints from Properties
```dart
GET /api/complaints/my-property?buildingId=optional&status=open&priority=High

Status: open | in-progress | resolved | closed
Priority: High | Medium | Low

Response: [
  {
    "_id": "complaint_123",
    "tenantName": "Jane Doe",
    "title": "Broken AC",
    "category": "Maintenance",
    "priority": "High",
    "status": "open",
    "createdAt": "2026-06-01T10:00:00Z",
    "resolvedAt": null
  }
]
```

### Update Complaint Status
```dart
PATCH /api/complaints/{complaintId}/status

Body: {
  "status": "in-progress"  // in-progress | resolved | closed
}

Response (200): { "_id", "status", "updatedAt" }
```

### Add Response to Complaint
```dart
POST /api/complaints/{complaintId}/comments

Body: {
  "comment": "AC has been repaired. Please verify."
}

Response (201): { "message": "Response added" }
```

---

## 👥 Staff Management

### Get All Staff
```dart
GET /api/staff?buildingId=optional&status=active

Status: active | inactive

Response: [
  {
    "_id": "staff_1",
    "name": "Rajesh Kumar",
    "phone": "9876543210",
    "role": "Manager",  // Manager | Housekeeper | Security | Maintenance
    "buildingName": "Sunrise PG",
    "salary": 12000,
    "status": "active",
    "joinDate": "2025-01-15"
  }
]
```

### Add Staff Member
```dart
POST /api/staff

Body: {
  "buildingId": "building_123",
  "name": "Rajesh Kumar",
  "phone": "9876543210",
  "role": "Manager",  // Manager | Housekeeper | Security | Maintenance
  "salary": 12000,
  "email": "rajesh@example.com"
}

Response (201): { "_id", "name", "role" }
```

### Update Staff
```dart
PATCH /api/staff/{staffId}

Body: {
  "phone": "9123456789",  // optional
  "role": "Security",  // optional
  "salary": 13000,  // optional
  "status": "inactive"  // optional
}

Response (200): { "_id", "name", "updatedAt" }
```

### Remove Staff
```dart
DELETE /api/staff/{staffId}

Response (200): { "message": "Staff member removed" }
```

---

## 📦 Inventory Management

### Get Inventory Items
```dart
GET /api/inventory?buildingId=optional&category=Furniture

Category: Furniture | Appliances | Bedding | Other

Response: [
  {
    "_id": "item_1",
    "itemName": "Single Bed",
    "category": "Furniture",
    "quantity": 25,
    "price": 5000,
    "location": "Floor 1",
    "status": "active",
    "addedDate": "2025-01-15"
  }
]
```

### Add Inventory Item
```dart
POST /api/inventory

Body: {
  "buildingId": "building_123",
  "itemName": "Single Bed",
  "category": "Furniture",
  "quantity": 5,
  "price": 5000,
  "location": "Floor 1",
  "notes": "For room 101-105"
}

Response (201): { "_id", "itemName", "quantity" }
```

### Update Inventory
```dart
PATCH /api/inventory/{itemId}

Body: {
  "quantity": 23,  // optional
  "status": "maintenance"  // optional
}

Response (200): { "_id", "quantity", "status" }
```

### Delete Inventory Item
```dart
DELETE /api/inventory/{itemId}

Response (200): { "message": "Item deleted" }
```

---

## 📞 Tenant Management (Owner View)

### Get All Tenants
```dart
GET /api/tenants/my-property?buildingId=optional&status=active

Status: active | inactive | checked-out

Response: [
  {
    "_id": "tenant_1",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "buildingName": "Sunrise PG",
    "roomName": "204",
    "moveInDate": "2026-01-15",
    "moveOutDate": null,
    "status": "active"
  }
]
```

### Get Tenant Details
```dart
GET /api/tenants/{tenantId}

Response includes:
- Complete profile
- Room and bed details
- Payment history
- Complaint history
- Booking history
- Contact information
- Emergency contacts
```

### Send Notice to Tenant
```dart
POST /api/tenants/{tenantId}/notice

Body: {
  "title": "Maintenance Notice",
  "message": "Scheduled maintenance on June 5th from 10 AM to 2 PM",
  "documentUrl": "https://example.com/notice.pdf"  // optional
}

Response (201): { "message": "Notice sent" }
```

### Checkout Tenant
```dart
PATCH /api/tenants/{tenantId}/checkout

Body: {
  "checkoutDate": "2026-06-30T00:00:00Z",
  "notes": "Checkout completed, deposit refunded"
}

Response (200): { "message": "Tenant checked out" }
```

### Send Payment Reminder
```dart
POST /api/tenants/{tenantId}/payment-reminder

Body: {
  "month": "June 2026",
  "amount": 9000
}

Response (200): { "message": "Reminder sent" }
```

---

## 🔔 Notifications (Owner)

### Get Notifications
```dart
GET /api/notifications?page=1&limit=50&type=payment

Response: [
  {
    "_id": "notif_1",
    "type": "payment",  // payment | complaint | booking | system
    "title": "Payment Received",
    "message": "Rent payment from John Doe received",
    "read": false,
    "createdAt": "2026-06-01T10:00:00Z",
    "data": { "paymentId": "..." }
  }
]
```

### Mark Notification Read
```dart
PATCH /api/notifications/{notificationId}/read

Response (200): { "message": "Marked as read" }
```

### Delete Notification
```dart
DELETE /api/notifications/{notificationId}

Response (200): { "message": "Deleted" }
```

---

## 📋 Common Owner Workflows

### Workflow 1: Add New Property
```
1. Create Building → POST /api/buildings
2. Create Floors → POST /api/floors
3. Create Rooms → POST /api/rooms
4. Create Beds → POST /api/beds
5. View Property Dashboard → GET /api/owner-portal/property-details/{buildingId}
6. Monitor Bookings → GET /api/bookings/my-property
```

### Workflow 2: Process New Booking
```
1. View Pending Bookings → GET /api/bookings/my-property?status=pending
2. Review Details → GET /api/bookings/{bookingId}
3. Update Status → PATCH /api/bookings/{bookingId}/status
4. Send Confirmation → POST /api/bookings/{bookingId}/send-confirmation
5. Notify Staff → POST /api/tenants/{tenantId}/notice
6. Monitor Check-in → Track booking status
```

### Workflow 3: Handle Tenant Complaint
```
1. View Complaints → GET /api/complaints/my-property
2. Assign Work → Notify relevant staff via notification
3. Update Status → PATCH /api/complaints/{complaintId}/status
4. Communicate → POST /api/complaints/{complaintId}/comments
5. Mark Resolved → Update status to "resolved"
6. Send Follow-up → Notify tenant
```

### Workflow 4: Monthly Revenue Report
```
1. Get Analytics → GET /api/owner-portal/analytics?metric=revenue&fromDate=...&toDate=...
2. Get Payment Stats → GET /api/payments/my-property/stats
3. Review Pending → GET /api/payments/my-property?status=Pending
4. Send Reminders → Send payment reminders to defaulters
5. Generate Report → Export analytics data
```

### Workflow 5: Staff Payroll
```
1. Get Staff List → GET /api/staff?buildingId=building_123
2. Review Salaries → Check salary field for each staff
3. Record Payment → POST /api/payments (type: "Salary")
4. Send Confirmation → Notify staff via notifications
5. Update Records → Maintain payroll logs
```

---

## ⚡ Performance Tips for Owners

1. **Use Lightweight Flag** - GET /api/buildings?lightweight=true for dashboards
2. **Filter Data** - Use date ranges, status filters to reduce payload
3. **Batch Operations** - Update multiple items together
4. **Cache Dashboard** - Cache daily dashboard data (TTL: 1 hour)
5. **Monitor Payments** - Regular payment follow-ups reduce defaults
6. **Analytics** - Use analytics endpoint for reports (pre-calculated)
7. **Socket.io** - Listen for real-time booking/payment notifications
8. **Async Operations** - Use notifications instead of polling

---

## 📊 Analytics & Reporting

### Key Metrics to Track

```
1. Occupancy Rate = (Occupied Beds / Total Beds) * 100
2. Collection Rate = (Paid / Total Due) * 100
3. Revenue Per Bed = Total Revenue / Total Beds
4. Average Complaint Resolution Time = Sum(resolution times) / Count(complaints)
5. Tenant Retention Rate = (Retained Tenants / Total Tenants) * 100
```

### Dashboard Refresh Frequency

- Real-time: Notifications, new bookings
- Hourly: Occupancy, payment status
- Daily: Revenue, complaints summary
- Weekly: Tenant analytics, staff performance
- Monthly: Full financial reports

---

## ❌ Common Owner Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Cannot delete property" | Active bookings exist | Complete/cancel all bookings first |
| "Cannot delete room" | Beds still present | Delete all beds first |
| "Insufficient permissions" | Not property owner | Use correct owner account |
| "Staff not found" | Wrong building ID | Verify building ID exists |
| "Tenant checkout failed" | Active complaints | Resolve complaints first |
| "Invalid inventory data" | Negative quantity | Ensure positive values |

---

## 🔐 Owner Security & Best Practices

✅ **DO:**
- Store owner-specific data securely
- Use SSL/TLS for all communications
- Verify tenant identity before checkout
- Maintain detailed payment records
- Use role-based access control
- Backup critical data regularly
- Enable two-factor authentication

❌ **DON'T:**
- Share authentication tokens
- Store passwords in plain text
- Bypass permission checks
- Modify tenant records without audit
- Delete booking records
- Share building analytics publicly
- Allow staff to access all properties

---

*For complete API reference, see [COMPLETE API GUIDE](./API_FOR_FLUTTER.md)*
