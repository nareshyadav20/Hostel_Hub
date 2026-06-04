# 📱 Livora Hostel Hub — Complete Flutter API Reference

**Base URL**: `https://livora-hostel-hub-1.onrender.com`

> All protected routes require the `Authorization: Bearer <token>` header.  
> Unprotected (public) routes are marked 🔓.  
> **Role-based access:** TENANT, OWNER, STAFF, ADMIN

---

## 📋 Dio Client Setup with Interceptors

```dart
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiClient {
  static const String baseUrl = 'https://livora-hostel-hub-1.onrender.com';
  late final Dio dio;
  final _secureStorage = const FlutterSecureStorage();

  ApiClient() {
    dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 30),
      validateStatus: (status) => status! < 500, // Don't throw on 4xx
      headers: {'Content-Type': 'application/json'},
    ));

    // Auth interceptor — injects JWT from secure storage
    dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _secureStorage.read(key: 'auth_token');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (DioException e, handler) {
        if (e.response?.statusCode == 401) {
          // Token expired — clear storage and redirect to login
          _secureStorage.delete(key: 'auth_token');
          // Navigate to login screen
        }
        return handler.next(e);
      },
    ));

    // Error logging interceptor
    dio.interceptors.add(InterceptorsWrapper(
      onError: (DioException e, handler) {
        print('API Error: ${e.message}');
        if (e.response != null) {
          print('Status: ${e.response?.statusCode}');
          print('Data: ${e.response?.data}');
        }
        return handler.next(e);
      },
    ));
  }

  // Helper method for secure token storage
  Future<void> saveToken(String token) async {
    await _secureStorage.write(key: 'auth_token', value: token);
  }

  Future<String?> getToken() async {
    return await _secureStorage.read(key: 'auth_token');
  }

  Future<void> clearToken() async {
    await _secureStorage.delete(key: 'auth_token');
  }
}
```

---

## 🔐 Authentication APIs

### POST `/api/auth/login` 🔓
User login (Tenant, Owner, Staff, Admin).

```dart
Future<AuthResponse> login(String email, String password) async {
  try {
    final resp = await dio.post('/api/auth/login', data: {
      'email': email.trim(),
      'password': password,
    });

    if (resp.statusCode == 200) {
      final token = resp.data['token'] as String;
      final user = resp.data['user'] as Map;
      
      // Save token securely
      await apiClient.saveToken(token);
      
      return AuthResponse(
        token: token,
        userId: user['_id'],
        role: UserRole.values.firstWhere((e) => e.name == user['role']),
        name: user['name'],
        email: user['email'],
        phone: user['phone'],
      );
    } else {
      throw Exception(resp.data['error'] ?? 'Login failed');
    }
  } on DioException catch (e) {
    throw Exception(e.response?.data['error'] ?? 'Network error');
  }
}

// Response structure:
// {
//   "token": "eyJhbGciOiJIUzI1NiIs...",
//   "user": {
//     "_id": "user_id_123",
//     "name": "John Doe",
//     "email": "john@example.com",
//     "phone": "9876543210",
//     "role": "TENANT",  // TENANT | OWNER | STAFF | ADMIN
//     "verified": true,
//     "createdAt": "2026-01-15T10:30:00Z"
//   },
//   "tenantProfile": {
//     "_id": "profile_123",
//     "userId": "user_id_123",
//     "firstName": "John",
//     "lastName": "Doe",
//     "buildingId": "building_456"
//   } // null if user is OWNER/ADMIN
// }
```

**Error responses:**
- `400`: Invalid email/password
- `401`: User not verified
- `500`: Server error

---

### POST `/api/auth/register` 🔓
Register new Tenant or Owner account.

```dart
Future<AuthResponse> register({
  required String name,
  required String email,
  required String password,
  required String phone,
  required UserRole role, // TENANT or OWNER
}) async {
  try {
    final resp = await dio.post('/api/auth/register', data: {
      'name': name.trim(),
      'email': email.trim(),
      'password': password,
      'phone': phone.trim(),
      'role': role.name,
    });

    if (resp.statusCode == 201) {
      final token = resp.data['token'];
      await apiClient.saveToken(token);
      
      return AuthResponse(
        token: token,
        userId: resp.data['user']['_id'],
        role: role,
        name: name,
        email: email,
      );
    } else {
      throw Exception(resp.data['error'] ?? 'Registration failed');
    }
  } on DioException catch (e) {
    throw Exception(e.response?.data['error'] ?? 'Network error');
  }
}

// Response: Same as login response
```

---

### POST `/api/auth/logout` 
Logout and invalidate token.

```dart
Future<void> logout() async {
  await dio.post('/api/auth/logout');
  await apiClient.clearToken();
}
```

---

### POST `/api/auth/refresh` 🔓
Refresh expired JWT token.

```dart
Future<String> refreshToken() async {
  final resp = await dio.post('/api/auth/refresh');
  if (resp.statusCode == 200) {
    final newToken = resp.data['token'];
    await apiClient.saveToken(newToken);
    return newToken;
  }
  throw Exception('Token refresh failed');
}
```

---

### POST `/api/auth/forgot-password` 🔓
Request password reset via email.

```dart
Future<void> requestPasswordReset(String email) async {
  final resp = await dio.post('/api/auth/forgot-password', data: {
    'email': email.trim(),
  });
  
  if (resp.statusCode != 200) {
    throw Exception(resp.data['error'] ?? 'Password reset request failed');
  }
}
```

---

### POST `/api/auth/reset-password` 🔓
Reset password using token from email.

```dart
Future<void> resetPassword(String token, String newPassword) async {
  final resp = await dio.post('/api/auth/reset-password', data: {
    'token': token,
    'password': newPassword,
  });
  
  if (resp.statusCode != 200) {
    throw Exception(resp.data['error'] ?? 'Password reset failed');
  }
}
```

---

### GET `/api/auth/me`
Get current logged-in user details.

```dart
Future<User> getCurrentUser() async {
  final resp = await dio.get('/api/auth/me');
  
  if (resp.statusCode == 200) {
    return User.fromJson(resp.data['user']);
  }
  throw Exception('Failed to fetch user');
}

---

## 🏢 Buildings - Public APIs (No Auth Required)

### GET `/api/buildings/public` 🔓
Fetch all active hostels for Explore/Search pages with pagination.

```dart
Future<List<Building>> getPublicBuildings({
  int page = 1,
  int limit = 20,
  String? city,
  String? genderType,
  double? minPrice,
  double? maxPrice,
}) async {
  final resp = await dio.get(
    '/api/buildings/public',
    queryParameters: {
      'page': page,
      'limit': limit,
      if (city != null) 'city': city,
      if (genderType != null) 'genderType': genderType,
      if (minPrice != null) 'minPrice': minPrice,
      if (maxPrice != null) 'maxPrice': maxPrice,
    },
  );

  if (resp.statusCode == 200) {
    return (resp.data['buildings'] as List)
        .map((b) => Building.fromJson(b))
        .toList();
  }
  throw Exception('Failed to fetch buildings');
}

// Response structure:
// {
//   "buildings": [
//     {
//       "_id": "building_123",
//       "name": "Sunrise PG",
//       "address": "12 MG Road",
//       "locationCity": "Bengaluru",
//       "images": ["/uploads/building/img1.jpg"],
//       "startingPrice": 8000,
//       "amenities": ["WiFi", "AC", "Meals"],
//       "genderType": "Male",
//       "rating": 4.8,
//       "occupancy": "85%",
//       "floorsCount": 5,
//       "totalBeds": 120
//     }
//   ],
//   "pagination": {
//     "page": 1,
//     "limit": 20,
//     "total": 45,
//     "pages": 3
//   }
// }
```

---

### GET `/api/buildings/public/:id` 🔓
Fetch single hostel detail page with all floors, rooms, and beds.

```dart
Future<BuildingDetail> getPublicBuildingDetail(String buildingId) async {
  final resp = await dio.get('/api/buildings/public/$buildingId');
  
  if (resp.statusCode == 200) {
    return BuildingDetail.fromJson(resp.data);
  }
  throw Exception('Building not found');
}

