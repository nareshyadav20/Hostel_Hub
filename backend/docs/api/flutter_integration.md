# Flutter Integration Guide (Dio)

Professional examples for integrating the Hostel Hub API into a Flutter mobile app.

## 1. Setup Dio Client
```dart
import 'package:dio/dio.dart';

class ApiService {
  final Dio _dio = Dio(BaseOptions(
    baseUrl: 'https://hostel-hub-1-0835.onrender.com/api',
    connectTimeout: Duration(seconds: 10),
    receiveTimeout: Duration(seconds: 10),
  ));

  ApiService() {
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) {
        // Add Token from Secure Storage
        String? token = "your_stored_token"; 
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
    ));
  }
}
```

## 2. Login Implementation
```dart
Future<Map<String, dynamic>> login(String email, String password) async {
  try {
    final response = await _dio.post('/auth/login', data: {
      'email': email,
      'password': password,
    });
    return response.data;
  } on DioException catch (e) {
    throw e.response?.data['message'] ?? 'Login failed';
  }
}
```

## 3. Multipart File Upload
```dart
Future<void> uploadIDProof(String filePath) async {
  FormData formData = FormData.fromMap({
    "file": await MultipartFile.fromFile(filePath, filename: "id_proof.jpg"),
  });

  await _dio.post('/owner/documents', data: formData);
}
```

## 4. API Calling Best Practices
- **Use Repository Pattern**: Separate API logic from UI.
- **Handling Token Expiry**: Use an interceptor to catch 401 errors and redirect to login.
- **Loading Indicators**: Always show a spinner while `await`ing an API call.
- **Error Handling**: Use `try-catch` blocks with specific `DioException` handling.
