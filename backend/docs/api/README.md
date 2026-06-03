# 📚 Livora Hostel Hub - Flutter API Documentation

Complete, production-ready API documentation for building both Tenant and Owner portal applications in Flutter with full mobile permission support.

---

## 📖 Documentation Structure

This documentation suite consists of:

| Document | Purpose | Audience |
|----------|---------|----------|
| **[API_FOR_FLUTTER.md](./API_FOR_FLUTTER.md)** | Complete API reference with all endpoints | All developers |
| **[TENANT_PORTAL_API.md](./TENANT_PORTAL_API.md)** | Tenant-specific API workflows | Tenant portal developers |
| **[OWNER_PORTAL_API.md](./OWNER_PORTAL_API.md)** | Owner/admin-specific API workflows | Owner portal developers |
| **[MOBILE_PERMISSIONS_SETUP.md](./MOBILE_PERMISSIONS_SETUP.md)** | Android/iOS permissions configuration | DevOps / Android/iOS specialists |
| **[README.md](./README.md)** | This file - Quick start guide | Everyone |

---

## 🚀 Quick Start

### 1. Choose Your Role

**👤 Building Tenant Portal?**
- Start with: [TENANT_PORTAL_API.md](./TENANT_PORTAL_API.md)
- Setup: [MOBILE_PERMISSIONS_SETUP.md](./MOBILE_PERMISSIONS_SETUP.md)
- Reference: [API_FOR_FLUTTER.md](./API_FOR_FLUTTER.md)

**🏢 Building Owner Portal?**
- Start with: [OWNER_PORTAL_API.md](./OWNER_PORTAL_API.md)
- Setup: [MOBILE_PERMISSIONS_SETUP.md](./MOBILE_PERMISSIONS_SETUP.md)
- Reference: [API_FOR_FLUTTER.md](./API_FOR_FLUTTER.md)

### 2. Setup Development Environment

Follow [MOBILE_PERMISSIONS_SETUP.md](./MOBILE_PERMISSIONS_SETUP.md) to:

1. ✅ Add dependencies to `pubspec.yaml`
2. ✅ Configure Android `AndroidManifest.xml`
3. ✅ Configure iOS `Info.plist`
4. ✅ Implement permission handlers
5. ✅ Test on physical devices

### 3. Implement Core Features

**Phase 1: Authentication (2-3 days)**
- Registration & Login
- Token management
- Session handling
- Logout

**Phase 2: Core Functionality (5-7 days)**
- Browse/Search (Tenant)
- Property Management (Owner)
- Bookings
- Payments

**Phase 3: Advanced Features (7-10 days)**
- Notifications
- Real-time updates (Socket.io)
- Complaints/Support
- Analytics & Reports

---

## 🔐 Base URL & Authentication

```dart
const String baseUrl = 'https://livora-hostel-hub-1.onrender.com';

// All protected routes require:
'Authorization: Bearer <token>'
```

---

## 📱 Supported Mobile Platforms

| Platform | Min Version | Status |
|----------|------------|--------|
| Android | 5.1 (API 21) | ✅ Supported |
| iOS | 12.0+ | ✅ Supported |
| Web | - | In development |

---

## 🎯 API Endpoint Categories

### Public Endpoints (No Auth)

```dart
GET /api/buildings/public              // Browse all hostels
GET /api/buildings/public/:id          // Get hostel details
GET /api/buildings/public/stats        // Platform statistics
POST /api/auth/register                // Register new user
POST /api/auth/login                   // Login user
POST /api/auth/forgot-password         // Password reset
```

### Tenant Endpoints

```dart
// Profile & Dashboard
GET /api/tenant-portal/complete-profile
PATCH /api/tenant-portal/update-profile
POST /api/tenant-portal/upload-photo

// Bookings & Payments
POST /api/bookings
GET /api/bookings/me
GET /api/payments/me
POST /api/payments

// Complaints & Features
POST /api/complaints
GET /api/complaints/me
POST /api/tenant-portal/sos-alerts
GET /api/tenant-portal/wishlist
POST /api/tenant-portal/wishlist

// Community
POST /api/tenant-portal/community-reports
GET /api/tenant-portal/community-reports

// Rewards & Guests
GET /api/tenant-portal/rewards/me
POST /api/tenant-portal/guest-passes
GET /api/tenant-portal/guest-passes
```

### Owner Endpoints

