# 📱 Livora Hostel Hub — Flutter (Dio) API Reference

**Base URL**: `https://livora-hostel-hub.onrender.com`

> All protected routes require the `Authorization: Bearer <token>` header.  
> Unprotected (public) routes are marked 🔓.

---

## 📋 Dio Client Setup

```dart
import 'package:dio/dio.dart';

class ApiClient {
  static const String baseUrl = 'https://livora-hostel-hub.onrender.com';
  late final Dio dio;

  ApiClient() {
    dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 30),
      headers: {'Content-Type': 'application/json'},
    ));

    // Auth interceptor — injects JWT from secure storage
    dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await SecureStorage.read('token'); // your storage impl
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (DioException e, handler) {
        if (e.response?.statusCode == 401) {
          // Token expired — navigate to login
        }
        return handler.next(e);
      },
    ));
  }
}
```

---

## 🔐 Authentication

### POST `/api/auth/login` 🔓

```dart
final resp = await dio.post('/api/auth/login', data: {
  'email': 'user@example.com',
  'password': 'yourpassword',
});
// resp.data = { "token": "...", "user": { "_id": "...", "name": "...", "role": "TENANT" }, "tenantProfile": null }
final token = resp.data['token'];
final user  = resp.data['user'];
```

**Response fields:**
| Field | Type | Notes |
|-------|------|-------|
| `token` | String | JWT — store in secure storage |
| `user._id` | String | User document ID |
| `user.role` | String | `TENANT`, `OWNER`, `STAFF`, `ADMIN` |
| `tenantProfile` | Object\|null | Pre-fetched tenant profile if available |

---

### POST `/api/auth/register` 🔓

```dart
final resp = await dio.post('/api/auth/register', data: {
  'name': 'Full Name',
  'email': 'user@example.com',
  'password': 'yourpassword',
  'role': 'TENANT',        // TENANT | OWNER
  'phone': '9876543210',
});
// resp.data = { "token": "...", "user": { "_id": "...", "email": "..." } }
```

---

## 🏢 Buildings (Public — No Auth)

### GET `/api/buildings/public` 🔓
Fetch all active hostels for Explore/Search pages.

```dart
final resp = await dio.get('/api/buildings/public');
final buildings = resp.data as List<dynamic>;
// Each building: { "_id", "name", "address", "locationCity", "images": [...], 
//                  "startingPrice", "amenities": [...], "genderType", "rating" }
```

> **Image URLs:** If an image starts with `/uploads/`, prepend the base URL:
> ```dart
> String resolveImage(String img) =>
>   img.startsWith('http') || img.startsWith('data:')
>     ? img
>     : 'https://livora-hostel-hub.onrender.com$img';
> ```

---

### GET `/api/buildings/public/:id` 🔓
Fetch a single hostel detail page.

```dart
final resp = await dio.get('/api/buildings/public/$buildingId');
final hostel = resp.data; // full building object with floors/rooms/beds
```

---

### GET `/api/buildings/public/stats` 🔓
Platform-level stats for Home page hero section.

```dart
final resp = await dio.get('/api/buildings/public/stats');
// { "tenants": 120, "properties": 8, "cities": 3, "rating": "4.8/5" }
```

---

## 🏢 Buildings (Owner — Auth Required)

### GET `/api/buildings`
Get owner's buildings. Supports `?lightweight=true` to skip floors/rooms/beds population (faster).

```dart
// Lightweight (recommended for dashboards):
final resp = await dio.get('/api/buildings', queryParameters: {'lightweight': 'true'});
// Full (for property detail/edit):
final resp = await dio.get('/api/buildings');
```

---

### POST `/api/buildings` — Multipart Upload
Create a new building. Supports `multipart/form-data` for image uploads **or** JSON with base64 strings.

```dart
// Option A — multipart file upload (camera/gallery):
final formData = FormData.fromMap({
  'name': 'Sunrise PG',
  'address': '12 MG Road',
  'locationCity': 'Bengaluru',
  'genderType': 'Male',       // Male | Female | Mixed
  'startingPrice': '8000',
  'amenities': '["WiFi","AC","Meals"]', // JSON-encoded string
  'images': [
    await MultipartFile.fromFile(imagePath1, filename: 'img1.jpg',
        contentType: MediaType('image', 'jpeg')),
  ],
});
final resp = await dio.post('/api/buildings', data: formData);

// Option B — JSON with base64 images:
final resp = await dio.post('/api/buildings', data: {
  'name': 'Sunrise PG',
  'images': ['data:image/jpeg;base64,...'],
  // ...other fields
});
```

---

### PATCH `/api/buildings/:id` — Multipart Upload
Update a building (same multipart support as create).

```dart
final formData = FormData.fromMap({
  'startingPrice': '9500',
  'images': [
    await MultipartFile.fromFile(newImagePath, filename: 'new.jpg'),
  ],
});
final resp = await dio.patch('/api/buildings/$buildingId', data: formData);
```

