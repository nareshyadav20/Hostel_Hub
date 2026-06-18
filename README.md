# 🏠 Livora Hostel Hub — Complete Platform Documentation & Workflows

Livora Hostel Hub is a premium, multi-tenant hostel management ecosystem designed to streamline interactions between tenants, property owners, platform administrators, on-ground staff, and third-party vendors. The system operates on a single shared Node.js/Express backend communicating with MongoDB, utilizing WebSockets (Socket.IO) for real-time synchronization.

---

## 🚀 Tech Stack Overview

- **Frontend Core**: React 18 with Vite, React Router v6, Axios (with request/response interceptors for JWT), Socket.IO client, Lucide React, and custom styling systems.
- **Backend Core**: Node.js & Express, MongoDB & Mongoose ODM, Socket.IO server, JWT auth session management, Multer (in-memory base64 image encoding), Nodemailer, compression (gzip), and express-rate-limit.
- **WebSocket Synchronization**: Active rooms mapped by building ID, owner ID, tenant ID, and user role. Includes duplicate socket termination handling.

---

## 📂 System Portal Hierarchy

The workspace is structured into **5 frontend applications** and **1 unified backend backend**:
```
Livora-Hostel-Hub/
├── backend/                 # Mongoose schemas, routes, controllers, and socket services
└── frontend/
    ├── tenant/              # Tenant / Resident facing public & protected portal
    ├── owner/               # Property Owner dashboard & asset management
    ├── admin/               # Super-Admin platform dashboard
    ├── staff/               # Operational portal for housekeeping and maintenance staff
    ├── partner/             # Portal for partner merchants, service providers, and vendors
```

---

## 💎 Platform Features Directory (Detailed Breakdown)

### 1️⃣ Tenant Portal Features

#### 🔍 Public Property Search & Discovery
- **Locality Search**: Search by locality name, city name, or hostel name with live input matching.
- **Interactive Multi-Level Filtering**: Filter listings by gender category (Boys, Girls, Unisex/Co-living), budget ranges (Under 8k, 8k-12k, 12k-18k, etc.), sharing options (1 to 6 sharing rooms), and dynamic amenities.
- **Dynamic Sort**: Sort listings by relevancy, pricing low-to-high, or pricing high-to-low.
- **Explore Map View**: Browse properties filtered by cities (Bengaluru, Hyderabad, Chennai, Delhi, Pune, Noida, Gurgaon).
- **Interactive Image Galleries**: View detailed, zoomable photos of the properties and rooms.
- **Local Caching System**: Explore listing data uses a local TTL cache (3 minutes) to ensure fast load times and minimal backend stress.
- **Live Room/Bed Availability Map**: See real-time counts of available beds, rooms, and floor configurations.
- **Policy Checker**: Review specific curfew rules, visitor timings, smoking restrictions, and deposit requirements.

#### 📅 Booking & Reservations
- **Interactive Booking Wizard**: Select check-in date, room configuration, deposit amount, and duration of stay.
- **Advance Token Payment**: Complete booking by paying token money online to secure a bed.
- **Booking Ledger**: View reservation status (Pending, Approved, Checked-In, Cancelled) and history.

#### 💳 Bills & Rent Payments
- **Online Rent Invoicing**: Clear view of monthly rent breakdown (room rent, food, maintenance, utilities).
- **Payment History Ledger**: Download transaction history, invoices, and payment receipts.
- **Dues Alerts**: In-app notifications when rent due dates approach.

#### 🍽️ Mess & Meal Planner
- **Weekly Meal Menu**: Browse breakfast, lunch, and dinner plans for every day of the week.
- **Daily Meal Toggles**: Toggle attendance (Opt-In or Opt-Out) for upcoming meals to help minimize food waste.
- **Meal Logs**: View attendance history of consumed meals.

#### 🎫 Complaint Helpdesk
- **Category-Based Ticketing**: File complaints under electrical, plumbing, WiFi, hygiene, or structural categories.
- **Multimedia Uploads**: Attach photos or screenshots to help explain maintenance issues.
- **Interactive Comments & Updates**: Message back and forth with property managers regarding complaint status.
- **Confidential Reporting**: Raise anonymous support tickets for sensitive policy violations or harassment without revealing identity.

#### 👤 Profile, Documents & KYC
- **KYC Document Vault**: Securely upload government IDs (Aadhaar, PAN, Passport) for background verification.
- **Verification Badging**: Visually verify profile completion and KYC approval status.
- **Profile Customization**: Manage contact information, profile photos, emergency contacts, and professional credentials.

#### 🎁 Rewards, Points & Referrals
- **Loyalty Rewards Wallet**: Accumulate platform points for paying rent on time, writing verified reviews, or referring friends.
- **Point Redemption**: Apply points for rent discounts or redeem coupons.
- **Referral Tracker**: Share unique referral links and track registration progress.

#### 🛡️ Emergency SOS & Safety
- **Emergency Panic Button**: Instantly trigger an SOS signal via websockets to notify building operators and safety personnel.
- **Contact Directory**: Access security desks, local police, fire service, and medical support.

#### 🔄 Room & Bed Transfers
- **Transfer Request Dashboard**: Submit transfer requests to swap rooms or beds within the same building or across wings.
- **Status Updates**: Receive updates as owners review, approve, or reject transfer applications.

---

### 2️⃣ Owner Dashboard Features

