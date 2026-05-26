# 📱 Hostel Hub API Reference for Flutter (Dio)

**Base URL**: `https://livora-hostel-hub.onrender.com`

## 📋 Common Settings
- **Headers**
  ```dart
  dio.options.headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <YOUR_JWT_TOKEN>', // add when auth required
  };
  ```
- **Error handling template**
  ```dart
  try {
    final response = await dio.get('/example');
    // use response.data
  } on DioException catch (e) {
    if (e.response?.statusCode == 401) {
      // token expired – redirect to login
    } else {
      print('Error: ${e.response?.data['message']}');
    }
  }
  ```

---

## 🔐 Authentication

### 1️⃣ Login
- **Method**: `POST`
- **Endpoint**: `/api/auth/login`
- **Request Body**
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Response** (`200`)
  ```json
  {
    "user": {"_id": "...", "name": "...", "role": "OWNER"},
    "token": "<jwt-token>",
    "tenantProfile": null
  }
  ```
- **Dio call**
  ```dart
  final resp = await dio.post('/api/auth/login', data: {
    'email': email,
    'password': password,
  });
  final token = resp.data['token'];
  ```

### 2️⃣ Register
- **Method**: `POST`
- **Endpoint**: `/api/auth/register`
- **Request Body**
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword",
    "name": "Full Name",
    "role": "TENANT",
    "phone": "9876543210"
  }
  ```
- **Response** (`201`)
  ```json
  {
    "user": {"_id": "...", "email": "..."},
    "token": "<jwt-token>"
  }
  ```
- **Dio call**
  ```dart
  final resp = await dio.post('/api/auth/register', data: {
    'email': email,
    'password': password,
    'name': name,
    'role': 'TENANT',
    'phone': phone,
  });
  ```

---

## 🏢 Buildings

### 3️⃣ Get All Buildings
- **Method**: `GET`
- **Endpoint**: `/api/buildings`
- **Auth**: Required
- **Dio call**
  ```dart
  final resp = await dio.get('/api/buildings');
  final buildings = resp.data as List<dynamic>;
  ```

### 4️⃣ Create Building (multipart)
- **Method**: `POST`
- **Endpoint**: `/api/buildings`
- **Auth**: Required
- **Request**: `multipart/form-data` with fields `name`, `address`, `startingPrice`, `genderType` and `images` (list of files).
- **Dio call**
  ```dart
  FormData form = FormData.fromMap({
    'name': name,
    'address': address,
    'startingPrice': startingPrice,
    'genderType': genderType,
    'images': [
      await MultipartFile.fromFile(imagePath1, filename: 'img1.jpg'),
      await MultipartFile.fromFile(imagePath2, filename: 'img2.jpg'),
    ],
  });
  final resp = await dio.post('/api/buildings', data: form);
  ```

---

## 🛌 Rooms & Beds

### 5️⃣ Get Rooms by Floor
- **Method**: `GET`
- **Endpoint**: `/api/rooms/:floorId`
- **Auth**: Required
- **Dio call**
  ```dart
  final resp = await dio.get('/api/rooms/$floorId');
  final rooms = resp.data as List<dynamic>;
  ```

### 6️⃣ Create Bed
- **Method**: `POST`
- **Endpoint**: `/api/beds`
- **Auth**: Required
- **Request Body**
  ```json
  { "bedNumber": "A1", "roomId": "..." }
  ```
- **Dio call**
  ```dart
  final resp = await dio.post('/api/beds', data: {
    'bedNumber': bedNumber,
    'roomId': roomId,
  });
  ```

---

## 📅 Booking

### 7️⃣ Create New Booking
- **Method**: `POST`
- **Endpoint**: `/api/bookings`
- **Auth**: Required
- **Request Body**
  ```json
  {
    "tenantId": "...",
    "buildingId": "...",
    "category": "Standard",
    "moveInDate": "2026-06-01",
    "totalAmount": 15000
  }
  ```
- **Dio call**
  ```dart
  final resp = await dio.post('/api/bookings', data: {
    'tenantId': tenantId,
    'buildingId': buildingId,
    'category': category,
    'moveInDate': moveInDate,
    'totalAmount': totalAmount,
  });
  ```

---

## 💰 Payments

### 8️⃣ Get My Payments
- **Method**: `GET`
- **Endpoint**: `/api/payments/me`
- **Query Params**: optional `tenantId`
- **Auth**: Required
- **Dio call**
  ```dart
  final resp = await dio.get('/api/payments/me', queryParameters: {
    if (tenantId != null) 'tenantId': tenantId,
  });
  final payments = resp.data as List<dynamic>;
  ```

---

## 🏘️ Tenant Portal (Community & Support)

### 9️⃣ Raise Complaint
- **Method**: `POST`
- **Endpoint**: `/api/complaints`
- **Auth**: Required
- **Request Body**
  ```json
  { "title": "...", "description": "...", "category": "...", "priority": "..." }
  ```
- **Dio call**
  ```dart
  final resp = await dio.post('/api/complaints', data: {
    'title': title,
    'description': description,
    'category': category,
    'priority': priority,
  });
  ```

### 🔟 Community Report (Incident Reporting)
- **Method**: `POST`
- **Endpoint**: `/api/tenant-portal/community-reports`
- **Auth**: Required
- **Request Body** (example)
  ```json
  { "type": "...", "details": "...", "location": "..." }
  ```

### 1️⃣1️⃣ Upload Profile Photo
- **Method**: `POST`
- **Endpoint**: `/api/tenant-portal/upload-photo`
- **Auth**: Required
- **Request Body**
  ```json
  { "photoUrl": "data:image/jpeg;base64,..." }
  ```
- **Dio call**
  ```dart
  final resp = await dio.post('/api/tenant-portal/upload-photo', data: {
    'photoUrl': base64String, // or a hosted URL
  });
  ```

---

## 📦 Miscellaneous

- **File Upload (generic)**
  ```dart
  FormData form = FormData.fromMap({
    'file': await MultipartFile.fromFile(path, filename: 'myfile.jpg'),
  });
  final resp = await dio.post('/upload', data: form);
  ```

---

*Keep the `Authorization` header up‑to‑date after login. All protected routes return `401` when the token is missing/invalid.*

*For any missing endpoint, check `backend/routes/` directory in the repository.*