// Response structure:
// {
//   "_id": "building_123",
//   "name": "Sunrise PG",
//   "address": "12 MG Road, Indiranagar",
//   "locationCity": "Bengaluru",
//   "description": "Premium PG with all amenities",
//   "images": ["/uploads/building/img1.jpg", ...],
//   "startingPrice": 8000,
//   "amenities": ["WiFi", "AC", "Meals", "Laundry"],
//   "genderType": "Male",
//   "rating": 4.8,
//   "reviews": 45,
//   "owner": {
//     "_id": "owner_id",
//     "name": "Raj Kumar",
//     "phone": "9876543210"
//   },
//   "floors": [
//     {
//       "_id": "floor_1",
//       "floorName": "Ground Floor",
//       "rooms": [
//         {
//           "_id": "room_101",
//           "roomName": "101",
//           "category": "Standard",
//           "price": 8000,
//           "beds": [
//             {
//               "_id": "bed_1",
//               "bedName": "101-A",
//               "status": "available"  // available | occupied | maintenance
//             }
//           ]
//         }
//       ]
//     }
//   ]
// }
```

---

### GET `/api/buildings/public/stats` 🔓
Platform-wide statistics for home page hero section.

```dart
Future<PlatformStats> getPlatformStats() async {
  final resp = await dio.get('/api/buildings/public/stats');
  
  if (resp.statusCode == 200) {
    return PlatformStats(
      tenants: resp.data['tenants'],
      properties: resp.data['properties'],
      cities: resp.data['cities'],
      avgRating: resp.data['avgRating'],
    );
  }
  throw Exception('Failed to fetch stats');
}

// Response: { "tenants": 1250, "properties": 45, "cities": 8, "avgRating": "4.6/5" }
```

---

## 🏢 Buildings - Owner Only APIs

### GET `/api/buildings`
Get all buildings owned by current user.

```dart
Future<List<Building>> getMyBuildings({bool lightweight = false}) async {
  final resp = await dio.get(
    '/api/buildings',
    queryParameters: {'lightweight': lightweight},
  );

  if (resp.statusCode == 200) {
    return (resp.data as List)
        .map((b) => Building.fromJson(b))
        .toList();
  }
  throw Exception('Failed to fetch buildings');
}

// lightweight=true: Returns only building info (faster for dashboards)
// lightweight=false: Includes all floors, rooms, and beds (for editing)
```

---

### POST `/api/buildings`
Create new building with image uploads.

```dart
Future<Building> createBuilding({
  required String name,
  required String address,
  required String locationCity,
  required String genderType,
  required double startingPrice,
  required List<String> amenities,
  required List<XFile> images,
  String? description,
}) async {
  // Convert images to multipart files
  List<MultipartFile> multipartImages = [];
  for (var img in images) {
    multipartImages.add(
      await MultipartFile.fromFile(
        img.path,
        filename: img.name,
        contentType: MediaType('image', 'jpeg'),
      ),
    );
  }

  final formData = FormData.fromMap({
    'name': name,
    'address': address,
    'locationCity': locationCity,
    'genderType': genderType, // Male | Female | Mixed
    'startingPrice': startingPrice,
    'amenities': jsonEncode(amenities),
    'description': description ?? '',
    'images': multipartImages,
  });

  final resp = await dio.post('/api/buildings', data: formData);

  if (resp.statusCode == 201) {
    return Building.fromJson(resp.data);
  }
  throw Exception(resp.data['error'] ?? 'Failed to create building');
}
```

---

### PATCH `/api/buildings/:id`
Update building details and images.

```dart
Future<Building> updateBuilding(
  String buildingId, {
  String? name,
  String? address,
  double? startingPrice,
  List<XFile>? newImages,
  List<String>? removeImageIds,
}) async {
  Map<String, dynamic> data = {
    if (name != null) 'name': name,
    if (address != null) 'address': address,
    if (startingPrice != null) 'startingPrice': startingPrice,
  };

  if (newImages != null && newImages.isNotEmpty) {
    List<MultipartFile> multipartImages = [];
    for (var img in newImages) {
      multipartImages.add(
        await MultipartFile.fromFile(
          img.path,
          filename: img.name,
          contentType: MediaType('image', 'jpeg'),
        ),
      );
    }
    data['images'] = multipartImages;
  }

  if (removeImageIds != null) {
    data['removeImageIds'] = jsonEncode(removeImageIds);
  }

  final formData = FormData.fromMap(data);
  final resp = await dio.patch('/api/buildings/$buildingId', data: formData);

  if (resp.statusCode == 200) {
    return Building.fromJson(resp.data);
  }
  throw Exception(resp.data['error'] ?? 'Failed to update building');
}
```

---

### DELETE `/api/buildings/:id`
Delete a building (only if no active bookings).

```dart
Future<void> deleteBuilding(String buildingId) async {
  final resp = await dio.delete('/api/buildings/$buildingId');

  if (resp.statusCode != 200) {
    throw Exception(
      resp.data['error'] ?? 'Cannot delete building with active bookings',
    );
  }
}
```

---

## 🏗️ Floors, Rooms & Beds - Owner Management APIs

### GET `/api/floors/building/:buildingId`
Get all floors in a building.

```dart
Future<List<Floor>> getFloors(String buildingId) async {
  final resp = await dio.get('/api/floors/building/$buildingId');

  if (resp.statusCode == 200) {
    return (resp.data as List)
        .map((f) => Floor.fromJson(f))
        .toList();
  }
  throw Exception('Failed to fetch floors');
}

// Response: [{ "_id", "floorName", "buildingId", "roomsCount", "totalBeds" }]
```

---

### POST `/api/floors`
Create new floor in a building.

```dart
Future<Floor> createFloor(String buildingId, String floorName) async {
  final resp = await dio.post('/api/floors', data: {
    'buildingId': buildingId,
    'floorName': floorName,
  });

  if (resp.statusCode == 201) {
    return Floor.fromJson(resp.data);
  }
  throw Exception('Failed to create floor');
}
```

---

### PATCH `/api/floors/:id`
Update floor details.

```dart
Future<Floor> updateFloor(String floorId, String floorName) async {
  final resp = await dio.patch('/api/floors/$floorId', data: {
    'floorName': floorName,
  });

  if (resp.statusCode == 200) {
    return Floor.fromJson(resp.data);
  }
  throw Exception('Failed to update floor');
}
```

---

### DELETE `/api/floors/:id`
Delete floor (only if no rooms).

```dart
Future<void> deleteFloor(String floorId) async {
  final resp = await dio.delete('/api/floors/$floorId');

  if (resp.statusCode != 200) {
    throw Exception(resp.data['error'] ?? 'Cannot delete floor');
  }
}
```

---

## 🚪 Rooms Management

### GET `/api/rooms/floor/:floorId`
Get all rooms in a floor.

```dart
Future<List<Room>> getRooms(String floorId) async {
  final resp = await dio.get('/api/rooms/floor/$floorId');

  if (resp.statusCode == 200) {
    return (resp.data as List)
        .map((r) => Room.fromJson(r))
        .toList();
  }
  throw Exception('Failed to fetch rooms');
}

// Response: [
//   {
//     "_id": "room_101",
//     "roomName": "101",
//     "category": "Standard",  // Standard | Premium | Deluxe
//     "price": 8000,
//     "capacity": 2,
//     "bedsCount": 2,
//     "occupancy": 1,
//     "description": "Double room with AC",
//     "images": ["/uploads/room/img.jpg"]
//   }
// ]
```

---

### POST `/api/rooms`
Create new room.

```dart
Future<Room> createRoom({
  required String floorId,
  required String roomName,
  required String category,
  required double price,
  required int capacity,
  String? description,
  List<XFile>? images,
}) async {
  Map<String, dynamic> data = {
    'floorId': floorId,
    'roomName': roomName,
    'category': category, // Standard | Premium | Deluxe
    'price': price,
    'capacity': capacity,
    'description': description ?? '',
  };

  if (images != null && images.isNotEmpty) {
    List<MultipartFile> multipartImages = [];
    for (var img in images) {
      multipartImages.add(
        await MultipartFile.fromFile(
          img.path,
          filename: img.name,
          contentType: MediaType('image', 'jpeg'),
        ),
      );
    }
    data['images'] = multipartImages;
  }

  final formData = FormData.fromMap(data);
  final resp = await dio.post('/api/rooms', data: formData);

  if (resp.statusCode == 201) {
    return Room.fromJson(resp.data);
  }
  throw Exception('Failed to create room');
}
```

---

### PATCH `/api/rooms/:id`
Update room details.

```dart
Future<Room> updateRoom(
  String roomId, {
  String? roomName,
  double? price,
  String? description,
  List<XFile>? newImages,
}) async {
  Map<String, dynamic> data = {
    if (roomName != null) 'roomName': roomName,
    if (price != null) 'price': price,
    if (description != null) 'description': description,
  };

  if (newImages != null && newImages.isNotEmpty) {
    List<MultipartFile> multipartImages = [];
    for (var img in newImages) {
      multipartImages.add(
        await MultipartFile.fromFile(
          img.path,
          filename: img.name,
          contentType: MediaType('image', 'jpeg'),
        ),
      );
    }
    data['images'] = multipartImages;
  }

  final formData = FormData.fromMap(data);
  final resp = await dio.patch('/api/rooms/$roomId', data: formData);

  if (resp.statusCode == 200) {
    return Room.fromJson(resp.data);
  }
  throw Exception('Failed to update room');
}
```

---

## 🛏️ Beds Management

### GET `/api/beds`
Get all beds (owner scoped).

```dart
Future<List<Bed>> getMyBeds({String? buildingId}) async {
  final resp = await dio.get(
    '/api/beds',
    queryParameters: if (buildingId != null) {'buildingId': buildingId},
  );

  if (resp.statusCode == 200) {
    return (resp.data as List)
        .map((b) => Bed.fromJson(b))
        .toList();
  }
  throw Exception('Failed to fetch beds');
}

