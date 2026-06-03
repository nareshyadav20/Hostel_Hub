# 📱 Mobile Permissions & Setup Guide for Flutter

This guide provides complete setup instructions for handling all mobile permissions required by Livora Hostel Hub Flutter app.

---

## 📋 Table of Contents

1. [pubspec.yaml Dependencies](#pubspeck-dependencies)
2. [Android Permissions](#android-permissions-setup)
3. [iOS Permissions](#ios-permissions-setup)
4. [Permission Handling Dart Code](#dart-permission-handling)
5. [Feature-Specific Implementations](#feature-specific-implementations)
6. [Offline Support](#offline-support--local-storage)
7. [Troubleshooting](#troubleshooting)

---

## pubspec.yaml Dependencies

### Complete pubspec.yaml Setup

```yaml
name: livora_hostel_hub
description: "Hostel management and booking platform for mobile"
publish_to: 'none'

version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  
  # ==================== NETWORKING ====================
  dio: ^5.3.0                              # HTTP client
  connectivity_plus: ^5.0.0                # Network status
  
  # ==================== STORAGE & SECURITY ====================
  flutter_secure_storage: ^9.0.0           # Secure token storage
  shared_preferences: ^2.2.0               # App preferences
  hive: ^2.2.0                             # Local database
  hive_flutter: ^1.1.0
  
  # ==================== PERMISSIONS ====================
  permission_handler: ^11.3.0              # Android/iOS permissions
  
  # ==================== IMAGE & FILE HANDLING ====================
  image_picker: ^1.0.7                     # Camera & gallery
  image_cropper: ^5.0.0                    # Image cropping
  file_picker: ^5.5.0                      # File picker
  cached_network_image: ^3.3.0             # Image caching
  
  # ==================== LOCATION SERVICES ====================
  geolocator: ^12.0.0                      # GPS & location
  geocoding: ^2.1.0                        # Address geocoding
  
  # ==================== PUSH NOTIFICATIONS & REAL-TIME ====================
  firebase_core: ^2.17.0                   # Firebase setup
  firebase_messaging: ^14.2.0              # Push notifications (FCM)
  socket_io_client: ^2.0.3+1               # Real-time socket.io
  
  # ==================== UI & STATE MANAGEMENT ====================
  provider: ^6.0.0                         # State management
  flutter_spinkit: ^5.1.0                  # Loading spinners
  toastification: ^1.1.0                   # Toast notifications
  awesome_dialog: ^3.1.0                   # Dialogs
  
  # ==================== DATA & JSON ====================
  json_annotation: ^4.8.0
  freezed_annotation: ^2.4.0
  equatable: ^2.0.0
  
  # ==================== UTILITIES ====================
  intl: ^0.19.0                            # Internationalization
  url_launcher: ^6.1.0                     # Open URLs
  share_plus: ^6.1.0                       # Share functionality
  device_info_plus: ^9.0.0                 # Device info

dev_dependencies:
  flutter_test:
    sdk: flutter
  
  flutter_lints: ^2.0.0
  build_runner: ^2.4.0
  json_serializable: ^6.7.0
  freezed: ^2.4.0
  hive_generator: ^2.0.0
  mockito: ^5.4.0

flutter:
  uses-material-design: true
  assets:
    - assets/images/
    - assets/icons/
  fonts:
    - family: Poppins
      fonts:
        - asset: assets/fonts/Poppins-Regular.ttf
        - asset: assets/fonts/Poppins-Bold.ttf
          weight: 700
```

---

## Android Permissions Setup

### Step 1: Update AndroidManifest.xml

```xml
<!-- android/app/src/main/AndroidManifest.xml -->

<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.livora_hostel_hub">

    <!-- ===================== PERMISSIONS ===================== -->
    
    <!-- INTERNET & NETWORK -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.CHANGE_NETWORK_STATE" />
    
    <!-- CAMERA -->
    <uses-permission android:name="android.permission.CAMERA" />
    
    <!-- PHOTOS/GALLERY -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"
        android:maxSdkVersion="32" />
    
    <!-- LOCATION -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
    
    <!-- NOTIFICATIONS -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    
    <!-- PHONE (Emergency calls) -->
    <uses-permission android:name="android.permission.CALL_PHONE" />
    <uses-permission android:name="android.permission.READ_PHONE_STATE" />
    
    <!-- OPTIONAL: CONTACTS (Emergency) -->
    <uses-permission android:name="android.permission.READ_CONTACTS" />
    
    <!-- VIBRATION -->
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="true"
        android:requestLegacyExternalStorage="true">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">
            
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Firebase Messaging -->
        <service
            android:name="com.google.firebase.messaging.FirebaseMessagingService"
            android:exported="false">
            <intent-filter>
                <action android:name="com.google.firebase.MESSAGING_EVENT" />
            </intent-filter>
        </service>
        
        <!-- File Provider for sharing files -->
        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="${applicationId}.fileprovider"
            android:exported="false">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths" />
        </provider>
    </application>
</manifest>
```

### Step 2: Create File Provider Configuration

Create: `android/app/src/main/res/xml/file_paths.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<paths xmlns:android="http://schemas.android.com/apk/res/android">
    <cache-path name="image_cache" path="image_cache/" />
    <external-path name="document_cache" path="Documents/" />
    <external-files-path name="my_images" path="Pictures/" />
    <cache-path name="downloads" path="downloads/" />
</paths>
```

### Step 3: Gradle Configuration

Update: `android/app/build.gradle`

```gradle
android {
    compileSdk 34
    
    defaultConfig {
        applicationId "com.example.livora_hostel_hub"
        minSdkVersion 21
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
        
        // Enable multidex if needed
        multiDexEnabled true
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            shrinkResources true
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
        debug {
            debuggable true
        }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_11
        targetCompatibility JavaVersion.VERSION_11
    }
}

dependencies {
    implementation 'com.google.firebase:firebase-messaging:23.2.1'
    implementation 'androidx.core:core:1.10.1'
    implementation 'androidx.work:work-runtime:2.8.1'
}
```

---

## iOS Permissions Setup

### Step 1: Update Info.plist

```xml
<!-- ios/Runner/Info.plist -->

<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <!-- ==================== PERMISSIONS DESCRIPTIONS ==================== -->
    
    <!-- CAMERA -->
    <key>NSCameraUsageDescription</key>
    <string>We need camera access to take profile photos and capture property images for listings and documentation</string>
    
    <!-- PHOTO LIBRARY -->
    <key>NSPhotoLibraryUsageDescription</key>
    <string>We need access to your photo library to upload profile pictures, property images, and supporting documents</string>
    
    <key>NSPhotoLibraryAddUsageDescription</key>
    <string>We need permission to save downloaded invoices and documents to your library</string>
    
    <!-- LOCATION SERVICES -->
    <key>NSLocationWhenInUseUsageDescription</key>
    <string>We need your location for SOS emergency alerts, location-based hostel recommendations, and to help first responders locate you during emergencies</string>
    
    <key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
    <string>Background location access helps us send emergency notifications and enable SOS alerts when the app is closed</string>
    
    <!-- CONTACTS (Optional for Emergency) -->
    <key>NSContactsUsageDescription</key>
    <string>We need access to your contacts for emergency notifications and to help us reach your emergency contacts</string>
    
    <!-- MICROPHONE (Optional for future video) -->
    <key>NSMicrophoneUsageDescription</key>
    <string>We may need microphone access for future video consultations with property owners</string>
    
    <!-- NOTIFICATIONS -->
    <key>NSUserNotificationsUsageDescription</key>
    <string>We send notifications about booking confirmations, payments, maintenance updates, and emergency alerts</string>
    
    <!-- APP CLIPS (For shared verification) -->
    <key>NSAppClip</key>
    <dict>
        <key>NSAppClipRequestEphemeralUserNotification</key>
        <true/>
    </dict>
    
    <!-- DISABLE REQUIRE NETWORK FOR STARTUP -->
    <key>NSBonjourServices</key>
    <array>
        <string>_http._tcp</string>
        <string>_https._tcp</string>
    </array>
    
    <!-- ALLOW INSECURE HTTP FOR DEV (REMOVE IN PRODUCTION) -->
    <key>NSAppTransportSecurity</key>
    <dict>
        <key>NSAllowsArbitraryLoads</key>
        <false/>
        <key>NSExceptionDomains</key>
        <dict>
            <!-- Add localhost for development -->
            <key>localhost</key>
            <dict>
                <key>NSIncludesSubdomains</key>
                <true/>
                <key>NSTemporaryExceptionAllowsInsecureHTTPLoads</key>
                <true/>
                <key>NSTemporaryExceptionMinimumTLSVersion</key>
                <string>TLSv1.2</string>
            </dict>
        </dict>
    </dict>
    
    <!-- BACKGROUND MODES FOR PUSH NOTIFICATIONS -->
    <key>UIBackgroundModes</key>
    <array>
        <string>fetch</string>
        <string>remote-notification</string>
    </array>
    
    <!-- REQUIRED DEVICE CAPABILITIES -->
    <key>UIRequiredDeviceCapabilities</key>
    <array>
        <string>armv7</string>
        <string>arm64</string>
    </array>
    
</dict>
</plist>
```

### Step 2: Configure Podfile

Update: `ios/Podfile`

```ruby
# ios/Podfile

post_install do |installer|
  installer.pods_project.targets.each do |target|
    flutter_additional_ios_build_settings(target)
    
    # Add Firebase setup
    target.build_configurations.each do |config|
      config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] ||= [
        '$(inherited)',
        'PERMISSION_LOCATION=1',
        'PERMISSION_CAMERA=1',
        'PERMISSION_PHOTOS=1',
      ]
    end
  end
end
```

### Step 3: Xcode Build Phases

1. Open `ios/Runner.xcworkspace` in Xcode
2. Select Runner target
3. Go to Build Phases
4. Add "New Run Script Phase"

```bash
# Add this script for Firebase setup validation
if [ "${CONFIGURATION}" == "Release" ]; then
  ./Pods/FirebaseCore/Firebase/CoreOnly/Resources/GoogleService-Info.plist
fi
```

---

## Dart Permission Handling

### 1. Permission Service Class

Create: `lib/services/permission_service.dart`

```dart
import 'package:permission_handler/permission_handler.dart';

class PermissionService {
  // Request camera permission
  static Future<bool> requestCameraPermission() async {
    final status = await Permission.camera.request();
    
    if (status.isDenied) {
      return false;
    } else if (status.isPermanentlyDenied) {
      _showPermissionDialog('Camera permission is required for taking photos');
      openAppSettings();
      return false;
    }
    
    return status.isGranted;
  }

  // Request photo library permission
  static Future<bool> requestPhotoPermission() async {
    final status = await Permission.photos.request();
    
    if (status.isDenied) {
      return false;
    } else if (status.isPermanentlyDenied) {
      _showPermissionDialog('Photo permission is required for gallery access');
      openAppSettings();
      return false;
    }
    
    return status.isGranted;
  }

  // Request location permission
  static Future<bool> requestLocationPermission({bool background = false}) async {
    PermissionStatus status;
    
    if (background) {
      status = await Permission.locationAlways.request();
    } else {
      status = await Permission.locationWhenInUse.request();
    }
    
    if (status.isDenied) {
      return false;
    } else if (status.isPermanentlyDenied) {
      _showPermissionDialog('Location permission is required for SOS alerts');
      openAppSettings();
      return false;
    }
    
    return status.isGranted;
  }

  // Request notification permission
  static Future<bool> requestNotificationPermission() async {
    final status = await Permission.notification.request();
    
    if (status.isDenied) {
      return false;
    } else if (status.isPermanentlyDenied) {
      _showPermissionDialog('Notification permission is required for alerts');
      openAppSettings();
      return false;
    }
    
    return status.isGranted;
  }

  // Request contacts permission
  static Future<bool> requestContactsPermission() async {
    final status = await Permission.contacts.request();
    return status.isGranted;
  }

  // Check multiple permissions at once
  static Future<Map<String, bool>> checkPermissions() async {
    return {
      'camera': await Permission.camera.isGranted,
      'photos': await Permission.photos.isGranted,
      'location': await Permission.locationWhenInUse.isGranted,
      'notification': await Permission.notification.isGranted,
      'contacts': await Permission.contacts.isGranted,
    };
  }

  // Request all required permissions
  static Future<Map<String, bool>> requestAllPermissions() async {
    final results = <String, bool>{};
    
    results['camera'] = await requestCameraPermission();
    results['photos'] = await requestPhotoPermission();
    results['location'] = await requestLocationPermission();
    results['notification'] = await requestNotificationPermission();
    
    return results;
  }

  // Check if permission is permanently denied
  static Future<bool> isPermissionPermanentlyDenied(Permission permission) async {
    final status = await permission.status;
    return status.isPermanentlyDenied;
  }

  // Open app settings for manual permission changes
  static Future<void> openSettings() async {
    await openAppSettings();
  }

  static void _showPermissionDialog(String message) {
    // Show dialog to user
    print('Permission required: $message');
  }
}
```

### 2. Image Picker Service

Create: `lib/services/image_picker_service.dart`

```dart
import 'package:image_picker/image_picker.dart';
import 'package:image_cropper/image_cropper.dart';
import 'permission_service.dart';

class ImagePickerService {
  static final ImagePicker _picker = ImagePicker();

  // Pick image from camera
  static Future<XFile?> pickImageFromCamera({
    double? maxWidth,
    double? maxHeight,
    int imageQuality = 80,
  }) async {
    final hasPermission = await PermissionService.requestCameraPermission();
    
    if (!hasPermission) {
      throw Exception('Camera permission denied');
    }

    try {
      final XFile? image = await _picker.pickImage(
        source: ImageSource.camera,
        imageQuality: imageQuality,
        maxWidth: maxWidth ?? 1024,
        maxHeight: maxHeight ?? 1024,
      );
      
      if (image != null) {
        return await _cropImage(image);
      }
      return null;
    } catch (e) {
      throw Exception('Failed to pick image from camera: $e');
    }
  }

  // Pick image from gallery
  static Future<XFile?> pickImageFromGallery({
    double? maxWidth,
    double? maxHeight,
    int imageQuality = 80,
  }) async {
    final hasPermission = await PermissionService.requestPhotoPermission();
    
    if (!hasPermission) {
      throw Exception('Photo permission denied');
    }

    try {
      final XFile? image = await _picker.pickImage(
        source: ImageSource.gallery,
        imageQuality: imageQuality,
        maxWidth: maxWidth ?? 1024,
        maxHeight: maxHeight ?? 1024,
      );
      
      if (image != null) {
        return await _cropImage(image);
      }
      return null;
    } catch (e) {
      throw Exception('Failed to pick image from gallery: $e');
    }
  }

  // Pick multiple images
  static Future<List<XFile>> pickMultipleImages({
    int imageQuality = 80,
  }) async {
    final hasPermission = await PermissionService.requestPhotoPermission();
    
    if (!hasPermission) {
      throw Exception('Photo permission denied');
    }

    try {
      final List<XFile> images = await _picker.pickMultipleMedia(
        imageQuality: imageQuality,
      );
      return images;
    } catch (e) {
      throw Exception('Failed to pick multiple images: $e');
    }
  }

  // Crop image
  static Future<XFile?> _cropImage(XFile image) async {
    try {
      final croppedFile = await ImageCropper().cropImage(
        sourcePath: image.path,
        compressQuality: 100,
        uiSettings: [
          AndroidUiSettings(
            toolbarTitle: 'Crop Image',
            toolbarColor: Colors.white,
            statusBarColor: Colors.white,
            activeControlsWidgetColor: Colors.blue,
            hideBottomControls: false,
          ),
          IOSUiSettings(
            title: 'Crop Image',
          ),
        ],
      );
      
      return croppedFile != null ? XFile(croppedFile.path) : image;
    } catch (e) {
      return image; // Return original if crop fails
    }
  }

  // Compress image file
  static Future<File> compressImage(XFile file) async {
    // Implementation for image compression
    return File(file.path);
  }

  // Convert image to base64
  static Future<String> imageToBase64(XFile file) async {
    final bytes = await file.readAsBytes();
    return 'data:image/jpeg;base64,${base64Encode(bytes)}';
  }

  // Get file size
  static Future<int> getFileSize(XFile file) async {
    final File f = File(file.path);
    return f.lengthSync();
  }
}
```

### 3. Location Service

Create: `lib/services/location_service.dart`

```dart
import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';
import 'permission_service.dart';

class LocationService {
  // Get current location
  static Future<Position> getCurrentLocation({
    LocationAccuracy accuracy = LocationAccuracy.high,
  }) async {
    // Check if location service is enabled
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      throw Exception('Location services are disabled');
    }

    // Request permission
    final hasPermission = await PermissionService.requestLocationPermission();
    if (!hasPermission) {
      throw Exception('Location permission denied');
    }

    try {
      final position = await Geolocator.getCurrentPosition(
        desiredAccuracy: accuracy,
        timeLimit: const Duration(seconds: 30),
      );
      return position;
    } catch (e) {
      throw Exception('Failed to get location: $e');
    }
  }

  // Get location updates
  static Stream<Position> getLocationUpdates({
    LocationAccuracy accuracy = LocationAccuracy.high,
    int distanceFilter = 100, // meters
  }) {
    return Geolocator.getPositionStream(
      locationSettings: LocationSettings(
        accuracy: accuracy,
        distanceFilter: distanceFilter,
      ),
    );
  }

  // Get address from coordinates
  static Future<String> getAddressFromCoordinates({
    required double latitude,
    required double longitude,
  }) async {
    try {
      final placemarks = await placemarkFromCoordinates(latitude, longitude);
      
      if (placemarks.isNotEmpty) {
        final place = placemarks.first;
        return '${place.street}, ${place.locality}, ${place.administrativeArea}, ${place.country}';
      }
      return '$latitude, $longitude';
    } catch (e) {
      return '$latitude, $longitude';
    }
  }

  // Get coordinates from address
  static Future<List<Location>> getCoordinatesFromAddress(String address) async {
    try {
      return await locationFromAddress(address);
    } catch (e) {
      throw Exception('Address not found: $e');
    }
  }

  // Calculate distance between two points (in meters)
  static double calculateDistance({
    required double lat1,
    required double lon1,
    required double lat2,
    required double lon2,
  }) {
    return Geolocator.distanceBetween(lat1, lon1, lat2, lon2);
  }

  // Format location for API
  static Future<Map<String, String>> getFormattedLocation() async {
    try {
      final position = await getCurrentLocation();
      final address = await getAddressFromCoordinates(
        latitude: position.latitude,
        longitude: position.longitude,
      );

      return {
        'latitude': position.latitude.toString(),
        'longitude': position.longitude.toString(),
        'accuracy': position.accuracy.toString(),
        'address': address,
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

## Feature-Specific Implementations

### Profile Photo Upload with Permissions

```dart
Future<void> uploadProfilePhoto() async {
  try {
    // Show camera/gallery picker
    showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: Icon(Icons.camera),
              title: Text('Take Photo'),
              onTap: () async {
                Navigator.pop(context);
                await _pickFromCamera();
              },
            ),
            ListTile(
              leading: Icon(Icons.photo_library),
              title: Text('Choose from Gallery'),
              onTap: () async {
                Navigator.pop(context);
                await _pickFromGallery();
              },
            ),
          ],
        ),
      ),
    );
  } catch (e) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Error: $e')),
    );
  }
}

