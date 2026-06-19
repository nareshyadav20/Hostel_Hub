# 📱 Livora Hostel Hub — Production‑Ready API Specification

---

## 🎯 Goal
Create a **single source of truth** for all backend endpoints. The spec follows REST best practices, includes validation, security, pagination, and is optimized for mobile/Flutter clients with infinite scrolling.

---

## 📦 Base URL
```
https://livora-hostel-hub-1.onrender.com/api
```
All protected routes require the header:
```
Authorization: Bearer <access_token>
```

---

## 🔐 Authentication
### POST `/auth/login` _(public)_
```json
{ "email": "user@example.com", "password": "******" }
```
**Response (200)**
```json
{ "success": true, "message": "Login successful", "data": { "accessToken": "...", "refreshToken": "...", "expiresIn": 900, "user": { "_id": "user_id", "name": "John Doe", "email": "user@example.com", "role": "ADMIN", "profileImage": "https://.../avatar.jpg", "gender": "Male", "address": "Bengaluru", "dateOfBirth": "1995-04-12" } } }
```
**Errors**: 400 (validation), 401 (invalid credentials).

### POST `/auth/refresh` _(public)_
```json
{ "refreshToken": "<refresh_token>" }
```
Returns a new access token. 200 on success, 401 if refresh token invalid/expired.

### POST `/auth/logout` _(protected)_
Invalidates the refresh token. 200 on success.

---

## 📋 Standard Response Envelope
```json
{ "success": true, "message": "Operation successful", "data": {} }
```
**Error envelope**
```json
{ "success": false, "message": "Validation failed", "errorCode": "VALIDATION_ERROR", "details": [ { "field": "page", "message": "must be >= 1" } ] }
```
All endpoints must use this format.

---

## 🏨 Hostels (Public) – No Auth Required
### GET `/hostels`
Consolidated listing, searching, filtering, sorting, and pagination.
#### Query Parameters
| Param | Type | Description |
|------|------|-------------|
| `page` | int | Page number (≥ 1). Default 1 |
| `limit` | int | Items per page (1‑100). Default 20 |
| `location` | string | Partial case‑insensitive city name |
| `minRent` | number | Minimum starting price |
| `maxRent` | number | Maximum starting price |
| `rating` | number | Minimum average rating |
| `gender` | string | `Male`, `Female`, `Mixed` |
| `foodAvailable` | boolean | Filter by food amenity |
| `wifiAvailable` | boolean | Filter by Wi‑Fi amenity |
| `sortBy` | string | `price`, `rating`, `createdAt` |
| `sortOrder` | string | `asc` or `desc` |
#### Validation
- `page >= 1`
- `1 <= limit <= 100`
- All other params optional; numeric params must be parsable numbers.
#### Response (200)
```json
{ "success": true, "message": "Hostels fetched", "data": { "hostels": [ { "_id": "building_123", "name": "Sunrise PG", "locationCity": "Bengaluru", "startingPrice": 8000, "rating": 4.8, "genderType": "Male", "amenities": ["WiFi", "AC"], "images": ["/uploads/building/img1.jpg"], "occupancy": 85 } ], "pagination": { "page": 1, "limit": 20, "total": 45, "pages": 3 } } }
```
**Error**: 400 validation, 500 server.

---

## 🏨 Hostels API v1 (Public)
### GET `/api/v1/hostels`
Dynamic Hostel Listing API with robust filtering, sorting, and pagination.

#### Query Parameters
| Param | Type | Description |
|------|------|-------------|
| `page` | int | Page number (≥ 1). Default 1 |
| `limit` | int | Items per page. Default 10 |
| `location` | string | Partial case‑insensitive city/location name |
| `minPrice` | number | Minimum price range |
| `maxPrice` | number | Maximum price range |
| `rating` | number | Minimum average rating |
| `gender` | string | `MALE`, `FEMALE`, `BOTH` |
| `sortBy` | string | Field to sort by: `price`, `rating`, `createdAt` |
| `order` | string | `asc` or `desc` |

#### Example Query
`/api/v1/hostels?location=Hyderabad&gender=MALE&rating=4&minPrice=5000&maxPrice=10000&sortBy=price&order=asc&page=1&limit=10`