// Response: [
//   {
//     "_id": "bed_1",
//     "bedName": "101-A",
//     "roomId": "room_101",
//     "floorId": "floor_1",
//     "buildingId": "building_123",
//     "status": "available",  // available | occupied | maintenance
//     "tenantId": null,
//     "lastCleaned": "2026-06-01T10:00:00Z"
//   }
// ]
```

---

### POST `/api/beds`
Create new bed in a room.

```dart
Future<Bed> createBed(String roomId, String bedName) async {
  final resp = await dio.post('/api/beds', data: {
    'roomId': roomId,
    'bedName': bedName,
  });

  if (resp.statusCode == 201) {
    return Bed.fromJson(resp.data);
  }
  throw Exception('Failed to create bed');
}
```

---

### PATCH `/api/beds/:id`
Update bed status.

```dart
Future<Bed> updateBedStatus(String bedId, String status) async {
  final resp = await dio.patch('/api/beds/$bedId', data: {
    'status': status, // available | occupied | maintenance
  });

  if (resp.statusCode == 200) {
    return Bed.fromJson(resp.data);
  }
  throw Exception('Failed to update bed');
}
```

---

### DELETE `/api/beds/:id`
Delete a bed.

```dart
Future<void> deleteBed(String bedId) async {
  final resp = await dio.delete('/api/beds/$bedId');

  if (resp.statusCode != 200) {
    throw Exception(resp.data['error'] ?? 'Cannot delete bed');
  }
}
```

---

## 📅 Bookings - Tenant APIs

### POST `/api/bookings`
Create new booking for a hostel.

```dart
Future<Booking> createBooking({
  required String buildingId,
  required String bedId,
  required String category,
  required DateTime moveInDate,
  required double totalAmount,
  required double securityDeposit,
  required String paymentMethod,
  required String guestName,
  required String email,
  required String phone,
  String? specialRequests,
}) async {
  try {
    final resp = await dio.post('/api/bookings', data: {
      'buildingId': buildingId,
      'bedId': bedId,
      'category': category,
      'moveInDate': moveInDate.toIso8601String(),
      'totalAmount': totalAmount,
      'securityDeposit': securityDeposit,
      'paymentMethod': paymentMethod, // UPI | Cash | Bank Transfer | Card
      'guestName': guestName,
      'email': email,
      'phone': phone,
      'specialRequests': specialRequests ?? '',
    });

    if (resp.statusCode == 201) {
      return Booking.fromJson(resp.data);
    } else if (resp.statusCode == 400) {
      throw Exception(resp.data['error'] ?? 'Booking failed');
    }
    throw Exception('Failed to create booking');
  } on DioException catch (e) {
    throw Exception(e.response?.data['error'] ?? 'Network error');
  }
}

// Response:
// {
//   "_id": "booking_123",
//   "tenantId": "tenant_id",
//   "buildingId": "building_123",
//   "bedId": "bed_1",
//   "roomName": "101",
//   "buildingName": "Sunrise PG",
//   "category": "Standard",
//   "moveInDate": "2026-06-15T00:00:00Z",
//   "moveOutDate": null,
//   "totalAmount": 15000,
//   "securityDeposit": 5000,
//   "paymentMethod": "UPI",
//   "status": "pending",  // pending | confirmed | checked-in | checked-out | cancelled
//   "createdAt": "2026-06-01T10:00:00Z",
//   "updatedAt": "2026-06-01T10:00:00Z"
// }
```

**Error scenarios:**
- `400`: Tenant already has active booking, bed not available, validation errors
- `401`: Unauthorized
- `404`: Building or bed not found

---

### GET `/api/bookings/me`
Get all bookings of current tenant.

```dart
Future<List<Booking>> getMyBookings({String? status}) async {
  final resp = await dio.get(
    '/api/bookings/me',
    queryParameters: if (status != null) {'status': status},
  );

  if (resp.statusCode == 200) {
    return (resp.data as List)
        .map((b) => Booking.fromJson(b))
        .toList();
  }
  throw Exception('Failed to fetch bookings');
}

// Filter by status: pending | confirmed | checked-in | checked-out | cancelled
```

---

### GET `/api/bookings/me/:bookingId`
Get booking details.

```dart
Future<BookingDetail> getBookingDetail(String bookingId) async {
  final resp = await dio.get('/api/bookings/me/$bookingId');

  if (resp.statusCode == 200) {
    return BookingDetail.fromJson(resp.data);
  }
  throw Exception('Booking not found');
}
```

---

### PATCH `/api/bookings/:id/cancel`
Cancel active booking.

```dart
Future<void> cancelBooking(String bookingId, String reason) async {
  final resp = await dio.patch('/api/bookings/$bookingId/cancel', data: {
    'cancellationReason': reason,
  });

  if (resp.statusCode != 200) {
    throw Exception(resp.data['error'] ?? 'Cannot cancel booking');
  }
}
```

---

## 📅 Bookings - Owner APIs

### GET `/api/bookings/my-property`
Get all bookings for owner's properties.

```dart
Future<List<Booking>> getPropertyBookings({
  String? buildingId,
  String? status,
  DateTime? fromDate,
  DateTime? toDate,
}) async {
  final resp = await dio.get(
    '/api/bookings/my-property',
    queryParameters: {
      if (buildingId != null) 'buildingId': buildingId,
      if (status != null) 'status': status,
      if (fromDate != null) 'fromDate': fromDate.toIso8601String(),
      if (toDate != null) 'toDate': toDate.toIso8601String(),
    },
  );

  if (resp.statusCode == 200) {
    return (resp.data as List)
        .map((b) => Booking.fromJson(b))
        .toList();
  }
  throw Exception('Failed to fetch bookings');
}
```

---

### PATCH `/api/bookings/:id/status`
Update booking status (Owner only).

```dart
Future<Booking> updateBookingStatus(
  String bookingId,
  String newStatus,
) async {
  final resp = await dio.patch('/api/bookings/$bookingId/status', data: {
    'status': newStatus, // confirmed | checked-in | checked-out | cancelled
  });

  if (resp.statusCode == 200) {
    return Booking.fromJson(resp.data);
  }
  throw Exception('Failed to update booking');
}
```

---

## 💰 Payments - Tenant APIs

### GET `/api/payments/me`
Get all payments of current tenant.

```dart
Future<List<Payment>> getMyPayments({String? type, String? status}) async {
  final resp = await dio.get(
    '/api/payments/me',
    queryParameters: {
      if (type != null) 'type': type,
      if (status != null) 'status': status,
    },
  );

  if (resp.statusCode == 200) {
    return (resp.data as List)
        .map((p) => Payment.fromJson(p))
        .toList();
  }
  throw Exception('Failed to fetch payments');
}