Future<void> _pickFromCamera() async {
  try {
    final image = await ImagePickerService.pickImageFromCamera();
    if (image != null) {
      await _uploadImage(image);
    }
  } catch (e) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Camera error: $e')),
    );
  }
}

Future<void> _pickFromGallery() async {
  try {
    final image = await ImagePickerService.pickImageFromGallery();
    if (image != null) {
      await _uploadImage(image);
    }
  } catch (e) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Gallery error: $e')),
    );
  }
}

Future<void> _uploadImage(XFile imageFile) async {
  try {
    setState(() => _isUploading = true);
    
    final formData = FormData.fromMap({
      'photo': await MultipartFile.fromFile(
        imageFile.path,
        filename: imageFile.name,
        contentType: MediaType('image', 'jpeg'),
      ),
    });

    await apiClient.post('/api/tenant-portal/upload-photo', data: formData);
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Photo uploaded successfully')),
    );
  } catch (e) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Upload error: $e')),
    );
  } finally {
    setState(() => _isUploading = false);
  }
}
```

### SOS Alert with Location

```dart
Future<void> triggerSOS() async {
  try {
    setState(() => _isLoadingLocation = true);
    
    // Get location with permission
    final location = await LocationService.getFormattedLocation();
    
    await apiClient.post(
      '/api/tenant-portal/sos-alerts',
      data: {
        'type': 'Emergency',
        'message': 'SOS triggered by tenant',
        'latitude': location['latitude'],
        'longitude': location['longitude'],
        'address': location['address'],
      },
    );
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('SOS Alert Triggered! Emergency services notified.'),
        backgroundColor: Colors.red,
      ),
    );
  } catch (e) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('SOS failed: $e')),
    );
  } finally {
    setState(() => _isLoadingLocation = false);
  }
}
```

---

## Offline Support & Local Storage

### Hive Setup for Local Storage

Create: `lib/models/offline_request.dart`

```dart
import 'package:hive/hive.dart';