#### Response (200)
```json
{
  "success": true,
  "page": 1,
  "limit": 10,
  "totalPages": 5,
  "totalHostels": 50,
  "data": [
    {
      "_id": "...",
      "name": "ABC Boys Hostel",
      "location": "Hyderabad",
      "gender": "MALE",
      "price": 7000,
      "rating": 4.5,
      "amenities": ["Wifi", "AC", "Food"]
    }
  ]
}
```

---

## 🏨 Hostel Details (Public)
### GET `/hostels/{hostelId}`
#### Path
- `hostelId` – MongoDB ObjectId.
#### Response (200)
```json
{ "success": true, "message": "Hostel detail fetched", "data": { "_id": "building_123", "name": "Sunrise PG", "address": "12 MG Road, Indiranagar", "locationCity": "Bengaluru", "description": "Premium PG with all amenities", "startingPrice": 8000, "genderType": "Male", "amenities": ["WiFi", "AC", "Meals"], "images": ["/uploads/building/img1.jpg", "/uploads/building/img2.jpg"], "rules": ["No smoking", "No parties after 10pm"], "rating": 4.8, "reviewsSummary": { "count": 45, "average": 4.7, "latest": [{ "user": "John", "rating": 5, "comment": "Great place!" }] }, "floors": [ { "_id": "floor_1", "name": "Ground Floor", "rooms": [ { "_id": "room_101", "name": "101", "category": "Standard", "price": 8000, "beds": [ { "_id": "bed_1", "name": "101‑A", "status": "available" }, { "_id": "bed_2", "name": "101‑B", "status": "occupied" } ] } ] } ] } }
```
---

## 👤 Profile (Protected) – Role obtained from JWT (actual value is **ADMIN**)
### GET `/profile`
Returns the current user profile.
### PATCH `/profile`
Updatable fields: `name`, `profileImage`, `gender`, `address`, `dateOfBirth`.
Attempting to update `email` or `mobileNumber` returns **403 Forbidden**.
#### Request Example
```json
{ "name": "Jane Doe", "address": "Mumbai" }
```
#### Response (200)
Standard success envelope with updated user object.
---

## ⭐ Wishlist (Protected)
### POST `/wishlist`
Add a hostel to the user's wishlist.
```json
{ "hostelId": "building_123" }
```
Returns **409 Conflict** if already in wishlist.
### GET `/wishlist`
List all wishlisted hostels (supports same pagination params as `/hostels`).
### DELETE `/wishlist/{hostelId}`
Remove a hostel from the wishlist. 404 if not present.
---

## 📅 Booking (Protected)
### POST `/bookings`
```json
{ "hostelId": "building_123", "checkInDate": "2026-07-01", "durationMonths": 6, "roomType": "AC", "bedType": "single" }
```
#### Validation
- `hostelId` must exist and be active.
- `checkInDate` must be a future ISO‑date.
- `durationMonths` ≥ 1 and ≤ 24.
- `roomType` values: `AC`, `Non‑AC`.
- `bedType` values: `single`, `double`.
#### Response (201)
```json
{ "success": true, "message": "Booking created", "data": { "bookingId": "booking_abc", "status": "Pending", "totalPrice": 48000 } }
```
---

## 📖 Community (Protected)
### POST `/tenant-portal/community-reports`
Create a community report.
### GET `/tenant-portal/community-reports`
List reports for the authenticated user.
---

## 🚨 SOS Alerts (Protected)
### POST `/tenant-portal/sos-alerts`
Create an SOS alert.
---

## 🏆 Rewards (Protected)
### GET `/tenant-portal/rewards/me`
Fetch the authenticated user's reward balance and history.
---

## 📬 Notifications (Protected)
### GET `/notifications`
Fetch all notifications for the user.
### PATCH `/notifications/{id}/read`
Mark a notification as read.
### DELETE `/notifications/{id}`
Delete a notification.
---

## 🛏️ Room Transfer (Protected)
### POST `/room-transfer`
Create a room transfer request.
### GET `/room-transfer`
List all transfers (admin/owner view).
### GET `/room-transfer/me`
List current user's transfers.
---

## 🍽️ Mess Services (Protected)
### GET `/mess/menu?buildingId=...`
Retrieve mess menu.
### GET `/mess/attendance?buildingId=...&date=...`
Fetch attendance.
### PUT `/mess/attendance`
Update attendance.
### POST `/mess/rating`
Submit mess rating.
---