// Response:
// [
//   {
//     "_id": "payment_1",
//     "tenantId": "tenant_id",
//     "buildingId": "building_123",
//     "bookingId": "booking_123",
//     "amount": 9000,
//     "type": "Rent",  // Rent | Security | Maintenance | Food | Others
//     "status": "Paid", // Paid | Pending | Failed | Refunded
//     "method": "UPI",
//     "month": "June 2026",
//     "invoice": "INV-2026-001",
//     "date": "2026-06-01T10:00:00Z",
//     "paidOn": "2026-06-01T10:30:00Z"
//   }
// ]
```

---

### POST `/api/payments`
Record new payment.

```dart
Future<Payment> recordPayment({
  required String buildingId,
  required double amount,
  required String type,
  required String paymentMethod,
  required String month,
  String? invoiceNumber,
}) async {
  final resp = await dio.post('/api/payments', data: {
    'buildingId': buildingId,
    'amount': amount,
    'type': type, // Rent | Security | Maintenance | Food | Others
    'method': paymentMethod, // UPI | Cash | Card | Bank Transfer
    'month': month,
    'invoice': invoiceNumber,
    'status': 'Paid',
  });

  if (resp.statusCode == 201) {
    return Payment.fromJson(resp.data);
  }
  throw Exception('Failed to record payment');
}
```

---

### GET `/api/payments/:paymentId/invoice`
Download payment invoice.

```dart
Future<String> getInvoiceUrl(String paymentId) async {
  final resp = await dio.get('/api/payments/$paymentId/invoice');

  if (resp.statusCode == 200) {
    return resp.data['invoiceUrl'];
  }
  throw Exception('Failed to fetch invoice');
}
```

---

## 💰 Payments - Owner APIs

### GET `/api/payments/my-property`
Get all payments from owner's properties.

```dart
Future<List<Payment>> getPropertyPayments({
  String? buildingId,
  DateTime? fromDate,
  DateTime? toDate,
}) async {
  final resp = await dio.get(
    '/api/payments/my-property',
    queryParameters: {
      if (buildingId != null) 'buildingId': buildingId,
      if (fromDate != null) 'fromDate': fromDate.toIso8601String(),
      if (toDate != null) 'toDate': toDate.toIso8601String(),
    },
  );

  if (resp.statusCode == 200) {
    return (resp.data as List)
        .map((p) => Payment.fromJson(p))
        .toList();
  }
  throw Exception('Failed to fetch payments');
}
```

---

### GET `/api/payments/my-property/stats`
Get payment statistics for dashboard.

```dart
Future<PaymentStats> getPaymentStats({String? buildingId}) async {
  final resp = await dio.get(
    '/api/payments/my-property/stats',
    queryParameters: if (buildingId != null) {'buildingId': buildingId},
  );

  if (resp.statusCode == 200) {
    return PaymentStats(
      totalReceived: resp.data['totalReceived'],
      pendingPayments: resp.data['pendingPayments'],
      monthlyRevenue: resp.data['monthlyRevenue'],
      averageOccupancy: resp.data['averageOccupancy'],
    );
  }
  throw Exception('Failed to fetch stats');
}
```

---

## 📣 Complaints & Issues - Tenant APIs

### POST `/api/complaints`
Create maintenance or safety complaint.

```dart
Future<Complaint> createComplaint({
  required String title,
  required String description,
  required String category,
  required String priority,
  String? buildingId,
  List<XFile>? attachments,
}) async {
  Map<String, dynamic> data = {
    'title': title,
    'description': description,
    'category': category, // Maintenance | Safety | Cleanliness | Other
    'priority': priority, // High | Medium | Low
    if (buildingId != null) 'buildingId': buildingId,
  };

  if (attachments != null && attachments.isNotEmpty) {
    List<MultipartFile> files = [];
    for (var file in attachments) {
      files.add(
        await MultipartFile.fromFile(
          file.path,
          filename: file.name,
        ),
      );
    }
    data['attachments'] = files;
  }

  final formData = FormData.fromMap(data);
  final resp = await dio.post('/api/complaints', data: formData);

  if (resp.statusCode == 201) {
    return Complaint.fromJson(resp.data);
  }
  throw Exception('Failed to create complaint');
}

// Response:
// {
//   "_id": "complaint_123",
//   "tenantId": "tenant_id",
//   "buildingId": "building_123",
//   "title": "Broken AC",
//   "description": "The AC in Room 204 has not been working for 3 days.",
//   "category": "Maintenance",
//   "priority": "High",
//   "status": "open",  // open | in-progress | resolved | closed
//   "attachments": ["/uploads/complaints/img.jpg"],
//   "createdAt": "2026-06-01T10:00:00Z",
//   "resolvedAt": null
// }
```

---

### GET `/api/complaints/me`
Get all complaints of current tenant.

```dart
Future<List<Complaint>> getMyComplaints({String? status}) async {
  final resp = await dio.get(
    '/api/complaints/me',
    queryParameters: if (status != null) {'status': status},
  );

  if (resp.statusCode == 200) {
    return (resp.data as List)
        .map((c) => Complaint.fromJson(c))
        .toList();
  }
  throw Exception('Failed to fetch complaints');
}

// Filter by status: open | in-progress | resolved | closed
```

---

### GET `/api/complaints/:complaintId`
Get complaint details.

```dart
Future<ComplaintDetail> getComplaintDetail(String complaintId) async {
  final resp = await dio.get('/api/complaints/$complaintId');

  if (resp.statusCode == 200) {
    return ComplaintDetail.fromJson(resp.data);
  }
  throw Exception('Complaint not found');
}
```

---

### POST `/api/complaints/:id/comments`
Add comment to complaint.

```dart
Future<void> addComplaintComment(String complaintId, String comment) async {
  final resp = await dio.post(
    '/api/complaints/$complaintId/comments',
    data: {'comment': comment},
  );

  if (resp.statusCode != 201) {
    throw Exception('Failed to add comment');
  }
}
```

---

## 📣 Complaints - Owner APIs

### GET `/api/complaints/my-property`
Get all complaints for owner's properties.

```dart
Future<List<Complaint>> getPropertyComplaints({
  String? buildingId,
  String? status,
}) async {
  final resp = await dio.get(
    '/api/complaints/my-property',
    queryParameters: {
      if (buildingId != null) 'buildingId': buildingId,
      if (status != null) 'status': status,
    },
  );

  if (resp.statusCode == 200) {
    return (resp.data as List)
        .map((c) => Complaint.fromJson(c))
        .toList();
  }
  throw Exception('Failed to fetch complaints');
}
```

---

### PATCH `/api/complaints/:id/status`
Update complaint status (Owner/Staff).

```dart
Future<Complaint> updateComplaintStatus(
  String complaintId,
  String status,
) async {
  final resp = await dio.patch(
    '/api/complaints/$complaintId/status',
    data: {'status': status}, // in-progress | resolved | closed
  );

  if (resp.statusCode == 200) {
    return Complaint.fromJson(resp.data);
  }
  throw Exception('Failed to update complaint');
}
```

---

## 📱 Tenant Portal - Comprehensive Profile APIs

### GET `/api/tenant-portal/complete-profile`
Single call to fetch all tenant profile data (optimized).

```dart
Future<TenantDashboard> getCompleteTenantProfile() async {
  final resp = await dio.get('/api/tenant-portal/complete-profile');

  if (resp.statusCode == 200) {
    return TenantDashboard.fromJson(resp.data);
  }
  throw Exception('Failed to fetch profile');
}

// Response:
// {
//   "tenant": {
//     "_id": "tenant_id",
//     "userId": "user_id",
//     "firstName": "John",
//     "lastName": "Doe",
//     "email": "john@example.com",
//     "phone": "9876543210",
//     "photo": "/uploads/profile/photo_xxx.jpg",
//     "building": { "_id", "name", "address" },
//     "roomName": "204",
//     "bedName": "204-A",
//     "moveInDate": "2026-01-15T00:00:00Z",
//     "emergencyContact": "Name",
//     "emergencyPhone": "9123456789"
//   },
//   "payments": [
//     {
//       "_id": "payment_1",
//       "amount": 9000,
//       "type": "Rent",
//       "status": "Paid",
//       "date": "2026-06-01T00:00:00Z",
//       "month": "June 2026"
//     }
//   ],
//   "complaints": [
//     {
//       "_id": "complaint_1",
//       "title": "Broken AC",
//       "status": "in-progress",
//       "priority": "High",
//       "createdAt": "2026-06-01T10:00:00Z"
//     }
//   ],
//   "history": {
//     "laundry": [{ "date", "items", "status" }],
//     "visitors": [{ "visitorName", "visitDate", "duration" }],
//     "leaves": [{ "fromDate", "toDate", "status" }]
//   },
//   "rewards": {
//     "points": 350,
//     "lifetimeEarned": 500,
//     "tier": "Silver" // Silver | Gold | Platinum
//   },
//   "stats": {
//     "daysRemaining": 240,
//     "occupancyRate": "95%",
//     "averageRating": 4.5
//   }
// }
```

---

### POST `/api/tenant-portal/upload-photo` — Multipart or Base64
Upload or update profile photo.

```dart
Future<String> uploadProfilePhoto(XFile imageFile) async {
  try {
    // Option A: Multipart (recommended for mobile)
    final formData = FormData.fromMap({
      'photo': await MultipartFile.fromFile(
        imageFile.path,
        filename: 'profile.jpg',
        contentType: MediaType('image', 'jpeg'),
      ),
    });

    final resp = await dio.post('/api/tenant-portal/upload-photo', data: formData);

    if (resp.statusCode == 200) {
      return resp.data['photo']['photoUrl'];
    }
    throw Exception('Photo upload failed');
  } on DioException catch (e) {
    throw Exception(e.response?.data['error'] ?? 'Upload error');
  }
}

