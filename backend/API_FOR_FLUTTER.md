# Livora Hostel Hub - Flutter API Documentation

This document outlines the API endpoints designed specifically for the Flutter mobile application. Base URL should be configured to point to your backend API server (e.g., `https://livora-hostel-hub-1.onrender.com/api`).

## Authentication & Authorization
Most endpoints (except public hostel listings) require a valid JWT token passed in the `Authorization` header.

**Header Format:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Common Error Responses:**
- `401 Unauthorized`: 
  - `{ "success": false, "message": "Invalid Token" }`
  - `{ "success": false, "message": "Token Expired" }`

---

## 1. Hostel Listing & Search APIs (Public)

These endpoints do NOT require an authorization token.

### 1.1 Get Hostel List (Paginated)
**Endpoint:** `GET /hostels/list`

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | `1` | Current page number |
| `limit` | integer | No | `20` | Number of records per page |

**Response (200 OK):**
```json
{
  "success": true,
  "page": 1,
  "limit": 20,
  "totalRecords": 250,
  "totalPages": 13,
  "data": [
    {
      "hostelId": "60d5ecb54f9a...a1",
      "name": "Sri Lakshmi Hostel",
      "location": "Hyderabad",
      "rent": 0,
      "rating": 4.5,
      "availableBeds": 15,
      "totalBeds": 100,
      "images": ["url1", "url2"],
      "amenities": {
        "mess": true,
        "gym": false,
        "laundry": true
      }
    }
  ]
}
```

### 1.2 Search, Filter, and Sort Hostels
**Endpoint:** `GET /hostels/search`

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `location` | string | No | null | City or area name to filter by |
| `page` | integer | No | `1` | Current page number |
| `limit` | integer | No | `20` | Number of records per page |
| `sortBy` | string | No | `createdAt` | Sort field: `rent`, `rating`, `createdAt` |
| `sortOrder` | string | No | `desc` | Sort direction: `asc`, `desc` |

**Response (200 OK):**
```json
{
  "success": true,
  "page": 1,
  "limit": 20,
  "totalRecords": 50,
  "totalPages": 3,
  "data": [
    {
      "hostelId": "60d5ecb54f9a...a1",
      "name": "ABC Hostel",
      "location": "Hyderabad",
      "rent": 0,
      "rating": 4.8,
      "availableBeds": 5,
      "totalBeds": 50,
      "images": ["url1"]
    }
  ]
}
```

### 1.3 Get Hostel Details
**Endpoint:** `GET /hostels/:hostelId/detail`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "hostelId": "60d5ecb54f9a...a1",
    "name": "Sri Lakshmi Hostel",
    "address": "123 Main St, Hyderabad",
    "location": "Hyderabad",
    "description": "A wonderful place to stay.",
    "totalBeds": 100,
    "availableBeds": 15,
    "rating": 4.5,
    "images": ["url1", "url2"],
    "ownerDetails": {
      "name": "John Doe",
      "phone": "9876543210",
      "email": "john@example.com"
    },
    "amenities": {
      "security": true,
      "cctv": true,
      "parking": true,
      "powerBackup": true,
      "mess": true,
      "gym": false,
      "library": false,
      "laundry": true,
      "housekeeping": true,
      "medicalSupport": false
    },
    "createdAt": "2023-01-01T12:00:00Z"
  }
}
```

---

## 2. Profile Management APIs (Protected)

Requires `Authorization: Bearer <token>`

### 2.1 Get Profile
**Endpoint:** `GET /profile`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ecb5...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "mobileNumber": "9876543210",
    "gender": "Female",
    "address": "456 Side St",
    "dateOfBirth": "2000-01-01"
  }
}
```

### 2.2 Update Profile
**Endpoint:** `PUT /profile`

**Allowed Fields (Body):**
- `name` (string)
- `profileImage` (string URL)
- `gender` (string)
- `address` (string)
- `dateOfBirth` (string/date)

**Blocked Fields:**
- `email`, `mobileNumber`, `phone`

**Example Request:**
```json
{
  "name": "Jane Doe Updated",
  "gender": "Female"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ecb5...",
    "name": "Jane Doe Updated",
    "email": "jane@example.com",
    "mobileNumber": "9876543210",
    "gender": "Female",
    "address": "456 Side St"
  }
}
```

**Error (400 Bad Request) - Attempting to change email:**
```json
{
  "success": false,
  "message": "Email update is not allowed."
}
```

---

## 3. Wishlist & Bookings APIs (Protected)

Requires `Authorization: Bearer <token>`

### 3.1 Get Wishlist
**Endpoint:** `GET /tenant-portal/wishlist`

**Response (200 OK):** Array of wishlist items.

### 3.2 Add to Wishlist
**Endpoint:** `POST /tenant-portal/wishlist`

**Body:**
```json
{
  "hostelId": "60d5ec..."
}
```

### 3.3 Get Bookings
**Endpoint:** `GET /bookings/me`

**Response (200 OK):** Array of booking records for the authenticated user.

### 3.4 Create Booking
**Endpoint:** `POST /bookings`

**Body:**
```json
{
  "buildingId": "60d5ec...",
  "category": "Standard",
  "moveInDate": "2024-07-01",
  "totalAmount": 5000,
  "method": "UPI",
  "guestName": "Jane Doe",
  "email": "jane@example.com",
  "phone": "9876543210"
}
```