## 🗨️ Complaints (Protected)
### POST `/complaints`
Create a complaint.
### GET `/complaints/me`
List user's complaints.
---

## 🔐 Confidential Reports (Protected)
### POST `/confidential-report`
Submit a confidential report.
### GET `/confidential-report/me`
List user's confidential reports.
---

## 🛠️ Service Requests (Protected)
### POST `/service/laundry`
Create a laundry order.
### GET `/service/laundry/me`
List user's laundry orders.
### POST `/service/cleaning`
Schedule cleaning service.
### GET `/service/cleaning/me`
List cleaning history.
### POST `/service/visitors`
Create visitor access request.
### GET `/service/visitors/me`
List visitor accesses.
### POST `/service/leaves`
Submit leave notice.
### GET `/service/leaves/me`
List leave notices.
---

## 📚 Security Recommendations
- **Rate limiting**: 100 requests/min per IP (express‑rate‑limit). Auth endpoints limited to 10 requests/min/IP.
- **Helmet** for HTTP headers.
- **CORS** whitelist: `https://app.livora.com`, `http://localhost:3000`, `http://localhost:5173`.
- **Input sanitisation** using `express-validator`.
- **Password hashing** with `bcrypt` (salt 12).
- **RBAC** middleware checking user role for each protected route.
- **JWT**: Access token ≈ 15 min, Refresh token ≈ 7 days. Verify `iss`, `aud`, `exp`, and that the user still exists.
---

## 🗂️ Database Index Recommendations
| Collection | Field(s) | Type | Reason |
|------------|----------|------|--------|
| `buildings` | `locationCity` | `text` | Enables case‑insensitive partial city search. |
| `buildings` | `startingPrice` | `ascending` | Range queries for rent filtering. |
| `buildings` | `rating` | `descending` | Sorting by rating. |
| `buildings` | `createdAt` | `descending` | Newest listings / pagination cursor. |
| `users` | `email` | `unique` | Fast login lookup. |
| `wishlists` | `{ userId, buildingId }` | `unique compound` | Prevent duplicate wishlist entries. |
| `bookings` | `{ userId, status }` | `compound` | Frequently filtered for user dashboard. |
---

## ⚡ Performance Optimisations
- **Pagination**: Use **cursor‑based** (`_id` > lastId) for infinite scroll; fallback to offset for compatibility.
- **Caching**: Redis cache for `/hostels` results (key includes query hash) – TTL 60 s.
- **Image handling**: Store images on a CDN (e.g., Cloudinary) and serve signed URLs; resize to max 800 px.
- **Response size**: Omit heavy sub‑documents in list view (`floors`, `rooms`, `beds`). Use `lightweight=true` query flag if more data needed.
---

## 📖 OpenAPI (Swagger) Skeleton
A minimal excerpt – generate the full `openapi.yaml` from this skeleton.
```yaml
openapi: 3.1.0
info:
  title: Livora Hostel Hub API
  version: 1.0.0
servers:
  - url: https://livora-hostel-hub-1.onrender.com/api
paths:
  /auth/login:
    post:
      summary: User login
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginRequest'
      responses:
        '200':
          description: Successful login
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
  /hostels:
    get:
      summary: List hostels with filters & pagination
      parameters:
        - $ref: '#/components/parameters/Page'
        - $ref: '#/components/parameters/Limit'
        - $ref: '#/components/parameters/Location'
        # other filter params …
      responses:
        '200':
          description: Paginated hostels list
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HostelListResponse'
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  schemas:
    LoginRequest:
      type: object
      required: [email, password]
      properties:
        email:
          type: string
          format: email
        password:
          type: string
    AuthResponse:
      type: object
      properties:
        accessToken:
          type: string
        refreshToken:
          type: string
        expiresIn:
          type: integer
        user:
          $ref: '#/components/schemas/User'
    User:
      type: object
      properties:
        _id:
          type: string
        name:
          type: string
        email:
          type: string
        role:
          type: string
        profileImage:
          type: string
    HostelListResponse:
      type: object
      properties:
        hostels:
          type: array
          items:
            $ref: '#/components/schemas/HostelSummary'
        pagination:
          $ref: '#/components/schemas/Pagination'
    HostelSummary:
      type: object
      properties:
        _id:
          type: string
        name:
          type: string
        locationCity:
          type: string
        startingPrice:
          type: number
        rating:
          type: number
        genderType:
          type: string
        amenities:
          type: array
          items:
            type: string
        images:
          type: array
          items:
            type: string
    Pagination:
      type: object
      properties:
        page:
          type: integer
        limit:
          type: integer
        total:
          type: integer
        pages:
          type: integer
  parameters:
    Page:
      name: page
      in: query
      schema:
        type: integer
        minimum: 1
      description: Page number (≥ 1)
    Limit:
      name: limit
      in: query
      schema:
        type: integer
        minimum: 1
        maximum: 100
      description: Items per page (1‑100)
    Location:
      name: location
      in: query
      schema:
        type: string
      description: Partial city name, case‑insensitive
security:
  - BearerAuth: []
```
---