```dart
// Dashboard & Analytics
GET /api/owner-portal/dashboard
GET /api/owner-portal/property-details/:id
GET /api/owner-portal/analytics

// Property Management
GET /api/buildings
POST /api/buildings
PATCH /api/buildings/:id
DELETE /api/buildings/:id

// Floors, Rooms & Beds
POST /api/floors
POST /api/rooms
POST /api/beds

// Bookings, Payments & Complaints
GET /api/bookings/my-property
PATCH /api/bookings/:id/status
GET /api/payments/my-property
GET /api/complaints/my-property
PATCH /api/complaints/:id/status

// Staff & Inventory
GET /api/staff
POST /api/staff
PATCH /api/staff/:id
GET /api/inventory
POST /api/inventory

// Tenants
GET /api/tenants/my-property
GET /api/tenants/:id
POST /api/tenants/:id/notice
PATCH /api/tenants/:id/checkout
```

---

## 🔧 Dio Client Setup

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
      headers: {'Content-Type': 'application/json'},
    ));

    // Auth interceptor
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
          _secureStorage.delete(key: 'auth_token');
          // Navigate to login
        }
        return handler.next(e);
      },
    ));
  }

  Future<void> saveToken(String token) =>
      _secureStorage.write(key: 'auth_token', value: token);

  Future<String?> getToken() =>
      _secureStorage.read(key: 'auth_token');

  Future<void> clearToken() =>
      _secureStorage.delete(key: 'auth_token');
}
```

---

## 📋 Required Permissions

### Android (AndroidManifest.xml)

```xml
<!-- Internet -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

<!-- Camera & Gallery -->
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />

<!-- Location -->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

<!-- Notifications -->
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

### iOS (Info.plist)

```xml
<key>NSCameraUsageDescription</key>
<string>Used for profile photos and property images</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>Used for uploading photos from your library</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>Used for SOS alerts and location-based features</string>

<key>NSUserNotificationsUsageDescription</key>
<string>Receive payment and booking notifications</string>
```

---

## ⚡ Performance Best Practices

1. **Use Lightweight Queries**
   ```dart
   GET /api/buildings?lightweight=true  // Fast for dashboards
   GET /api/buildings                    // Slow, includes nested data
   ```

2. **Implement Pagination**
   ```dart
   GET /api/buildings/public?page=1&limit=20
   GET /api/payments/me?page=1&limit=50
   ```

3. **Cache Results**
   ```dart
   // Cache public building list for 1 hour
   // Cache user profile for 5 minutes
   // Cache dashboard data for 30 minutes
   ```

4. **Use Socket.io for Real-time**
   ```dart
   // Don't poll - listen to real-time events
   socket.on('paymentReceived', (data) => refreshPayments());
   socket.on('complaintStatusChanged', (data) => refreshComplaints());
   ```

5. **Optimize Images**
   ```dart
   // Max 1024x1024, 80% quality, max 5MB
   final image = await picker.pickImage(
     imageQuality: 80,
     maxWidth: 1024,
     maxHeight: 1024,
   );
   ```

---

## 🛡️ Security Checklist

- ✅ Store JWT in `flutter_secure_storage` (never SharedPreferences)
- ✅ Clear token on logout
- ✅ Handle 401 Unauthorized responses
- ✅ Use HTTPS in production
- ✅ Validate SSL certificates
- ✅ Never log sensitive data
- ✅ Implement certificate pinning for sensitive operations
- ✅ Don't share API tokens in logs or crash reports
- ✅ Implement timeout for idle sessions
- ✅ Request minimal permissions (principle of least privilege)

---

## 🧪 Testing Checklist

### Unit Tests
- Authentication (login, register, token refresh)
- API request/response handling
- Permission checks
- Error handling
- Offline request queuing

### Integration Tests
- Complete user workflows
- Real API calls with staging backend
- Permission interactions
- Camera/gallery flows
- Location services

### Manual Testing
- Test on Android 5.1+ device
- Test on iOS 12+ device
- Test with slow network (2G/3G)
- Test offline scenarios
- Test permission denials
- Test token expiry flows
- Test camera/gallery uploads
- Test location services

---

