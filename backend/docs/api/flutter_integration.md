# Flutter Integration Guide (Dio)

Complete examples for integrating the Livora Hostel Hub API into a Flutter mobile app.

---

## 1. Dependencies (pubspec.yaml)

```yaml
dependencies:
  dio: ^5.4.3
  flutter_secure_storage: ^9.2.2
  image_picker: ^1.0.7
  permission_handler: ^11.3.0
  socket_io_client: ^2.0.3+1
  geolocator: ^12.0.0          # optional — for SOS location
  cached_network_image: ^3.3.1  # for displaying hostel images
```

---

## 2. ApiService Singleton

```dart
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiService {
  static const String baseUrl = 'https://livora-hostel-hub-1.onrender.com';
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;

  late final Dio dio;
  final _storage = const FlutterSecureStorage();

  ApiService._internal() {
    dio = Dio(BaseOptions(
      baseUrl: '$baseUrl/api',
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 30),
    ));

    dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _storage.read(key: 'token');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (DioException e, handler) async {
        if (e.response?.statusCode == 401) {
          await _storage.delete(key: 'token');
          // Navigate to login — use your router/navigator
        }
        return handler.next(e);
      },
    ));
  }

  // Helper — extract readable error message
  String errorMessage(DioException e) =>
      e.response?.data?['error'] ??
      e.response?.data?['message'] ??
      e.message ??
      'Something went wrong';
}
```

---

## 3. Authentication

```dart
class AuthRepository {
  final _api = ApiService().dio;
  final _storage = const FlutterSecureStorage();

  Future<Map<String, dynamic>> login(String email, String password) async {
    final resp = await _api.post('/auth/login', data: {
      'email': email,
      'password': password,
    });
    await _storage.write(key: 'token', value: resp.data['token']);
    await _storage.write(key: 'user', value: jsonEncode(resp.data['user']));
    return resp.data;
  }

  Future<Map<String, dynamic>> register({
    required String name,
    required String email,
    required String password,
    String role = 'TENANT',
    String? phone,
  }) async {
    final resp = await _api.post('/auth/register', data: {
      'name': name, 'email': email, 'password': password,
      'role': role, if (phone != null) 'phone': phone,
    });
    await _storage.write(key: 'token', value: resp.data['token']);
    return resp.data;
  }

  Future<void> logout() async {
    await _storage.deleteAll();
  }
}
```

---

## 4. Hostel Listings (Public)

```dart
class HostelRepository {
  final _api = ApiService().dio;

  // Resolve image URLs — prepend base if path is relative
  String resolveImage(String img) =>
    img.startsWith('http') || img.startsWith('data:')
      ? img
      : '${ApiService.baseUrl}$img';

  Future<List<dynamic>> getPublicHostels() async {
    final resp = await _api.get('/buildings/public');
    return (resp.data as List).map((b) => {
      ...b,
      'images': (b['images'] as List? ?? []).map(resolveImage).toList(),
    }).toList();
  }

  Future<Map<String, dynamic>> getHostelDetail(String id) async {
    final resp = await _api.get('/buildings/public/$id');
    return resp.data;
  }

  Future<Map<String, dynamic>> getPlatformStats() async {
    final resp = await _api.get('/buildings/public/stats');
    return resp.data;
  }
}
```

---

## 5. Profile Photo Upload (Camera & Gallery)

```dart
import 'package:image_picker/image_picker.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:dio/dio.dart';
import 'package:http_parser/http_parser.dart';

class ProfileRepository {
  final _api = ApiService().dio;

  Future<XFile?> pickImage(ImageSource source) async {
    final permission = source == ImageSource.camera
        ? await Permission.camera.request()
        : await Permission.photos.request();
    if (!permission.isGranted) return null;
    return await ImagePicker().pickImage(
      source: source, imageQuality: 80, maxWidth: 1024,
    );
  }

  Future<Map<String, dynamic>> uploadPhoto(XFile file) async {
    final formData = FormData.fromMap({
      'photo': await MultipartFile.fromFile(
        file.path,
        filename: file.name,
        contentType: MediaType('image', 'jpeg'),
      ),
    });
    final resp = await _api.post('/tenant-portal/upload-photo', data: formData);
    return resp.data; // { "message": "...", "photo": { "photoUrl": "..." } }
  }

  Future<Map<String, dynamic>> getCompleteProfile() async {
    final resp = await _api.get('/tenant-portal/complete-profile');
    return resp.data;
  }
}
```

---

## 6. Complaints