part 'offline_request.g.dart';

@HiveType(typeId: 0)
class OfflineRequest extends HiveObject {
  @HiveField(0)
  late String method; // GET, POST, PATCH, DELETE

  @HiveField(1)
  late String endpoint;

  @HiveField(2)
  late Map<String, dynamic>? data;

  @HiveField(3)
  late DateTime timestamp;

  @HiveField(4)
  late int retryCount;
}
```

Run: `flutter pub run build_runner build`

### Offline Service

Create: `lib/services/offline_service.dart`

```dart
import 'package:hive/hive.dart';
import '../models/offline_request.dart';

class OfflineService {
  static final Box<OfflineRequest> _requestBox = Hive.box('offlineRequests');

  // Save failed request
  static Future<void> saveFailedRequest({
    required String method,
    required String endpoint,
    Map<String, dynamic>? data,
  }) async {
    final request = OfflineRequest()
      ..method = method
      ..endpoint = endpoint
      ..data = data
      ..timestamp = DateTime.now()
      ..retryCount = 0;

    await _requestBox.add(request);
  }

  // Get pending requests
  static List<OfflineRequest> getPendingRequests() {
    return _requestBox.values.toList();
  }

  // Sync all pending requests
  static Future<void> syncPendingRequests(Dio dio) async {
    final requests = getPendingRequests().toList();

    for (var request in requests) {
      try {
        switch (request.method.toUpperCase()) {
          case 'POST':
            await dio.post(request.endpoint, data: request.data);
            break;
          case 'PATCH':
            await dio.patch(request.endpoint, data: request.data);
            break;
          case 'PUT':
            await dio.put(request.endpoint, data: request.data);
            break;
          case 'DELETE':
            await dio.delete(request.endpoint);
            break;
        }

        // Remove successful request
        await request.delete();
      } catch (e) {
        // Update retry count
        request.retryCount++;
        await request.save();

        // Remove if exceeded max retries
        if (request.retryCount > 5) {
          await request.delete();
        }
      }
    }
  }

