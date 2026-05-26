# Hostel Hub API Endpoint URLs

**Base Host:** `https://livora-hostel-hub.onrender.com/api`

### 🔑 Authentication
- POST `/auth/login`
- POST `/auth/register`

### 🏢 Property Management
- GET `/buildings`
- GET `/buildings/:id`
- POST `/buildings`
- PATCH `/buildings/:id`
- DELETE `/buildings/:id`

### 🏘️ Layout (Floors/Rooms/Beds)
- GET `/floors/:buildingId`
- POST `/floors`
- GET `/rooms/:floorId`
- POST `/rooms`
- GET `/beds/:roomId`
- POST `/beds`

### 📅 Bookings & Tenants
- POST `/bookings`
- GET `/bookings/me`
- GET `/tenants`
- GET `/tenants/me`
- POST `/tenants/bulk`

### 💰 Payments
- GET `/payments`
- GET `/payments/me`
- POST `/payments`

### 🔧 Services & Complaints
- POST `/complaints`
- GET `/complaints/me`
- POST `/services/laundry`
- POST `/services/cleaning`
- POST `/services/visitors`
- POST `/services/leaves`

### 📈 Analytics
- GET `/dashboard/summary`
- GET `/dashboard/revenue`
- GET `/dashboard/occupancy`

---
*Note: Most endpoints require Bearer Token Authentication.*