#### 🏢 Property Portfolio Management
- **Setup Wizard**: Build properties step-by-step, including name, location coordinates, category, and staff assignments.
- **Sub-Building Wings**: Link multiple wings or blocks under a single property ID for easier portfolio tracking.
- **Dynamic Amenity Assignment**: Toggle structural amenities (AC, Wi-Fi, Gym, Parking, Elevators, Fire Safety).
- **Interactive Floor Plan Designer**: Add/remove floors, rooms, and beds inside a visual editor.
- **Real-Time Occupancy Analytics**: Monitor occupancy stats (Total Beds, Occupied, Vacant, Maintenance) per building.

#### 👤 Tenant Administration
- **Tenant Registry**: Full tenant database searchable by room, check-in date, KYC status, and dues.
- **Offline Tenant Onboarding**: Manually onboard residents, designate rooms/beds, set custom rent values, and check-in dates.
- **Vacate & Check-Out Settlements**: Manage the move-out process, check-out dates, deposit refunds, and outstanding balances.
- **KYC Review Terminal**: Inspect uploaded government IDs and approve/reject tenant profiles.
- **Data Export**: Export tenant data to CSV or Excel for local audits.

#### 💰 Finance & Rent Ledger
- **Automatic Rent Generation**: Automate monthly rent invoices across active rooms.
- **Manual Payment Recorder**: Record cash, UPI, or offline payments and instantly update tenant balances.
- **Dynamic Late Fees & Charges**: Apply custom late-fee penalties or add-on bills (laundry, damage repair) to active invoices.
- **Digital Receipt Generator**: Print or email invoices directly from the dashboard.
- **Revenue Analytics**: Track gross revenue, outstanding rent dues, and collect patterns.

#### 🍽️ Mess Control Panel
- **Mess Menu Designer**: Create, edit, and publish weekly menus for your properties.
- **Procurement Planner**: Track daily opt-in/opt-out counts from tenants to plan grocery shopping and reduce waste.
- **Mess Log Audits**: View historical logs of mess hall attendance.

#### ⚙️ Operations, Staff & Tasks
- **Staff Registry**: Create and manage staff accounts (Security, Housekeeping, Chef, Manager).
- **Task Dispatcher**: Create and assign maintenance tasks to specific staff members with due dates.
- **Complaint Board**: View and resolve tenant maintenance complaints, assign tickets to staff, and post status updates.
- **Real-Time SOS Alerts Panel**: Instantly receive audio-visual alarms when a resident triggers an SOS panic button.

#### 📦 Inventory & Procurement
- **Asset Catalog**: Catalog items like appliances, furniture, and amenities assigned to specific rooms.
- **Condition Tracker**: Track asset conditions (Good, Needs Repair, Damaged).
- **Procurement Portal**: Request capital items or building supplies from platform admins.

---

### 3️⃣ Platform Admin Portal Features

#### 📊 Platform Analytics
- **Super Dashboard**: Track system-wide metrics, including total properties listed, registered owners, active tenants, and transaction volumes.
- **Geographic Coverage Mapping**: Monitor coverage across active cities.
- **Financial Settlements Panel**: Manage commission payouts to owners and track platform fees.

#### 🏢 Property & Account Auditing
- **Owner Verification Terminal**: Approve or freeze landlord accounts.
- **Property Listing Review**: Approve new hostel listings before they go public, or flag properties violating terms.
- **User Blacklisting**: Ban problematic tenant profiles or spam registrations system-wide.

#### ⚙️ CMS & Platform Customization
- **Homepage Builder**: Modify home screens, hero banners, testimonials, and FAQ listings.
- **Platform Offers & Coupon Engine**: Create system-wide discount coupons and promotional campaign codes.
- **Survey System**: Launch tenant feedback surveys to collect feedback and monitor satisfaction.

#### 🎫 Escalation Helpdesk
- **SLA Ticket Review**: Track unresolved support requests and complaints system-wide.
- **Subscription Billing**: Monitor and manage owner subscription plans (Basic, Pro, Enterprise).

---

### 4️⃣ Staff Operations Portal Features

- **Shift Attendance Log**: Log daily check-in and check-out times.
- **Assigned Tasks List**: View daily task lists (cleaning specific rooms, servicing ACs) with description and location details.
- **Task Complete Verification**: Mark tasks done and upload photo proof.
- **Inventory Check**: Report damaged inventory items to the property owner.

---

### 5️⃣ Vendor & Partner Portal Features

- **Storefront Setup**: List local partner services (Laundry, catering, bike rentals).
- **Order Dispatch Desk**: Receive and manage orders placed by hostel residents.
- **Promotional Deals**: Launch coupon codes exclusive to Livora residents.

---

## 🔄 Real-Time Sync & Socket Events

Websockets automate dashboard updates without manual reloads:
- `hostelUpdated`: Emitted when an owner edits a property's details. Refreshes listings globally.
- `newBooking` / `bookingUpdated`: Coordinates reservations between tenant requests and owner approvals.
- `complaintRaised` / `complaintUpdated`: Alerts staff and notifies tenants of ticket resolution.
- `notificationPush`: Pushes in-app alerts (rent due, notices) directly to target users.

---

## 🔧 Installation & Initialization

1. **Backend Configuration**:
   Create a `.env` in the `backend/` folder:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/hostelhub
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   EMAIL_USER=your_smtp_email@gmail.com
   EMAIL_PASS=your_smtp_app_password
   ```

2. **Run Services**:
   ```bash
   # Run Backend
   cd backend && npm install && npm run dev

   # Run Tenant Portal
   cd frontend/tenant && npm install && npm run dev

   # Run Owner Portal
   cd frontend/owner && npm install && npm run dev

   # Run Admin Portal
   cd frontend/admin && npm install && npm run dev
   ```