---

## 🛌 Floors, Rooms & Beds

### GET `/api/floors/building/:buildingId`
```dart
final resp = await dio.get('/api/floors/building/$buildingId');
final floors = resp.data as List<dynamic>;
```

### GET `/api/rooms/:floorId`
```dart
final resp = await dio.get('/api/rooms/$floorId');
final rooms = resp.data as List<dynamic>;
```

### GET `/api/beds`
```dart
// All beds (owner scoped)
final resp = await dio.get('/api/beds');
// Filter by building:
final resp = await dio.get('/api/beds', queryParameters: {'buildingId': buildingId});
```

---

## 📅 Bookings

### POST `/api/bookings` — Create Booking

```dart
final resp = await dio.post('/api/bookings', data: {
  'tenantId': tenantId,           // optional — resolved from JWT if omitted
  'buildingId': buildingId,
  'category': 'Standard',         // Standard | Premium
  'moveInDate': '2026-06-01',
  'totalAmount': 15000,
  'securityDeposit': 5000,
  'onboardingFee': 999,
  'method': 'UPI',                // UPI | Cash | Bank Transfer
  'guestName': 'Ravi Kumar',
  'email': 'ravi@example.com',
  'phone': '9876543210',
});
// 400 if tenant already has an active booking
```

### GET `/api/bookings/me`
```dart
final resp = await dio.get('/api/bookings/me');
final bookings = resp.data as List<dynamic>;
```

---

## 💰 Payments

### GET `/api/payments/me`
```dart
final resp = await dio.get('/api/payments/me');
final payments = resp.data as List<dynamic>;
// Each: { "_id", "amount", "type", "status", "month", "invoice", "date" }
```

### POST `/api/payments`
```dart
final resp = await dio.post('/api/payments', data: {
  'tenantId': tenantId,
  'buildingId': buildingId,
  'amount': 9000,
  'type': 'Rent',              // Rent | Security | Maintenance | Food
  'method': 'UPI',
  'month': 'June 2026',
  'status': 'Paid',
});
// Returns 201 with created payment object
```

---

## 📣 Complaints

### POST `/api/complaints`
```dart
final resp = await dio.post('/api/complaints', data: {
  'title': 'Broken AC',
  'description': 'The AC in Room 204 has not been working for 3 days.',
  'category': 'Maintenance',    // Maintenance | Safety | Cleanliness | Other
  'priority': 'High',           // High | Medium | Low
  // optional:
  'buildingId': buildingId,
  'tenantId': tenantId,
});
```

### GET `/api/complaints/me`
```dart
final resp = await dio.get('/api/complaints/me');
```

---

## 🏘️ Tenant Portal

### GET `/api/tenant-portal/complete-profile`
Single call to get tenant profile, payment history, complaint history, rewards, etc.

```dart
final resp = await dio.get('/api/tenant-portal/complete-profile');
// {
//   "tenant": { ... },
//   "payments": [...],
//   "complaints": [...],
//   "history": { "laundry": [...], "visitors": [...], "leaves": [...] },
//   "rewards": { "points": 250 },
//   "photo": "/uploads/profile/photo_xxx.jpg"
// }
```

---

### POST `/api/tenant-portal/upload-photo` — Multipart or Base64

**Option A — Camera/Gallery (recommended for mobile):**
```dart
final formData = FormData.fromMap({
  'photo': await MultipartFile.fromFile(
    imageFile.path,
    filename: 'profile.jpg',
    contentType: MediaType('image', 'jpeg'),
  ),
});
final resp = await dio.post('/api/tenant-portal/upload-photo', data: formData);
```

**Option B — Base64 string:**
```dart
final resp = await dio.post('/api/tenant-portal/upload-photo', data: {
  'photoUrl': 'data:image/jpeg;base64,...',
});
```

Response:
```json
{ "message": "Profile photo uploaded successfully", "photo": { "_id": "...", "photoUrl": "..." } }
```

---

### POST `/api/tenant-portal/community-reports`
```dart
final resp = await dio.post('/api/tenant-portal/community-reports', data: {
  'title': 'Noisy Neighbour',
  'type': 'Noise',
  'details': 'Loud music after 11 PM repeatedly.',
  'location': 'Block B, Room 104',
});
```

### GET `/api/tenant-portal/community-reports`
```dart
final resp = await dio.get('/api/tenant-portal/community-reports');
```

### POST `/api/tenant-portal/sos-alerts`
```dart
final resp = await dio.post('/api/tenant-portal/sos-alerts', data: {
  'type': 'Emergency',
  'message': 'SOS triggered by tenant',
  'location': 'Block A, Room 201',
});
```

### GET `/api/tenant-portal/wishlist`
```dart
final resp = await dio.get('/api/tenant-portal/wishlist');
```

### POST `/api/tenant-portal/wishlist`
```dart
final resp = await dio.post('/api/tenant-portal/wishlist', data: {
  'hostelId': buildingId,
  'hostelName': 'Sunrise PG',
});
```