// For base64 fallback:
// final resp = await dio.post('/api/tenant-portal/upload-photo', data: {
//   'photoUrl': 'data:image/jpeg;base64,...',
// });
```

---

### PATCH `/api/tenant-portal/update-profile`
Update profile information.

```dart
Future<void> updateTenantProfile({
  String? firstName,
  String? lastName,
  String? phone,
  String? emergencyContact,
  String? emergencyPhone,
}) async {
  final resp = await dio.patch(
    '/api/tenant-portal/update-profile',
    data: {
      if (firstName != null) 'firstName': firstName,
      if (lastName != null) 'lastName': lastName,
      if (phone != null) 'phone': phone,
      if (emergencyContact != null) 'emergencyContact': emergencyContact,
      if (emergencyPhone != null) 'emergencyPhone': emergencyPhone,
    },
  );

  if (resp.statusCode != 200) {
    throw Exception(resp.data['error'] ?? 'Update failed');
  }
}
```

---

### POST `/api/tenant-portal/community-reports`
Report community issues (noise, safety, etc.).

```dart
Future<CommunityReport> createCommunityReport({
  required String title,
  required String type,
  required String details,
  String? location,
  List<XFile>? attachments,
}) async {
  Map<String, dynamic> data = {
    'title': title,
    'type': type, // Noise | Safety | Cleanliness | Behavior | Other
    'details': details,
    'location': location ?? '',
  };

  if (attachments != null && attachments.isNotEmpty) {
    List<MultipartFile> files = [];
    for (var file in attachments) {
      files.add(await MultipartFile.fromFile(file.path, filename: file.name));
    }
    data['attachments'] = files;
  }

  final formData = FormData.fromMap(data);
  final resp = await dio.post('/api/tenant-portal/community-reports', data: formData);

  if (resp.statusCode == 201) {
    return CommunityReport.fromJson(resp.data);
  }
  throw Exception('Failed to create report');
}
```

---

### GET `/api/tenant-portal/community-reports`
Get all community reports (anonymous).

```dart
Future<List<CommunityReport>> getCommunityReports() async {
  final resp = await dio.get('/api/tenant-portal/community-reports');

  if (resp.statusCode == 200) {
    return (resp.data as List)
        .map((r) => CommunityReport.fromJson(r))
        .toList();
  }
  throw Exception('Failed to fetch reports');
}
```

---

### POST `/api/tenant-portal/sos-alerts`
Trigger emergency SOS alert.

```dart
Future<void> triggerSOS({
  required String type,
  required String message,
  String? location,
  String? latitude,
  String? longitude,
}) async {
  final resp = await dio.post(
    '/api/tenant-portal/sos-alerts',
    data: {
      'type': type, // Emergency | Medical | Safety | Other
      'message': message,
      'location': location,
      'latitude': latitude,
      'longitude': longitude,
    },
  );

  if (resp.statusCode != 201) {
    throw Exception('Failed to trigger SOS');
  }
}
```

---

### GET `/api/tenant-portal/wishlist`
Get wishlist of saved properties.

```dart
Future<List<Wishlist>> getWishlist() async {
  final resp = await dio.get('/api/tenant-portal/wishlist');

  if (resp.statusCode == 200) {
    return (resp.data as List)
        .map((w) => Wishlist.fromJson(w))
        .toList();
  }
  throw Exception('Failed to fetch wishlist');
}
```

---

### POST `/api/tenant-portal/wishlist`
Add property to wishlist.

```dart
Future<void> addToWishlist(String buildingId, String buildingName) async {
  final resp = await dio.post(
    '/api/tenant-portal/wishlist',
    data: {
      'buildingId': buildingId,
      'buildingName': buildingName,
    },
  );

  if (resp.statusCode != 201) {
    throw Exception('Failed to add to wishlist');
  }
}
```

---

### DELETE `/api/tenant-portal/wishlist/:buildingId`
Remove property from wishlist.

```dart
Future<void> removeFromWishlist(String buildingId) async {
  final resp = await dio.delete('/api/tenant-portal/wishlist/$buildingId');

  if (resp.statusCode != 200) {
    throw Exception('Failed to remove from wishlist');
  }
}
```

---

### GET `/api/tenant-portal/rewards/me`
Get current rewards points and tier.

```dart
Future<RewardInfo> getRewardsInfo() async {
  final resp = await dio.get('/api/tenant-portal/rewards/me');

  if (resp.statusCode == 200) {
    return RewardInfo(
      points: resp.data['points'],
      lifetimeEarned: resp.data['lifetimeEarned'],
      tier: resp.data['tier'], // Silver | Gold | Platinum
      nextTierPoints: resp.data['nextTierPoints'],
    );
  }
  throw Exception('Failed to fetch rewards');
}
```

---

### POST `/api/tenant-portal/guest-passes`
Request guest pass for visitor.

```dart
Future<GuestPass> requestGuestPass({
  required String visitorName,
  required String visitorPhone,
  required DateTime visitDate,
  required String purpose,
  int? durationHours,
}) async {
  final resp = await dio.post(
    '/api/tenant-portal/guest-passes',
    data: {
      'visitorName': visitorName,
      'visitorPhone': visitorPhone,
      'visitDate': visitDate.toIso8601String(),
      'purpose': purpose,
      'durationHours': durationHours ?? 4,
    },
  );

  if (resp.statusCode == 201) {
    return GuestPass.fromJson(resp.data);
  }
  throw Exception('Failed to request guest pass');
}
```

---

### GET `/api/tenant-portal/guest-passes`
Get list of guest passes.

```dart
Future<List<GuestPass>> getGuestPasses() async {
  final resp = await dio.get('/api/tenant-portal/guest-passes');

  if (resp.statusCode == 200) {
    return (resp.data as List)
        .map((g) => GuestPass.fromJson(g))
        .toList();
  }
  throw Exception('Failed to fetch guest passes');
}
```

---

### POST `/api/tenant-portal/leave-requests`
Request leave/going out.

```dart
Future<LeaveRequest> requestLeave({
  required DateTime fromDate,
  required DateTime toDate,
  required String reason,
}) async {
  final resp = await dio.post(
    '/api/tenant-portal/leave-requests',
    data: {
      'fromDate': fromDate.toIso8601String(),
      'toDate': toDate.toIso8601String(),
      'reason': reason,
    },
  );

  if (resp.statusCode == 201) {
    return LeaveRequest.fromJson(resp.data);
  }
  throw Exception('Failed to request leave');
}
```

---

## 🏢 Owner Portal - Comprehensive APIs

### GET `/api/owner-portal/dashboard`
Get owner dashboard with all key metrics.

```dart
Future<OwnerDashboard> getOwnerDashboard({String? buildingId}) async {
  final resp = await dio.get(
    '/api/owner-portal/dashboard',
    queryParameters: if (buildingId != null) {'buildingId': buildingId},
  );

  if (resp.statusCode == 200) {
    return OwnerDashboard.fromJson(resp.data);
  }
  throw Exception('Failed to fetch dashboard');
}

// Response:
// {
//   "stats": {
//     "totalProperties": 3,
//     "totalTenants": 45,
//     "totalRevenue": 450000,
//     "occupancyRate": "92%",
//     "pendingPayments": 5,
//     "openComplaints": 2
//   },
//   "recentBookings": [...],
//   "pendingPayments": [...],
//   "properties": [
//     {
//       "_id": "building_1",
//       "name": "Sunrise PG",
//       "address": "12 MG Road",
//       "occupancy": "85%",
//       "revenue": 150000,
//       "tenants": 15,
//       "beds": 20
//     }
//   ]
// }
```

---

### GET `/api/owner-portal/property-details/:buildingId`
Get detailed analytics for a specific property.

```dart
Future<PropertyDetails> getPropertyDetails(String buildingId) async {
  final resp = await dio.get('/api/owner-portal/property-details/$buildingId');

  if (resp.statusCode == 200) {
    return PropertyDetails.fromJson(resp.data);
  }
  throw Exception('Property not found');
}

// Response includes:
// - Building info
// - Floor-wise occupancy
// - Room-wise details
// - Bed availability
// - Monthly revenue breakdown
// - Tenant list
```

---

### GET `/api/owner-portal/analytics`
Get detailed analytics and reports.

```dart
Future<Analytics> getAnalytics({
  String? buildingId,
  DateTime? fromDate,
  DateTime? toDate,
  String? metric, // revenue | occupancy | bookings | complaints
}) async {
  final resp = await dio.get(
    '/api/owner-portal/analytics',
    queryParameters: {
      if (buildingId != null) 'buildingId': buildingId,
      if (fromDate != null) 'fromDate': fromDate.toIso8601String(),
      if (toDate != null) 'toDate': toDate.toIso8601String(),
      if (metric != null) 'metric': metric,
    },
  );

  if (resp.statusCode == 200) {
    return Analytics.fromJson(resp.data);
  }
  throw Exception('Failed to fetch analytics');
}
```

---

## 👥 Staff Management - Owner APIs

### GET `/api/staff`
Get all staff members for owner's properties.

```dart
Future<List<Staff>> getStaffList({String? buildingId}) async {
  final resp = await dio.get(
    '/api/staff',
    queryParameters: if (buildingId != null) {'buildingId': buildingId},
  );

  if (resp.statusCode == 200) {
    return (resp.data as List)
        .map((s) => Staff.fromJson(s))
        .toList();
  }
  throw Exception('Failed to fetch staff');
}

