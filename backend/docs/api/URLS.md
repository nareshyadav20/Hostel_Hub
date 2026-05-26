# Hostel Hub API Endpoint URLs

**Base Host:** `https://livora-hostel-hub.onrender.com/api`  
> 🔓 = Public (no auth). All others require `Authorization: Bearer <token>`.

---

### 🔑 Authentication
| Method | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| POST | `/auth/login` | 🔓 | Returns `{ token, user, tenantProfile }` |
| POST | `/auth/register` | 🔓 | Returns `{ token, user }` |

---

### 🏢 Property Management
| Method | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| GET | `/buildings/public` | 🔓 | Active hostels list — explore/search |
| GET | `/buildings/public/:id` | 🔓 | Single hostel detail |
| GET | `/buildings/public/stats` | 🔓 | Platform stats (tenants, properties, cities) |
| GET | `/buildings` | ✅ | Owner's buildings. `?lightweight=true` to skip nested data |
| GET | `/buildings/:id` | ✅ | Single building (owner scoped) |
| POST | `/buildings` | ✅ | Create building. Supports `multipart/form-data` for images |
| PATCH | `/buildings/:id` | ✅ | Update building. Supports `multipart/form-data` for images |
| DELETE | `/buildings/:id` | ✅ | Delete building |

---

### 🏘️ Layout (Floors / Rooms / Beds)
| Method | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| GET | `/floors/building/:buildingId` | ✅ | Floors for a building |
| POST | `/floors` | ✅ | Create floor |
| GET | `/rooms/:floorId` | ✅ | Rooms for a floor |
| POST | `/rooms` | ✅ | Create room |
| GET | `/beds` | ✅ | All beds. `?buildingId=` to filter |
| GET | `/beds/:roomId` | ✅ | Beds for a room |
| POST | `/beds` | ✅ | Create bed |
| PATCH | `/beds/:id/status` | ✅ | Update bed status (OCCUPIED / AVAILABLE) |

---

### 📅 Bookings
| Method | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| POST | `/bookings` | ✅ | Create booking. 400 if active booking exists |
| GET | `/bookings/me` | ✅ | Tenant's own bookings |
| GET | `/bookings` | ✅ | All bookings (owner scoped) |
| PUT | `/bookings/:id` | ✅ | Update booking status |

---

### 👥 Tenants
| Method | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| GET | `/tenants` | ✅ | All tenants (owner scoped) |
| GET | `/tenants/me` | ✅ | Current user's tenant profile |
| POST | `/tenants/bulk` | ✅ | Bulk create tenants |

---

### 💰 Payments
| Method | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| GET | `/payments` | ✅ | All payments (owner scoped) |
| GET | `/payments/me` | ✅ | Tenant's own payments |
| POST | `/payments` | ✅ | Create payment. Returns 201 with payment object |
| PATCH | `/payments/:id` | ✅ | Update payment status |

---

### 📣 Complaints
| Method | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| POST | `/complaints` | ✅ | Raise complaint |
| GET | `/complaints/me` | ✅ | Tenant's complaints |
| GET | `/complaints` | ✅ | All complaints (owner scoped) |
| PATCH | `/complaints/:id` | ✅ | Update complaint status |

---

### 🏘️ Tenant Portal
| Method | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| GET | `/tenant-portal/complete-profile` | ✅ | All-in-one profile aggregation |
| POST | `/tenant-portal/upload-photo` | ✅ | `multipart/form-data` (field: `photo`) **or** JSON `{ photoUrl: "base64..." }` |
| POST | `/tenant-portal/community-reports` | ✅ | Submit community report |
| GET | `/tenant-portal/community-reports` | ✅ | List community reports |
| POST | `/tenant-portal/sos-alerts` | ✅ | Trigger SOS alert |
| GET | `/tenant-portal/rewards/me` | ✅ | Tenant reward points |
| GET | `/tenant-portal/wishlist` | ✅ | Saved hostels |
| POST | `/tenant-portal/wishlist` | ✅ | Add to wishlist |
| DELETE | `/tenant-portal/wishlist/:id` | ✅ | Remove from wishlist |

---

### 🔧 Services
| Method | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| POST | `/services/laundry` | ✅ | Submit laundry request |
| POST | `/services/cleaning` | ✅ | Submit room cleaning request |
| POST | `/services/visitors` | ✅ | Log visitor |
| POST | `/services/leaves` | ✅ | Submit leave request |

---

### 🔔 Notifications
| Method | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| GET | `/notifications` | ✅ | All notifications for user |
| GET | `/notifications/unread-count` | ✅ | Unread count |
| PATCH | `/notifications/:id/read` | ✅ | Mark single as read |
| POST | `/notifications/mark-all-read` | ✅ | Mark all as read |

---

### 📊 Hostels (Occupancy Stats)
| Method | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| GET | `/hostels` | ✅ | Hostel records |
| GET | `/hostels/bed-stats` | ✅ | `?buildingId=` for bed occupancy stats |
| PATCH | `/hostels/:id/sync-beds` | ✅ | Recalculate filledBeds from live beds |

---

### 🔴 Real-time (Socket.io)
Connect to `https://livora-hostel-hub.onrender.com` (not `/api`).

| Event (emit) | Payload | Notes |
|--------------|---------|-------|
| `joinBuilding` | `buildingId` | Subscribe to building updates |
| `joinTenant` | `tenantId` | Subscribe to personal updates |

| Event (listen) | Triggered by |
|----------------|-------------|
| `newNotification` | Any notification created for user |
| `hostelUpdated` | Building/hostel data changed |
| `complaintStatusChanged` | Complaint status updated |
| `paymentUpdated` | Payment status changed |
| `tenantAdded` | New tenant booked |
| `sosCreated` | SOS alert triggered |

---

*See `API_FOR_FLUTTER.md` for Dart/Flutter Dio code examples.*
