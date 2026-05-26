# Hostel Hub - Flutter API Reference v1.0

This document contains the complete API specification for the Hostel Hub mobile application.

**Base URL:** `https://livora-hostel-hub-1.onrender.com`
**API Prefix:** `/api`

---

## 🔐 Authentication & Headers
All requests (except Login/Register) must include the JWT token.

**Headers:**
- `Authorization`: `Bearer <YOUR_TOKEN>`
- `Content-Type`: `application/json`

---

## 🚀 Authentication Module

### Login
- **URL:** `/auth/login`
- **Method:** `POST`
- **Body:** `{ "email": "...", "password": "..." }`
- **Success:** `200 OK` (Returns `user`, `token`, `tenantProfile`)

### Register
- **URL:** `/auth/register`
- **Method:** `POST`
- **Body:** `{ "email", "password", "name", "role", "phone" }`

---

## 🏠 Property & Layout Module

### Get All Buildings
- **URL:** `/buildings`
- **Method:** `GET`
- **Auth:** Required

### Get Building Details (Hierarchy)
- **URL:** `/buildings/:id`
- **Method:** `GET`
- **Auth:** Required
- **Returns:** Building object with nested `floors -> rooms -> beds`

---

## 📅 Booking Module

### Create Booking
- **URL:** `/bookings`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "tenantId": "...",
    "buildingId": "...",
    "category": "...",
    "moveInDate": "YYYY-MM-DD",
    "totalAmount": 0
  }
  ```

---

## 💳 Payment Module

### Get My Payments
- **URL:** `/payments/me?tenantId=...`
- **Method:** `GET`

### Create Payment
- **URL:** `/payments`
- **Method:** `POST`
- **Body:** `{ "tenantId", "amount", "type", "method", "buildingId" }`

---

## 🛠️ Service Module

### Laundry Request
- **URL:** `/services/laundry`
- **Method:** `POST`
- **Body:** `{ "items": [], "pickupDate": "..." }`

### Maintenance Complaint
- **URL:** `/complaints`
- **Method:** `POST`
- **Body:** `{ "title", "description", "category", "priority" }`

---

## 📊 Dashboard Module

### Get KPI Summary
- **URL:** `/dashboard/summary`
- **Method:** `GET`
- **Returns:** `{ totalBeds, occupiedBeds, todayRevenue, occupancyRate }`

---

## 📱 Flutter Integration (Quick Start)

**Recommended Package:** `dio`

```dart
// Example Request
final dio = Dio();
dio.options.headers["Authorization"] = "Bearer $token";

final response = await dio.get('https://livora-hostel-hub-1.onrender.com/api/buildings');
print(response.data);
```