  // Clear all offline requests
  static Future<void> clearAll() async {
    await _requestBox.clear();
  }
}
```

---

## Troubleshooting

### Common Permission Issues

**Issue**: "Permission denied" even after requesting

**Solution**:
1. Check AndroidManifest.xml has all required permissions
2. Check ios/Runner/Info.plist has descriptions
3. Test on physical device (emulator may not handle permissions correctly)
4. Clear app data and reinstall

**Issue**: Location returns (0, 0)

**Solution**:
1. Enable location services on device
2. Grant "Allow all the time" permission
3. Wait 2-3 seconds for GPS to lock
4. Use lower accuracy (e.g., LocationAccuracy.low) if high doesn't work

**Issue**: Camera shows black screen

**Solution**:
1. Restart app
2. Check camera permission is granted in settings
3. Clear camera app cache
4. Test with another app's camera first

**Issue**: Images not uploading after selection

**Solution**:
1. Check file size (max 5MB recommended)
2. Verify storage permission
3. Ensure image format is JPEG/PNG
4. Check internet connectivity

### Testing Permissions

```dart
// Test all permissions
Future<void> testPermissions() async {
  final perms = await PermissionService.checkPermissions();
  
  perms.forEach((key, value) {
    print('$key: ${value ? 'GRANTED' : 'DENIED'}');
  });
}

// Request specific permission
Future<void> requestSpecificPermission(String permissionType) async {
  switch (permissionType) {
    case 'camera':
      await PermissionService.requestCameraPermission();
      break;
    case 'location':
      await PermissionService.requestLocationPermission();
      break;
    // ... other cases
  }
}
```

---

## Best Practices Checklist

✅ **Always do:**
- Check permission before accessing feature
- Handle permission denials gracefully
- Provide clear permission descriptions
- Test on both Android and iOS
- Request minimal permissions (principle of least privilege)
- Handle "Permanently Denied" state
- Provide fallback when permission not granted
- Store sensitive data securely (firebase_secure_storage)
- Compress images before upload
- Handle network errors for offline scenarios

❌ **Never do:**
- Force crash when permission denied
- Request unnecessary permissions
- Store tokens in SharedPreferences
- Upload uncompressed images
- Ignore offline state
- Save sensitive data in Hive unencrypted
- Request all permissions at once (request contextually)
- Ignore permission.isPermanentlyDenied state

---

*For complete API integration, refer to [API_FOR_FLUTTER.md](./API_FOR_FLUTTER.md)*