## ✅ Final Checklist
- [x] Consolidated `/hostels` endpoint.
- [x] Detailed `/hostels/{id}` endpoint.
- [x] Pagination validation (page ≥ 1, 1 ≤ limit ≤ 100).
- [x] Search behavior defined (case‑insensitive, text index).
- [x] Profile GET/PATCH with field restrictions.
- [x] Wishlist POST/GET/DELETE with duplicate guard.
- [x] New booking payload & validation.
- [x] Auth flow with access/refresh tokens.
- [x] Security hardening recommendations.
- [x] Standardised response envelope.
- [x] Database indexes list.
- [x] Performance & caching advice.
- [x] OpenAPI skeleton ready.

---

*The above document replaces the previous contents of `backend/docs/api/API_FOR_FLUTTER.md`. It now aligns with the actual backend implementation and includes the correct role value.*

---

## 🎯 Goal
Create a **single source of truth** for all backend endpoints. The spec follows REST best practices, includes validation, security, pagination, and is optimized for mobile/Flutter clients with infinite scrolling.

---

## 📦 Base URL
```
https://livora-hostel-hub-1.onrender.com/api
```
All protected routes require the header:
```
Authorization: Bearer <access_token>
```

---

## 🔐 Authentication
### POST `/auth/login`  _(public)_
```json
{
  "email": "user@example.com",
  "password": "******"
}
```
**Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci...",
    "expiresIn": 900,
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "TENANT",
      "profileImage": "https://.../avatar.jpg",
      "gender": "Male",
      "address": "Bengaluru",
      "dateOfBirth": "1995-04-12"
    }
  }
}
```
**Errors**: 400 (validation), 401 (invalid credentials).

### POST `/auth/refresh`  _(public)_
```json
{ "refreshToken": "<refresh_token>" }
```
Returns a new access token. 200 on success, 401 if refresh token invalid/expired.

### POST `/auth/logout`  _(protected)_
Invalidates the refresh token. 200 on success.

---

## 📋 Standard Response Envelope
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```
**Error envelope**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errorCode": "VALIDATION_ERROR",
  "details": [
    { "field": "page", "message": "must be >= 1" }
  ]
}
```
All endpoints must use this format.

---

## 🏨 Hostels (Public) – No Auth Required
### GET `/hostels`
Consolidated listing, searching, filtering, sorting, and pagination.
#### Query Parameters
| Param | Type | Description |
|------|------|-------------|
| `page` | int | Page number (≥ 1). Default 1 |
| `limit` | int | Items per page (1‑100). Default 20 |
| `location` | string | Partial case‑insensitive city name |
| `minRent` | number | Minimum starting price |
| `maxRent` | number | Maximum starting price |
| `rating` | number | Minimum average rating |
| `gender` | string | `Male`, `Female`, `Mixed` |
| `foodAvailable` | boolean | Filter by food amenity |
| `wifiAvailable` | boolean | Filter by Wi‑Fi amenity |
| `sortBy` | string | `price`, `rating`, `createdAt` |
| `sortOrder` | string | `asc` or `desc` |
#### Validation
- `page >= 1`
- `1 <= limit <= 100`
- All other params optional; numeric params must be parsable numbers.
#### Response (200)
```json
{
  "success": true,
  "message": "Hostels fetched",
  "data": {
    "hostels": [
      {
        "_id": "building_123",
        "name": "Sunrise PG",
        "locationCity": "Bengaluru",
        "startingPrice": 8000,
        "rating": 4.8,
        "genderType": "Male",
        "amenities": ["WiFi", "AC"],
        "images": ["/uploads/building/img1.jpg"],
        "occupancy": 85
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  }
}
```
**Error**: 400 validation, 500 server.

---

## 🏨 Hostel Details (Public)
### GET `/hostels/{hostelId}`
#### Path
- `hostelId` – MongoDB ObjectId.
#### Response (200)
```json
{
  "success": true,
  "message": "Hostel detail fetched",
  "data": {
    "_id": "building_123",
    "name": "Sunrise PG",
    "address": "12 MG Road, Indiranagar",
    "locationCity": "Bengaluru",
    "description": "Premium PG with all amenities",
    "startingPrice": 8000,
    "genderType": "Male",
    "amenities": ["WiFi", "AC", "Meals"],
    "images": ["/uploads/building/img1.jpg", "/uploads/building/img2.jpg"],
    "rules": ["No smoking", "No parties after 10pm"],
    "rating": 4.8,
    "reviewsSummary": {
      "count": 45,
      "average": 4.7,
      "latest": [{ "user": "John", "rating": 5, "comment": "Great place!" }]
    },
    "floors": [
      {
        "_id": "floor_1",
        "name": "Ground Floor",
        "rooms": [
          {
            "_id": "room_101",
            "name": "101",
            "category": "Standard",
            "price": 8000,
            "beds": [
              { "_id": "bed_1", "name": "101‑A", "status": "available" },
              { "_id": "bed_2", "name": "101‑B", "status": "occupied" }
            ]
          }
        ]
      }
    ]
  }
}
```
---

## 👤 Profile (Protected)
### GET `/profile`
Returns current user profile (fields defined below).
### PATCH `/profile`
Only the following fields are updatable:
- `name`
- `profileImage` (URL)
- `gender`
- `address`
- `dateOfBirth`
Attempting to update `email` or `mobileNumber` returns **403 Forbidden**.
#### Request Example
```json
{ "name": "Jane Doe", "address": "Mumbai" }
```
#### Response (200)
Standard success envelope with updated user object.
---

## ⭐ Wishlist (Protected)
### POST `/wishlist`
Add a hostel to the user's wishlist.
```json
{ "hostelId": "building_123" }
```
- Returns **409 Conflict** if the hostel already exists in the wishlist.
### GET `/wishlist`
List all wishlisted hostels (paginated, same params as `/hostels`).
### DELETE `/wishlist/{hostelId}`
Remove a hostel from the wishlist. 404 if not present.
---

## 📅 Booking (Protected)
### POST `/bookings`
Redesigned booking payload.
```json
{
  "hostelId": "building_123",
  "checkInDate": "2026-07-01",
  "durationMonths": 6,
  "roomType": "AC",
  "bedType": "single"
}
```
#### Validation
- `hostelId` must exist and be active.
- `checkInDate` must be a future ISO‑date.
- `durationMonths` ≥ 1 and ≤ 24.
- `roomType` values: `AC`, `Non‑AC`.
- `bedType` values: `single`, `double`.
#### Response (201)
```json
{
  "success": true,
  "message": "Booking created",
  "data": {
    "bookingId": "booking_abc",
    "status": "Pending",
    "totalPrice": 48000
  }
}
```
---

## 🔒 Security Recommendations
- **Rate limiting**: 100 requests/min per IP (express‑rate‑limit).
- **Helmet** for HTTP headers.
- **CORS** whitelist: `https://app.livora.com`, `http://localhost:3000`.
- **Input sanitisation** using `express-validator`.
- **Password hashing** with `bcrypt` (salt 12).
- **RBAC** middleware checking user role for each protected route.
- **JWT**: 
  - Access token ≈ 15 min, refresh ≈ 7 days.
  - Verify `iss`, `aud`, `exp`, and that user still exists in DB.
---

## 🛠️ Database Index Recommendations
| Collection | Field(s) | Type | Reason |
|------------|----------|------|--------|
| `buildings` | `locationCity` | `text` | Enables case‑insensitive partial city search. |
| `buildings` | `startingPrice` | `ascending` | Range queries for rent filtering. |
| `buildings` | `rating` | `descending` | Sorting by rating. |
| `buildings` | `createdAt` | `descending` | Newest listings / pagination cursor. |
| `users` | `email` | `unique` | Fast login lookup. |
| `wishlists` | `{ userId, buildingId }` | `unique compound` | Prevent duplicate wishlist entries. |
| `bookings` | `{ userId, status }` | `compound` | Frequently filtered for user dashboard. |
---

## ⚡ Performance Optimisations
- **Pagination**: Use **cursor‑based** (`_id` > lastId) for infinite scroll; fallback to offset for compatibility.
- **Caching**: Redis cache for `/hostels` results (key includes query hash) – TTL 60 s.
- **Image handling**: Store images on a CDN (e.g., Cloudinary) and serve signed URLs; resize to max 800 px.
- **Response size**: Omit heavy sub‑documents in list view (`floors`, `rooms`, `beds`). Use `lightweight=true` query flag if more data needed.
---

## 📖 OpenAPI (Swagger) Skeleton
A minimal excerpt – generate the full `openapi.yaml` from this skeleton.
```yaml
openapi: 3.1.0
info:
  title: Livora Hostel Hub API
  version: 1.0.0
servers:
  - url: https://livora-hostel-hub-1.onrender.com/api
paths:
  /auth/login:
    post:
      summary: User login
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginRequest'
      responses:
        '200':
          description: Successful login
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
  /hostels:
    get:
      summary: List hostels with filters & pagination
      parameters:
        - $ref: '#/components/parameters/Page'
        - $ref: '#/components/parameters/Limit'
        - $ref: '#/components/parameters/Location'
        # other filter params …
      responses:
        '200':
          description: Paginated hostels list
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HostelListResponse'
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  schemas:
    LoginRequest:
      type: object
      required: [email, password]
      properties:
        email:
          type: string
          format: email
        password:
          type: string
    AuthResponse:
      type: object
      properties:
        accessToken:
          type: string
        refreshToken:
          type: string
        expiresIn:
          type: integer
        user:
          $ref: '#/components/schemas/User'
    User:
      type: object
      properties:
        _id:
          type: string
        name:
          type: string
        email:
          type: string
        role:
          type: string
        profileImage:
          type: string
    HostelListResponse:
      type: object
      properties:
        hostels:
          type: array
          items:
            $ref: '#/components/schemas/HostelSummary'
        pagination:
          $ref: '#/components/schemas/Pagination'
    HostelSummary:
      type: object
      properties:
        _id:
          type: string
        name:
          type: string
        locationCity:
          type: string
        startingPrice:
          type: number
        rating:
          type: number
        genderType:
          type: string
        amenities:
          type: array
          items:
            type: string
        images:
          type: array
          items:
            type: string
    Pagination:
      type: object
      properties:
        page:
          type: integer
        limit:
          type: integer
        total:
          type: integer
        pages:
          type: integer
  parameters:
    Page:
      name: page
      in: query
      schema:
        type: integer
        minimum: 1
      description: Page number (≥ 1)
    Limit:
      name: limit
      in: query
      schema:
        type: integer
        minimum: 1
        maximum: 100
      description: Items per page (1‑100)
    Location:
      name: location
      in: query
      schema:
        type: string
      description: Partial city name, case‑insensitive
security:
  - BearerAuth: []
```
---

## ✅ Final Checklist
- [x] Consolidated `/hostels` endpoint.
- [x] Detailed `/hostels/{id}` endpoint.
- [x] Pagination validation (page ≥ 1, 1 ≤ limit ≤ 100).
- [x] Search behavior defined (case‑insensitive, text index).
- [x] Profile GET/PATCH with field restrictions.
- [x] Wishlist POST/GET/DELETE with duplicate guard.
- [x] New booking payload & validation.
- [x] Auth flow with access/refresh tokens.
- [x] Security hardening recommendations.
- [x] Standardised response envelope.
- [x] Database indexes list.
- [x] Performance & caching advice.
- [x] OpenAPI skeleton ready.

---

*The above document replaces the previous contents of `backend/docs/api/API_FOR_FLUTTER.md`. It is now production‑ready and can be directly consumed by Flutter developers.*
