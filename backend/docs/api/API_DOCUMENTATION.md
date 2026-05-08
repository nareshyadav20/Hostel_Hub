# Hostel Hub - Full API Documentation v2.0 (Production Ready)

**Base URL:** `https://hostel-hub-1-0835.onrender.com`
**Version:** 1.0.0
**Support:** Naresh Yadav (Backend Lead)

---

## 🔐 GLOBAL CONFIGURATION
- **Authentication:** JWT (JSON Web Token)
- **Header:** `Authorization: Bearer <token>`
- **Content-Type:** `application/json`
- **File Uploads:** `multipart/form-data`

---

## --------------------------------
## AUTH APIs
## --------------------------------

### 1. Login User
- **Method:** `POST`
- **URL:** `https://hostel-hub-1-0835.onrender.com/api/auth/login`
- **Description:** Authenticates user and returns JWT token + profiles.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Response (200):**
  ```json
  {
    "user": { "_id": "...", "name": "...", "role": "OWNER" },
    "token": "eyJhbGci...",
    "tenantProfile": null
  }
  ```
- **Auth Required:** NO
- **Status Codes:** 200 (Success), 400 (Invalid), 404 (Not Found)

### 2. Register User
- **Method:** `POST`
- **URL:** `https://hostel-hub-1-0835.onrender.com/api/auth/register`
- **Description:** Creates a new user and auto-creates profile for Tenants.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword",
    "name": "Full Name",
    "role": "TENANT",
    "phone": "9876543210"
  }
  ```
- **Response (201):**
  ```json
  {
    "user": { "_id": "...", "email": "..." },
    "token": "eyJhbGci..."
  }
  ```
- **Auth Required:** NO

---

## --------------------------------
## HOSTEL & BUILDING APIs
## --------------------------------

### 3. Get All Buildings
- **Method:** `GET`
- **URL:** `https://hostel-hub-1-0835.onrender.com/api/buildings`
- **Description:** Fetch all properties owned by the user.
- **Auth Required:** YES
- **Response (200):** Array of building objects with nested floors/rooms/beds.

### 4. Create Building (Multipart Upload)
- **Method:** `POST`
- **URL:** `https://hostel-hub-1-0835.onrender.com/api/buildings`
- **Description:** Add a new property with images.
- **Request Body:**
  ```json
  {
    "name": "Alpha Tower",
    "address": "123 Street, City",
    "images": ["url1", "url2"],
    "startingPrice": 8500,
    "genderType": "Mixed"
  }
  ```
- **Auth Required:** YES

---

## --------------------------------
## ROOM & BED APIs
## --------------------------------

### 5. Get Rooms by Floor
- **Method:** `GET`
- **URL:** `https://hostel-hub-1-0835.onrender.com/api/rooms/:floorId`
- **Auth Required:** YES

### 6. Create Bed
- **Method:** `POST`
- **URL:** `https://hostel-hub-1-0835.onrender.com/api/beds`
- **Body:** `{ "bedNumber": "A1", "roomId": "..." }`
- **Auth Required:** YES

---

## --------------------------------
## BOOKING APIs
## --------------------------------

### 7. Create New Booking
- **Method:** `POST`
- **URL:** `https://hostel-hub-1-0835.onrender.com/api/bookings`
- **Description:** Reserves a room and generates an invoice.
- **Request Body:**
  ```json
  {
    "tenantId": "...",
    "buildingId": "...",
    "category": "Standard",
    "moveInDate": "2026-06-01",
    "totalAmount": 15000
  }
  ```
- **Auth Required:** YES

---

## --------------------------------
## PAYMENT APIs
## --------------------------------

### 8. Get My Payments
- **Method:** `GET`
- **URL:** `https://hostel-hub-1-0835.onrender.com/api/payments/me`
- **Query Params:** `tenantId` (Optional)
- **Auth Required:** YES

---

## --------------------------------
## TENANT PORTAL APIs (Community & Support)
## --------------------------------

### 9. Raise Complaint
- **Method:** `POST`
- **URL:** `https://hostel-hub-1-0835.onrender.com/api/complaints`
- **Body:** `{ "title", "description", "category", "priority" }`
- **Auth Required:** YES

### 10. Community Report (Incident Reporting)
- **Method:** `POST`
- **URL:** `https://hostel-hub-1-0835.onrender.com/api/tenant-portal/community-reports`
- **Auth Required:** YES

---

## 📱 FLUTTER MOBILE INTEGRATION (Dio)

### Authorization Header
```dart
dio.options.headers["Authorization"] = "Bearer $token";
```

### Multipart Image Upload
```dart
Future<void> uploadImage(String filePath) async {
  FormData formData = FormData.fromMap({
    "file": await MultipartFile.fromFile(filePath, filename: "building.jpg"),
  });
  await dio.post('/upload', data: formData);
}
```

### API Calling with Error Handling
```dart
try {
  final response = await dio.get('/buildings');
  // Handle success
} on DioException catch (e) {
  if (e.response?.statusCode == 401) {
    // Redirect to login
  } else {
    print(e.response?.data["message"]);
  }
}
```

---

## 🛠️ PROJECT AUDIT & SECURITY
- **CORS Setup:** ✅ Verified (Origin: *)
- **Auth Middleware:** ✅ Verified (Uses `jsonwebtoken`)
- **Database:** ✅ Verified (MongoDB with Mongoose)
- **Protected Routes:** ✅ Verified (Most routes under `/api` except Auth)
- **Image Uploads:** ✅ Verified (Base64/URL support in JSON and Multipart enabled)
- **Missing Endpoints Fix**: ⚠️ Found `tenantPortalRoutes` not registered in `index.js`. Please ensure you add `app.use('/api/tenant-portal', tenantPortalRoutes);` in `index.js` to enable them.