// Response:
// [
//   {
//     "_id": "staff_1",
//     "name": "Rajesh Kumar",
//     "phone": "9876543210",
//     "role": "Manager",  // Manager | Housekeeper | Security | Maintenance
//     "buildingId": "building_123",
//     "salary": 12000,
//     "status": "active",  // active | inactive
//     "joinDate": "2025-01-15T00:00:00Z"
//   }
// ]
```

---

### POST `/api/staff`
Add new staff member.

```dart
Future<Staff> addStaff({
  required String buildingId,
  required String name,
  required String phone,
  required String role,
  required double salary,
  String? email,
}) async {
  final resp = await dio.post(
    '/api/staff',
    data: {
      'buildingId': buildingId,
      'name': name,
      'phone': phone,
      'role': role,
      'salary': salary,
      'email': email ?? '',
    },
  );

  if (resp.statusCode == 201) {
    return Staff.fromJson(resp.data);
  }
  throw Exception('Failed to add staff');
}
```

---

### PATCH `/api/staff/:id`
Update staff information.

```dart
Future<Staff> updateStaff(
  String staffId, {
  String? name,
  String? phone,
  String? role,
  double? salary,
  String? status,
}) async {
  final resp = await dio.patch(
    '/api/staff/$staffId',
    data: {
      if (name != null) 'name': name,
      if (phone != null) 'phone': phone,
      if (role != null) 'role': role,
      if (salary != null) 'salary': salary,
      if (status != null) 'status': status,
    },
  );

  if (resp.statusCode == 200) {
    return Staff.fromJson(resp.data);
  }
  throw Exception('Failed to update staff');
}
```

---

### DELETE `/api/staff/:id`
Remove staff member.

```dart
Future<void> removeStaff(String staffId) async {
  final resp = await dio.delete('/api/staff/$staffId');

  if (resp.statusCode != 200) {
    throw Exception('Failed to remove staff');
  }
}
```

---

## 📊 Inventory & Maintenance - Owner APIs

### GET `/api/inventory`
Get inventory items for properties.

```dart
Future<List<InventoryItem>> getInventory({String? buildingId}) async {
  final resp = await dio.get(
    '/api/inventory',
    queryParameters: if (buildingId != null) {'buildingId': buildingId},
  );

  if (resp.statusCode == 200) {
    return (resp.data as List)
        .map((i) => InventoryItem.fromJson(i))
        .toList();
  }
  throw Exception('Failed to fetch inventory');
}
```

---

### POST `/api/inventory`
Add new inventory item.

```dart
Future<InventoryItem> addInventoryItem({
  required String buildingId,
  required String itemName,
  required String category,
  required int quantity,
  required double price,
  String? location,
  String? notes,
}) async {
  final resp = await dio.post(
    '/api/inventory',
    data: {
      'buildingId': buildingId,
      'itemName': itemName,
      'category': category, // Furniture | Appliances | Bedding | Other
      'quantity': quantity,
      'price': price,
      'location': location ?? '',
      'notes': notes ?? '',
    },
  );

  if (resp.statusCode == 201) {
    return InventoryItem.fromJson(resp.data);
  }
  throw Exception('Failed to add inventory');
}
```

---

### PATCH `/api/inventory/:id`
Update inventory item.

```dart
Future<InventoryItem> updateInventoryItem(
  String itemId, {
  int? quantity,
  String? status,
}) async {
  final resp = await dio.patch(
    '/api/inventory/$itemId',
    data: {
      if (quantity != null) 'quantity': quantity,
      if (status != null) 'status': status,
    },
  );

  if (resp.statusCode == 200) {
    return InventoryItem.fromJson(resp.data);
  }
  throw Exception('Failed to update inventory');
}
```

---

## 📞 Tenant Management - Owner APIs

### GET `/api/tenants/my-property`
Get all tenants in owner's properties.

```dart
Future<List<Tenant>> getPropertyTenants({
  String? buildingId,
  String? status,
}) async {
  final resp = await dio.get(
    '/api/tenants/my-property',
    queryParameters: {
      if (buildingId != null) 'buildingId': buildingId,
      if (status != null) 'status': status,
    },
  );

  if (resp.statusCode == 200) {
    return (resp.data as List)
        .map((t) => Tenant.fromJson(t))
        .toList();
  }
  throw Exception('Failed to fetch tenants');
}

// Status filter: active | inactive | checked-out
```

---

### GET `/api/tenants/:tenantId`
Get detailed tenant information.

```dart
Future<TenantDetail> getTenantDetail(String tenantId) async {
  final resp = await dio.get('/api/tenants/$tenantId');

  if (resp.statusCode == 200) {
    return TenantDetail.fromJson(resp.data);
  }
  throw Exception('Tenant not found');
}

// Returns complete profile, room details, payment history, etc.
```

---

### POST `/api/tenants/:tenantId/notice`
Send notice to tenant.

```dart
Future<void> sendNoticeToTenant({
  required String tenantId,
  required String title,
  required String message,
  String? documentUrl,
}) async {
  final resp = await dio.post(
    '/api/tenants/$tenantId/notice',
    data: {
      'title': title,
      'message': message,
      'documentUrl': documentUrl,
    },
  );

  if (resp.statusCode != 200) {
    throw Exception('Failed to send notice');
  }
}
```

---

### PATCH `/api/tenants/:tenantId/checkout`
Checkout tenant (mark as left).

```dart
Future<void> checkoutTenant(String tenantId) async {
  final resp = await dio.patch(
    '/api/tenants/$tenantId/checkout',
    data: {'checkoutDate': DateTime.now().toIso8601String()},
  );

  if (resp.statusCode != 200) {
    throw Exception('Failed to checkout tenant');
  }
}
```

---

## 🔔 Notifications - All Users

### GET `/api/notifications`
Get all notifications for current user.

```dart
Future<List<Notification>> getNotifications({
  int page = 1,
  int limit = 50,
}) async {
  final resp = await dio.get(
    '/api/notifications',
    queryParameters: {'page': page, 'limit': limit},
  );

  if (resp.statusCode == 200) {
    return (resp.data['notifications'] as List)
        .map((n) => Notification.fromJson(n))
        .toList();
  }
  throw Exception('Failed to fetch notifications');
}

// Response:
// [
//   {
//     "_id": "notif_1",
//     "type": "payment",  // payment | complaint | booking | system
//     "title": "Payment Received",
//     "message": "Rent payment for June received",
//     "read": false,
//     "createdAt": "2026-06-01T10:00:00Z",
//     "data": { "paymentId": "..." }
//   }
// ]
```

---

### PATCH `/api/notifications/:id/read`
Mark notification as read.

```dart
Future<void> markNotificationRead(String notificationId) async {
  await dio.patch('/api/notifications/$notificationId/read');
}
```

---

### POST `/api/notifications/mark-all-read`
Mark all notifications as read.

```dart
Future<void> markAllNotificationsRead() async {
  await dio.post('/api/notifications/mark-all-read');
}
```

---

### DELETE `/api/notifications/:id`
Delete notification.

```dart
Future<void> deleteNotification(String notificationId) async {
  await dio.delete('/api/notifications/$notificationId');
}
```

---

## � Mobile Permissions & Implementations

### pubspec.yaml Dependencies

```yaml
dependencies:
  flutter:
    sdk: flutter
  
  # HTTP & Networking
  dio: ^5.3.0
  
  # Storage & Security
  flutter_secure_storage: ^9.0.0
  shared_preferences: ^2.2.0
  
  # Image & File Handling
  image_picker: ^1.0.7
  permission_handler: ^11.3.0
  file_picker: ^5.5.0
  
  # Location Services
  geolocator: ^12.0.0
  
  # Push Notifications & Real-time
  firebase_messaging: ^14.2.0
  socket_io_client: ^2.0.3+1
  
  # UI & UX
  connectivity_plus: ^5.0.0
  flutter_spinkit: ^5.1.0
  cached_network_image: ^3.3.0
  
  # Data & JSON
  json_serializable: ^6.7.0
  freezed_annotation: ^2.4.0
  
dev_dependencies:
  build_runner: ^2.4.0
  json_serializable: ^6.7.0
  freezed: ^2.4.0
```

---

### Android Permissions (AndroidManifest.xml)

```xml
<!-- AndroidManifest.xml -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.livora_hostel_hub">

    <!-- Camera -->
    <uses-permission android:name="android.permission.CAMERA" />
    
    <!-- Photos/Gallery -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
    
    <!-- Location -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    
    <!-- Internet & Network -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <!-- Phone Calls & SMS (optional for emergency) -->
    <uses-permission android:name="android.permission.CALL_PHONE" />
    
    <!-- Notifications -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    
    <!-- Storage -->
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"
        android:maxSdkVersion="32" />
    
    <application
        android:usesCleartextTraffic="true">
        <!-- Your app config -->
    </application>