```dart
class ComplaintRepository {
  final _api = ApiService().dio;

  Future<void> raiseComplaint({
    required String title,
    required String description,
    required String category,   // Maintenance | Safety | Cleanliness | Other
    String priority = 'Medium', // High | Medium | Low
  }) async {
    await _api.post('/complaints', data: {
      'title': title, 'description': description,
      'category': category, 'priority': priority,
    });
  }

  Future<List<dynamic>> getMyComplaints() async {
    final resp = await _api.get('/complaints/me');
    return resp.data as List;
  }
}
```

---

## 7. Payments

```dart
class PaymentRepository {
  final _api = ApiService().dio;

  Future<List<dynamic>> getMyPayments() async {
    final resp = await _api.get('/payments/me');
    return resp.data as List;
  }
}
```

---

## 8. Booking

```dart
class BookingRepository {
  final _api = ApiService().dio;

  Future<Map<String, dynamic>> createBooking({
    required String buildingId,
    required double totalAmount,
    String category = 'Standard',
    String? moveInDate,
    double securityDeposit = 0,
    String method = 'UPI',
    String? guestName,
    String? email,
    String? phone,
  }) async {
    final resp = await _api.post('/bookings', data: {
      'buildingId': buildingId,
      'category': category,
      'moveInDate': moveInDate ?? DateTime.now().toIso8601String().split('T')[0],
      'totalAmount': totalAmount,
      'securityDeposit': securityDeposit,
      'method': method,
      if (guestName != null) 'guestName': guestName,
      if (email != null) 'email': email,
      if (phone != null) 'phone': phone,
    });
    return resp.data;
  }

  Future<List<dynamic>> getMyBookings() async {
    final resp = await _api.get('/bookings/me');
    return resp.data as List;
  }
}
```

---

## 9. Real-time via Socket.io

```dart
import 'package:socket_io_client/socket_io_client.dart' as IO;

class SocketService {
  static final SocketService _instance = SocketService._internal();
  factory SocketService() => _instance;

  late IO.Socket socket;

  SocketService._internal() {
    socket = IO.io(
      'https://livora-hostel-hub-1.onrender.com',
      IO.OptionBuilder()
        .setTransports(['websocket'])
        .disableAutoConnect()
        .build(),
    );
  }

  void connect({ String? buildingId, String? tenantId }) {
    if (!socket.connected) {
      socket.onConnect((_) {
        if (buildingId != null) socket.emit('joinBuilding', buildingId);
        if (tenantId != null) socket.emit('joinTenant', tenantId);
      });
      socket.connect();
    }
  }

  void on(String event, Function(dynamic) handler) => socket.on(event, handler);
  void off(String event) => socket.off(event);
  void disconnect() => socket.disconnect();
}

// Usage in a widget:
// SocketService().connect(buildingId: bid, tenantId: tid);
// SocketService().on('newNotification', (data) { setState(() { ... }); });
```

---

## 10. SOS Alert (with Location)

```dart
import 'package:geolocator/geolocator.dart';

Future<void> sendSOS() async {
  String location = 'Unknown';
  try {
    final perm = await Geolocator.requestPermission();
    if (perm == LocationPermission.whileInUse ||
        perm == LocationPermission.always) {
      final pos = await Geolocator.getCurrentPosition();
      location = '${pos.latitude}, ${pos.longitude}';
    }
  } catch (_) {}

  await ApiService().dio.post('/tenant-portal/sos-alerts', data: {
    'type': 'Emergency',
    'message': 'SOS triggered by tenant',
    'location': location,
  });
}
```

---

## 11. Error Handling Pattern

```dart
Future<void> safeCall(Future<void> Function() fn, {
  required void Function(String msg) onError,
}) async {
  try {
    await fn();
  } on DioException catch (e) {
    onError(ApiService().errorMessage(e));
  } catch (e) {
    onError(e.toString());
  }
}

// Usage:
safeCall(
  () => ComplaintRepository().raiseComplaint(title: 'AC broken', ...),
  onError: (msg) => ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(content: Text(msg)),
  ),
);
```

---

## 12. Android Permissions (AndroidManifest.xml)

```xml
<!-- Camera -->
<uses-permission android:name="android.permission.CAMERA"/>
<!-- Storage (gallery) -->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES"/>
<!-- Network -->
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
<!-- Location (SOS) -->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
```

---

## 13. iOS Permissions (Info.plist)

```xml
<key>NSCameraUsageDescription</key>
<string>Livora needs camera access to upload your profile photo.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Livora needs gallery access to upload your profile photo.</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>Livora uses your location only when sending an SOS emergency alert.</string>
```

---

*Full endpoint list: see `URLS.md`. Complete Dio snippets: see `API_FOR_FLUTTER.md`.*