## 🐛 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Expired token | Implement token refresh or auto-login |
| 400 Duplicate Booking | Tenant already booked | Show message & redirect to bookings |
| Permission Denied | User rejected permission | Show rationale & openAppSettings() |
| Camera Black Screen | Camera not released | Restart app or clear camera app cache |
| Location (0,0) | GPS not locked | Wait 2-3 seconds or use lower accuracy |
| Slow Uploads | Large images | Compress before upload (max 5MB) |
| Network Timeout | Slow connection | Increase timeout or show retry option |
| Socket.io Disconnect | Connection lost | Auto-reconnect with exponential backoff |

---

## 📞 Support & Resources

### Documentation Links
- [Complete API Reference](./API_FOR_FLUTTER.md)
- [Tenant Portal Guide](./TENANT_PORTAL_API.md)
- [Owner Portal Guide](./OWNER_PORTAL_API.md)
- [Mobile Permissions Guide](./MOBILE_PERMISSIONS_SETUP.md)

### External Resources
- [Dio Documentation](https://github.com/flutterchina/dio)
- [Flutter Permissions](https://pub.dev/packages/permission_handler)
- [Image Picker Package](https://pub.dev/packages/image_picker)
- [Firebase Messaging](https://pub.dev/packages/firebase_messaging)
- [Socket.io Client](https://pub.dev/packages/socket_io_client)

### Backend Repository
- Backend Source: `/backend`
- API Routes: `/backend/src/routes`
- Database Schema: `/backend/prisma/schema.prisma`

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-06-01 | Initial complete documentation |

---

## 📄 File Structure

```
backend/docs/api/
├── README.md                              # This file
├── API_FOR_FLUTTER.md                    # Complete API reference
├── TENANT_PORTAL_API.md                  # Tenant-specific guide
├── OWNER_PORTAL_API.md                   # Owner-specific guide
└── MOBILE_PERMISSIONS_SETUP.md           # Permission configuration guide
```

---

## 🎓 Recommended Learning Path

1. **Day 1-2**: Read this README and authentication section of API_FOR_FLUTTER.md
2. **Day 3**: Setup development environment using MOBILE_PERMISSIONS_SETUP.md
3. **Day 4-5**: Choose your portal (Tenant/Owner) and read relevant guide
4. **Day 6+**: Implement features according to guide, reference API_FOR_FLUTTER.md as needed

---

## ✅ Completion Checklist for Developers

Before deploying to production:

- [ ] All API endpoints tested with real backend
- [ ] Authentication flow working (login, register, logout, refresh)
- [ ] Image upload/download working
- [ ] Offline scenario handled
- [ ] All permissions requested and handled
- [ ] Error messages user-friendly
- [ ] Token stored securely
- [ ] Network timeout configured
- [ ] Socket.io real-time updates working
- [ ] FCM push notifications setup
- [ ] Analytics/logging configured
- [ ] App tested on physical Android device
- [ ] App tested on physical iOS device
- [ ] Slow network (2G) tested
- [ ] Permission denials handled
- [ ] Crash reporting configured
- [ ] SSL certificate pinning implemented
- [ ] Rate limiting handled
- [ ] Session timeout implemented

---

## 🚀 Deployment Checklist

Before releasing to app stores:

- [ ] Build signed APK for Android
- [ ] Build signed IPA for iOS
- [ ] Change base URL from staging to production
- [ ] Enable SSL certificate pinning
- [ ] Disable debug logging
- [ ] Update Firebase project ID
- [ ] Configure notification icons
- [ ] Test on multiple devices
- [ ] Get all permissions approved
- [ ] Prepare privacy policy
- [ ] Prepare terms of service
- [ ] Create app store listings
- [ ] Submit for review

---

## 💡 Tips & Tricks

1. **Fast Development**: Use `lightweight=true` queries during development
2. **Test Permissions**: Use `permission_handler` to quickly test all permissions
3. **Mock Offline**: Disable network and test offline handling
4. **Image Quality**: Lower quality (60) for faster uploads during testing
5. **Logs**: Use `flutter_logs` package for structured logging
6. **Analytics**: Track user flows with Firebase Analytics
7. **Error Tracking**: Use Sentry for crash reporting
8. **Testing**: Use `mockito` for mocking API responses

---

## 📞 Contact & Support

For API issues or clarifications:
1. Check relevant documentation file
2. Search error in "Common Issues" section
3. Review code examples in reference guide
4. Test with Postman/Insomnia before Flutter implementation

---

**Last Updated**: June 1, 2026  
**Status**: ✅ Production Ready  
**Tested On**: Android 5.1+, iOS 12+, Dart 3.0+

---

*Created for Livora Hostel Hub Mobile Development Team*