</manifest>
```

---

### iOS Permissions (Info.plist)

```xml
<!-- Info.plist -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <!-- Camera -->
    <key>NSCameraUsageDescription</key>
    <string>We need camera access to take profile photos and capture property images</string>
    
    <!-- Photo Library -->
    <key>NSPhotoLibraryUsageDescription</key>
    <string>We need access to your photos to upload property and profile images</string>
    
    <!-- Location -->
    <key>NSLocationWhenInUseUsageDescription</key>
    <string>We need your location for SOS alerts and property recommendations</string>
    <key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
    <string>We need your location for SOS alerts and emergency services</string>
    
    <!-- Microphone (optional for future calls) -->
    <key>NSMicrophoneUsageDescription</key>
    <string>We need microphone access for video consultations</string>
    
    <!-- Contacts (optional for emergency) -->
    <key>NSContactsUsageDescription</key>
    <string>We need access to contacts for emergency notifications</string>
    
    <!-- Notifications -->
    <key>NSUserNotificationsUsageDescription</key>
    <string>We need permission to send you notifications about payments and bookings</string>
</dict>
</plist>
```

---

### Dart Permission Handler Setup

```dart
import 'package:permission_handler/permission_handler.dart';

class PermissionService {
  // Request camera permission
  static Future<bool> requestCameraPermission() async {
    final status = await Permission.camera.request();
    return status.isGranted;
  }

  // Request photo library permission
  static Future<bool> requestPhotoPermission() async {
    final status = await Permission.photos.request();
    if (status.isDenied) {
      return false;
    } else if (status.isPermanentlyDenied) {
      openAppSettings(); // Open settings if permanently denied
      return false;
    }
    return status.isGranted;
  }

  // Request location permission
  static Future<bool> requestLocationPermission() async {
    final status = await Permission.location.request();
    if (status.isDenied) {
      return false;
    } else if (status.isPermanentlyDenied) {
      openAppSettings();
      return false;
    }
    return status.isGranted;
  }

  // Request notification permission
  static Future<bool> requestNotificationPermission() async {
    final status = await Permission.notification.request();
    return status.isGranted;
  }

  // Check multiple permissions
  static Future<Map<String, bool>> checkPermissions() async {
    return {
      'camera': await Permission.camera.isDenied.then((value) => !value),
      'photos': await Permission.photos.isDenied.then((value) => !value),
      'location': await Permission.location.isDenied.then((value) => !value),
      'notification': await Permission.notification.isDenied.then((value) => !value),
    };
  }
}
```

---

### Image Picker Implementation

```dart
import 'package:image_picker/image_picker.dart';
import 'package:permission_handler/permission_handler.dart';

class ImagePickerService {
  static final ImagePicker _picker = ImagePicker();

  // Pick image from camera
  static Future<XFile?> pickImageFromCamera() async {
    final hasPermission = await PermissionService.requestCameraPermission();
    if (!hasPermission) {
      throw Exception('Camera permission denied');
    }

    try {
      final XFile? image = await _picker.pickImage(
        source: ImageSource.camera,
        imageQuality: 80,
        maxWidth: 1024,
        maxHeight: 1024,
      );
      return image;
    } catch (e) {
      throw Exception('Failed to pick image: $e');
    }
  }

  // Pick image from gallery
  static Future<XFile?> pickImageFromGallery() async {
    final hasPermission = await PermissionService.requestPhotoPermission();
    if (!hasPermission) {
      throw Exception('Photo permission denied');
    }

    try {
      final XFile? image = await _picker.pickImage(
        source: ImageSource.gallery,
        imageQuality: 80,
        maxWidth: 1024,
        maxHeight: 1024,
      );
      return image;
    } catch (e) {
      throw Exception('Failed to pick image: $e');
    }
  }

  // Pick multiple images
  static Future<List<XFile>> pickMultipleImages() async {
    final hasPermission = await PermissionService.requestPhotoPermission();
    if (!hasPermission) {
      throw Exception('Photo permission denied');
    }

    try {
      final List<XFile> images = await _picker.pickMultipleMedia(
        imageQuality: 80,
        maxWidth: 1024,
        maxHeight: 1024,
      );
      return images;
    } catch (e) {
      throw Exception('Failed to pick images: $e');
    }
  }

  // Compress and encode image to base64
  static Future<String> imageToBase64(XFile file) async {
    final bytes = await file.readAsBytes();
    return 'data:image/jpeg;base64,${base64Encode(bytes)}';
  }
}
```

---

### Location Service Implementation

```dart
import 'package:geolocator/geolocator.dart';

class LocationService {
  // Get current location
  static Future<Position> getCurrentLocation() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      throw Exception('Location services are disabled');
    }

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        throw Exception('Location permission denied');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      throw Exception('Location permission permanently denied');
    }

    return await Geolocator.getCurrentPosition(
      desiredAccuracy: LocationAccuracy.high,
      timeLimit: const Duration(seconds: 30),
    );
  }

  // Format location for API
  static Future<Map<String, String>> getFormattedLocation() async {
    try {
      final position = await getCurrentLocation();
      return {
        'latitude': position.latitude.toString(),
        'longitude': position.longitude.toString(),
        'accuracy': position.accuracy.toString(),
      };
    } catch (e) {
      return {
        'latitude': '0',
        'longitude': '0',
        'error': e.toString(),
      };
    }
  }
}
```

---

### Push Notifications (FCM) Setup

```dart
import 'package:firebase_messaging/firebase_messaging.dart';

class NotificationService {
  static final FirebaseMessaging _firebaseMessaging = FirebaseMessaging.instance;

  static Future<void> initializeNotifications() async {
    // Request notification permission
    NotificationSettings settings = await _firebaseMessaging.requestPermission(
      alert: true,
      announcement: false,
      badge: true,
      carPlay: false,
      criticalSound: false,
      provisional: false,
      sound: true,
    );

    if (settings.authorizationStatus == AuthorizationStatus.authorized) {
      print('User granted notification permission');
    }

    // Get FCM token
    String? token = await _firebaseMessaging.getToken();
    print('FCM Token: $token');
    
    // Send token to backend on login
    // Call: await apiClient.updateFCMToken(token);

    // Handle foreground notifications
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      print('Message received in foreground: ${message.notification?.title}');
      _showNotificationDialog(message);
    });

    // Handle background notifications
    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      print('Message opened: ${message.notification?.title}');
      _handleNotificationTap(message);
    });

    // Handle terminated state
    RemoteMessage? initialMessage = await _firebaseMessaging.getInitialMessage();
    if (initialMessage != null) {
      _handleNotificationTap(initialMessage);
    }
  }

  static Future<void> _showNotificationDialog(RemoteMessage message) {
    // Show local notification or dialog
    return Future.value();
  }

  static void _handleNotificationTap(RemoteMessage message) {
    // Navigate based on notification data
    print('Notification tapped: ${message.data}');
  }
}
```

---

### Socket.io Real-time Connection

```dart
import 'package:socket_io_client/socket_io_client.dart' as IO;

class SocketService {
  static IO.Socket? _socket;

  static Future<void> initializeSocket(String userId, String token) async {
    _socket = IO.io(
      'https://livora-hostel-hub-1.onrender.com',
      IO.OptionBuilder()
        .setAuth({'Authorization': 'Bearer $token'})
        .setTransports(['websocket'])
        .disableAutoConnect()
        .build(),
    );

    _socket?.onConnect((_) {
      print('Socket connected');
      // Join user-specific room
      _socket?.emit('joinUser', userId);
    });

    _socket?.onDisconnect((_) {
      print('Socket disconnected');
    });

    // Listen for real-time events
    _socket?.on('newNotification', (data) {
      print('New notification: $data');
      // Handle notification
    });

    _socket?.on('paymentReceived', (data) {
      print('Payment received: $data');
      // Refresh payments
    });

    _socket?.on('complaintStatusChanged', (data) {
      print('Complaint status changed: $data');
      // Refresh complaints
    });

    _socket?.on('bookingConfirmed', (data) {
      print('Booking confirmed: $data');
      // Refresh bookings
    });

    _socket?.connect();
  }

  static void disconnect() {
    _socket?.disconnect();
  }

  static void emit(String event, dynamic data) {
    _socket?.emit(event, data);
  }

  static void on(String event, Function(dynamic) callback) {
    _socket?.on(event, (data) => callback(data));
  }
}
```

---

### Offline Support with Hive/SQLite

```dart
// For handling offline API requests
class OfflineService {
  static final Box<ApiRequest> _requestBox = Hive.box('offlineRequests');

  // Save failed API request for later sync
  static Future<void> saveFailedRequest(
    String method,
    String endpoint,
    Map<String, dynamic>? data,
  ) async {
    final request = ApiRequest(
      method: method,
      endpoint: endpoint,
      data: data,
      timestamp: DateTime.now(),
    );
    await _requestBox.add(request);
  }