### GET `/api/tenant-portal/rewards/me`
```dart
final resp = await dio.get('/api/tenant-portal/rewards/me');
// { "points": 350, "lifetimeEarned": 500, "tier": "Silver" }
```

---

## 🔔 Notifications

### GET `/api/notifications`
```dart
final resp = await dio.get('/api/notifications');
final notifs = resp.data as List<dynamic>;
```

### PATCH `/api/notifications/:id/read`
```dart
await dio.patch('/api/notifications/$notifId/read');
```

### POST `/api/notifications/mark-all-read`
```dart
await dio.post('/api/notifications/mark-all-read', data: {'category': 'all'});
```

---

## 📷 Mobile Permissions (Android/iOS)

### Camera & Gallery Uploads

```dart
// pubspec.yaml dependencies:
// image_picker: ^1.0.7
// permission_handler: ^11.3.0

import 'package:image_picker/image_picker.dart';
import 'package:permission_handler/permission_handler.dart';

Future<XFile?> pickImage(ImageSource source) async {
  // Request permission
  final status = source == ImageSource.camera
      ? await Permission.camera.request()
      : await Permission.photos.request();
  if (!status.isGranted) return null;

  final picker = ImagePicker();
  return await picker.pickImage(source: source, imageQuality: 80, maxWidth: 1024);
}

// Then upload:
Future<void> uploadProfilePhoto(XFile file) async {
  final formData = FormData.fromMap({
    'photo': await MultipartFile.fromFile(file.path,
        filename: file.name,
        contentType: MediaType('image', 'jpeg')),
  });
  await dio.post('/api/tenant-portal/upload-photo', data: formData);
}
```

### Push Notifications (FCM)
The backend uses **Socket.io** for real-time events. For native push:
1. Integrate Firebase Messaging (FCM) on the Flutter side.
2. On login, send the FCM token to the backend (store on `User` model — planned).
3. Currently real-time events arrive via Socket.io — connect on login:

```dart
// socket_io_client: ^2.0.3+1
import 'package:socket_io_client/socket_io_client.dart' as IO;

IO.Socket socket = IO.io(
  'https://livora-hostel-hub.onrender.com',
  IO.OptionBuilder()
    .setTransports(['websocket'])
    .disableAutoConnect()
    .build(),
);

socket.onConnect((_) {
  socket.emit('joinBuilding', buildingId);
  socket.emit('joinTenant', tenantId);
});

socket.on('newNotification', (data) { /* show in-app banner */ });
socket.on('complaintStatusChanged', (data) { /* refresh complaints */ });
socket.on('paymentUpdated', (data) { /* refresh payments */ });

socket.connect();
```

### Location (Optional)
If location access is needed (e.g. SOS alert auto-location):

```dart
// geolocator: ^12.0.0
import 'package:geolocator/geolocator.dart';

Future<String> getCurrentLocation() async {
  bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
  if (!serviceEnabled) return 'Location disabled';

  LocationPermission permission = await Geolocator.checkPermission();
  if (permission == LocationPermission.denied) {
    permission = await Geolocator.requestPermission();
  }
  if (permission == LocationPermission.deniedForever) return 'Permission denied';

  final pos = await Geolocator.getCurrentPosition();
  return '${pos.latitude}, ${pos.longitude}';
}
```

---

## ⚡ Performance Notes

| Situation | Recommendation |
|-----------|---------------|
| Dashboard / list pages | `GET /api/buildings?lightweight=true` — skips floor/room/bed population |
| Property detail page | `GET /api/buildings/public/:id` — full nested data |
| Real-time updates | Subscribe to Socket.io events instead of polling |
| Image uploads | Use `multipart/form-data` with `image_picker` — avoid large base64 strings |
| Auth token | Store in `flutter_secure_storage`, not SharedPreferences |

---

## 🛡️ CORS & Mobile Access

The backend explicitly allows:
- `null` origin (native mobile WebView)
- `capacitor://` and `ionic://` schemes
- `file://` scheme (local HTML/JS)
- All `localhost:*` origins

No extra configuration needed for Flutter HTTP clients (`Dio`, `http` package).

---

## ❌ Error Handling

| HTTP Status | Meaning | Action |
|-------------|---------|--------|
| `400` | Validation error / duplicate booking | Show user-facing message from `error` field |
| `401` | Expired / missing JWT | Clear token, redirect to Login |
| `403` | Forbidden (wrong role/building) | Show access denied |
| `404` | Resource not found | Show not-found UI state |
| `500` | Server error | Retry or show generic error |

```dart
try {
  final resp = await dio.get('/api/payments/me');
  return resp.data;
} on DioException catch (e) {
  final msg = e.response?.data?['error'] ?? e.response?.data?['message'] ?? 'Unknown error';
  throw Exception(msg);
}
```

---

*For unreferenced endpoints, see `backend/src/routes/` in the repository.*