  // Sync pending requests when connection restored
  static Future<void> syncPendingRequests(Dio dio) async {
    for (var i = 0; i < _requestBox.length; i++) {
      final request = _requestBox.getAt(i) as ApiRequest;
      try {
        switch (request.method) {
          case 'POST':
            await dio.post(request.endpoint, data: request.data);
            break;
          case 'PATCH':
            await dio.patch(request.endpoint, data: request.data);
            break;
          case 'GET':
            await dio.get(request.endpoint);
            break;
        }
        await _requestBox.deleteAt(i);
      } catch (e) {
        print('Failed to sync: $e');
      }
    }
  }
}
```

---

## ⚡ Performance Optimization

| Feature | Recommendation | Why |
|---------|---------------|-----|
| **Dashboard Queries** | Use `GET /api/buildings?lightweight=true` | Skips nested floor/room/bed data (5x faster) |
| **List Pagination** | Implement pagination with `page` & `limit` params | Reduces payload size and improves UX |
| **Image Caching** | Use `cached_network_image` package | Prevents re-downloading images |
| **Real-time Updates** | Subscribe to Socket.io events | Eliminates polling (reduces server load 10x) |
| **Multipart Uploads** | Use `image_picker` + multipart | Avoid base64 strings (3x larger) |
| **Token Storage** | Use `flutter_secure_storage` | Never use SharedPreferences for secrets |
| **Debouncing** | Debounce search queries (500ms) | Reduces unnecessary API calls |
| **Connection Timeout** | Set timeout to 15-30 seconds | Handles slow networks gracefully |
| **Data Compression** | Send `Accept-Encoding: gzip` | Reduces bandwidth usage |
| **Lazy Loading** | Load images only when visible | Improves initial load time |

---

## ❌ Comprehensive Error Handling

### Standard Error Response Format

All error responses follow this structure:

```json
{
  "error": "User-friendly error message",
  "code": "ERROR_CODE",
  "statusCode": 400,
  "timestamp": "2026-06-01T10:00:00Z"
}
```

---

### HTTP Status Codes & Actions

```dart
Future<T> handleApiResponse<T>(Response response, T Function(dynamic) fromJson) {
  if (response.statusCode == 200 || response.statusCode == 201) {
    return fromJson(response.data);
  }

  final error = response.data['error'] ?? 'Unknown error';
  final code = response.data['code'] ?? '';

  switch (response.statusCode) {
    case 400:
      // Validation error
      throw ValidationException(error);
    case 401:
      // Unauthorized — refresh token or redirect to login
      throw UnauthorizedException(error);
    case 403:
      // Forbidden — wrong role/permissions
      throw ForbiddenException(error);
    case 404:
      // Resource not found
      throw NotFoundException(error);
    case 409:
      // Conflict — duplicate booking, email, etc.
      throw ConflictException(error);
    case 429:
      // Too many requests — rate limited
      throw RateLimitException('Too many requests. Try again later.');
    case 500:
      // Server error
      throw ServerException('Server error: $error');
    default:
      throw Exception('Unknown error: $error');
  }
}
```

---

### Common Error Scenarios

**1. Duplicate Email (Registration)**
```dart
try {
  await register(...);
} on ConflictException catch (e) {
  // Show: "Email already registered. Try login or use different email."
  showSnackBar('Email already exists', type: SnackBarType.error);
}
```

**2. Duplicate Booking**
```dart
try {
  await createBooking(...);
} on ConflictException catch (e) {
  // Show: "You already have an active booking. Complete or cancel it first."
  showSnackBar('Active booking exists', type: SnackBarType.warning);
}
```

**3. Invalid Image Format**
```dart
try {
  await uploadPhoto(file);
} on ValidationException catch (e) {
  // Show: "Image must be JPEG or PNG, max 5MB"
  showSnackBar('Invalid image format', type: SnackBarType.error);
}
```

**4. Expired Token**
```dart
try {
  await dio.get('/api/payments/me');
} on UnauthorizedException catch (e) {
  // Clear token and redirect to login
  await apiClient.clearToken();
  navigateTo(LoginPage());
}
```

**5. Insufficient Permissions**
```dart
try {
  await updateBuilding(...);
} on ForbiddenException catch (e) {
  // Show: "You don't have permission to edit this property"
  showSnackBar('Permission denied', type: SnackBarType.error);
}
```

---

## 🛡️ Security Best Practices

```dart
// ✅ DO: Store token securely
Future<void> saveToken(String token) async {
  await secureStorage.write(key: 'auth_token', value: token);
}

// ❌ DON'T: Store token in SharedPreferences
// await prefs.setString('token', token); // INSECURE!

// ✅ DO: Clear token on logout
Future<void> logout() async {
  await dio.post('/api/auth/logout');
  await secureStorage.delete(key: 'auth_token');
  navigateTo(LoginPage());
}

// ✅ DO: Validate HTTPS in production
// Set: validateStatus: (status) => status! < 500 in Dio

// ✅ DO: Use certificate pinning for sensitive data
// Implement using: certificate_pinning package

// ❌ DON'T: Log sensitive data
// print(token); // DANGEROUS!

// ✅ DO: Clear sensitive data from memory
// Use secure storage for credentials
```

---

## 🔄 CORS & Mobile Access Configuration

The backend is configured to accept requests from:

✅ **Allowed Origins:**
- `null` (native mobile WebView)
- `capacitor://` and `ionic://` (Capacitor/Ionic apps)
- `file://` (local assets)
- `http://localhost:*` (development)
- `https://*.onrender.com` (production)

✅ **Allowed Headers:**
- `Content-Type`
- `Authorization`
- `Accept`
- `X-Requested-With`

✅ **Allowed Methods:**
- GET, POST, PATCH, DELETE, PUT, OPTIONS

✅ **Credentials:**
- Cookies and credentials are allowed

**No extra configuration needed for Flutter Dio or HTTP clients.**

---

## 📊 Response Caching Strategy

```dart
class CacheService {
  static final Map<String, CacheEntry> _cache = {};

  static void saveToCache<T>(String key, T data, {Duration ttl = const Duration(minutes: 5)}) {
    _cache[key] = CacheEntry(
      data: data,
      expiry: DateTime.now().add(ttl),
    );
  }

  static T? getFromCache<T>(String key) {
    final entry = _cache[key];
    if (entry != null && !entry.isExpired) {
      return entry.data as T;
    }
    _cache.remove(key);
    return null;
  }

  static void clearCache(String pattern) {
    _cache.removeWhere((key, value) => key.contains(pattern));
  }

  static void clearAllCache() {
    _cache.clear();
  }
}

// Usage:
Future<List<Building>> getBuildings() async {
  final cached = CacheService.getFromCache<List<Building>>('buildings_public');
  if (cached != null) return cached;

  final resp = await dio.get('/api/buildings/public');
  final buildings = (resp.data as List).map((b) => Building.fromJson(b)).toList();
  CacheService.saveToCache('buildings_public', buildings);
  return buildings;
}
```

---

## 📝 Logging & Debugging

```dart
class ApiLogger {
  static void logRequest(RequestOptions options) {
    print('🔵 API REQUEST');
    print('Method: ${options.method} ${options.path}');
    print('Headers: ${options.headers}');
    if (options.data != null) print('Body: ${options.data}');
  }

  static void logResponse(Response response) {
    print('🟢 API RESPONSE');
    print('Status: ${response.statusCode}');
    print('Data: ${response.data}');
  }

  static void logError(DioException e) {
    print('🔴 API ERROR');
    print('Message: ${e.message}');
    print('Status: ${e.response?.statusCode}');
    print('Error: ${e.response?.data}');
  }
}

// Add to Dio interceptors:
dio.interceptors.add(InterceptorsWrapper(
  onRequest: (options, handler) {
    ApiLogger.logRequest(options);
    return handler.next(options);
  },
  onResponse: (response, handler) {
    ApiLogger.logResponse(response);
    return handler.next(response);
  },
  onError: (e, handler) {
    ApiLogger.logError(e);
    return handler.next(e);
  },
));
```

---

## 🧪 Unit Test Examples

```dart
void main() {
  group('API Client Tests', () {
    late MockDio mockDio;
    late ApiClient apiClient;

    setUp(() {
      mockDio = MockDio();
      apiClient = ApiClient(dio: mockDio);
    });

    test('Login should return AuthResponse on 200', () async {
      mockDio.onPost.mock(
        statusCode: 200,
        data: {
          'token': 'test_token',
          'user': {
            '_id': 'user_1',
            'name': 'John',
            'email': 'john@example.com',
            'role': 'TENANT',
          },
        },
      );

      final result = await apiClient.login('john@example.com', 'password123');

      expect(result.token, 'test_token');
      expect(result.role, UserRole.tenant);
    });

    test('Login should throw UnauthorizedException on 401', () async {
      mockDio.onPost.mock(
        statusCode: 401,
        data: {'error': 'Invalid credentials'},
      );

      expect(
        () => apiClient.login('john@example.com', 'wrong_password'),
        throwsA(isA<UnauthorizedException>()),
      );
    });
  });
}
```
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
