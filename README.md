# MNSU CampusEco — Smart Campus Logistics System
 
**Course:** CIS 483 / CIS 583: Web Applications and User Interface Design  
**University:** Minnesota State University, Mankato  
**Instructor:** Dr. Suboh Alkhushayni  
**Term:** Fall 2026  
**Team Members:** Pratik Niroula, Zachary Gifford, Yeabsra Tetemke, Kirubel Dula  
 
---
 
## 1. Project Overview
 
**MNSU CampusEco** is a mission-critical, full-stack logistics management web application built to support Minnesota State University, Mankato's strategic initiative to reduce the campus carbon footprint by 40% over five years.
 
To eliminate independent commercial delivery couriers (such as UPS, FedEx, and Amazon) driving through pedestrian-heavy campus walkways, MNSU has implemented a centralized perimeter logistics hub. All inbound parcels, institutional mail, campus bookstore rentals, and departmental transfers arrive at this perimeter facility.
 
The **MNSU CampusEco** platform coordinates the sustainable transit of packages from the central hub to residence halls, student unions, administrative offices, and academic buildings using student delivery workers and an inventory of low-emission automated electric carts (**EcoCarts**).
 
---
 
## 2. Core System Portals & User Personas
 
The application serves three distinct user categories through dedicated views:
 
### 1. Central Hub Personnel Portal (`central-hub.html`)
* **Package Check-In:** Form to register incoming parcels with tracking barcodes, destination, package size, weight (lbs), and priority classification (*Normal* vs. *Urgent*).
* **Live KPI Counters:** Top summary cards showing *Total Packages*, *In Transit*, and *Delivered* counts that automatically update in real time.
* **Instant Table Search:** Client-side search filter that filters table rows on keystroke by tracking code or campus building.
* **Status Dropdown Transitions:** In-table dropdowns allowing operators to advance a package from *Received* to *Loaded*, *En Route*, or *Delivered*.
* **Live Dispatch Notes:** Real-time two-way data-binding panel powered by AngularJS for broadcast notes.
* **Audit Activity Log:** Chronological log tracking recent package check-ins and status changes with timestamps.
 
### 2. Campus Eco-Transit Crew Portal (`campus-eco.html`)
* **Vehicle Dashboard:** Displays current assigned electric cart (*EcoCart 04*), real-time battery status (*82%*), and active delivery counts.
* **Route Queue:** Table displaying assigned route stops, destinations, and urgency flags.
* **Claim Delivery Action:** "Claim Next Delivery" button automatically queries pending shipments and advances the next parcel to *Loaded*.
* **Step Advancement:** In-table "Next Step" buttons for couriers to advance parcels as they move along their campus route.
* **Vehicle Battery Report:** Submission form allowing student drivers to report live battery percentages and vehicle operating status (*Available*, *On Delivery*, *Charging*, *Maintenance*).
 
### 3. Campus End-Users Portal (`campus-endusers.html`)
* **Package Tracking:** Input form with regex validation (`pattern="[A-Za-z0-9]{8,20}"`) allowing students, faculty, and staff to look up deliveries.
* **Visual 4-Step Progress Tracker:** Dynamic milestone indicator with active CSS highlights:  
  `[1. Received]` &rarr; `[2. Loaded]` &rarr; `[3. En Route]` &rarr; `[4. Delivered]`
* **Delivery Preferences:** Options to select preferred drop-off locations (*Residence Hall*, *Campus Locker*, *Department Office*) with email and delivery notification checkboxes.
* **Environmental Impact Metrics:** Highlights carbon footprint savings: *CO₂ Saved (lbs)*, *Electric Delivery Miles*, and *Eco Deliveries Completed*.
 
---
 
## 3. Architecture & Phase Implementations
 
### Phase 1: Frontend Foundations & Static UI Layout
* **HTML5 Semantic Markup:** Structured templates using `<header>`, `<nav>`, `<main>`, `<section>`, `<table>`, and `<footer>`.
* **CSS Grid & Flexbox:** Robust responsive layout system in `style.css` using an MNSU campus green palette (`--primary: #1f7a5c`).
* **HTML5 Form Validation:** Enforced required inputs, numeric bounds (0.1–100 lbs weight, 0–100% battery), and regex patterns.
* **Mobile-First Responsive Design:** Advanced `@media` queries adapting desktop grid dashboards into readable linear stacks on mobile devices.
 
### Phase 2: Client-Side Interactivity, Event Architectures & Storage
* **System Models (Task 2.1):** Custom JavaScript constructor functions:
  * `Package(tracking, destination, size, weight, priority, status)`
  * `Vehicle(id, name, battery, status)`
  * `EcoCourier(id, name, vehicleId)`
* **Non-Reloading Event Handlers:** Forms intercepted via `event.preventDefault()` to update UI state without page flashes.
* **jQuery DOM Manipulation (Task 2.2):** jQuery 3.7.1 integration for animated alerts (`slideDown()`), smooth row updates, and live search filtering.
* **Local Storage Persistence:** Browser `localStorage` engine simulating a client database so records persist seamlessly between portal navigations.
 
### Phase 3: Server Backends, Live Endpoints, Databases & Frameworks
* **Node.js Server Runtime (`server.js`):** Lightweight, zero-dependency Node.js HTTP server hosting static files and REST API endpoints (`/api/packages`, `/api/vehicles`, `/api/telemetry`).
* **Real-Time Telemetry Feed (Task 3.2):** `/api/telemetry` endpoint streaming simulated real-time GPS coordinates, speed, and battery drain for active EcoCarts.
* **Relational Database Engine (`database/schema.sql`):** Normalized MySQL/MariaDB database schema with tables for `packages`, `vehicles`, `transit_events`, and `users`.
* **Secure PHP Data Access Layer (`api/`):** REST API endpoints (`api/db.php`, `api/packages.php`, `api/vehicles.php`) utilizing PDO parameterized prepared statements to prevent SQL injection and cross-site scripting (XSS).
* **AngularJS Client Data Binding (`live-dispatch.js`):** Two-way data binding (`ng-app="campusEcoLive"`, `ng-model`, `ng-bind`) for the Central Hub live dispatch notes panel.
* **Dual-Mode Asynchronous AJAX Engine (`app.js`):** Communicates with REST APIs asynchronously over HTTP, while automatically falling back to local memory if previewed offline or via `file://`.
 
---
 
## 4. Project Directory Structure
 
```text
FinalProject/
├── index.html              # Main landing portal & module gateway
├── central-hub.html        # Central Hub operator view & dispatch
├── campus-eco.html         # Eco-Transit driver route & vehicle portal
├── campus-endusers.html    # Student/staff package tracking & preferences
├── style.css               # Central stylesheet (Grid, Flexbox, responsive)
├── app.js                  # Client application, models, DOM events & AJAX engine
├── live-dispatch.js        # AngularJS controller for two-way dispatch data binding
├── server.js               # Node.js server runtime, REST API & telemetry feed
├── package.json            # Node.js project manifest & scripts
├── database/
│   └── schema.sql          # MySQL/MariaDB relational database schema
└── api/
    ├── db.php              # Secure PHP PDO database connection
    ├── packages.php        # PHP REST endpoint for package CRUD & status
    └── vehicles.php        # PHP REST endpoint for vehicle battery & state
```
 
---
 
## 5. How to Run the Application
 
### Option 1: Node.js Server (Recommended for Full Phase 3 Features)
Requires only standard Node.js (no extra npm packages needed):
```bash
cd FinalProject
node server.js
```
Open your browser to: **`http://localhost:3000`**
 
**Active Endpoints:**
* Web Portal: `http://localhost:3000`
* Packages API: `http://localhost:3000/api/packages`
* Telemetry Feed: `http://localhost:3000/api/telemetry`
* Vehicle Status: `http://localhost:3000/api/vehicles`
 
### Option 2: PHP Built-In Server (For MySQL/PHP Testing)
```bash
cd FinalProject
php -S localhost:8000
```
Open your browser to: **`http://localhost:8000`**
 
### Option 3: Direct Browser Opening (Phase 1 & 2 Preview)
Open [index.html](file:///Users/pratik_n/Desktop/cis483/FinalProject/index.html) directly in any modern browser:
```bash
open FinalProject/index.html
```
 
---
 
## 6. REST API Reference
 
| Endpoint | Method | Description | Sample Request / Response |
| :--- | :---: | :--- | :--- |
| `/api/packages` | `GET` | Returns list of all packages (or query single with `?tracking=PKG10234`). | `[{ "tracking": "PKG10234", "destination": "Julia Sears", ... }]` |
| `/api/packages` | `POST` | Registers a new package into the system. | `POST {"tracking": "PKG99999", "destination": "Trafton", "weight": 4.5}` |
| `/api/packages` | `PUT` | Updates transit status of an existing package. | `PUT {"tracking": "PKG10234", "status": "En Route"}` |
| `/api/vehicles` | `GET` | Retrieves vehicle status and battery percentage. | `{"cart_code": "cart04", "name": "EcoCart 04", "battery": 82}` |
| `/api/vehicles` | `PUT` | Updates vehicle battery and operating state. | `PUT {"cart_code": "cart04", "battery": 95, "status": "Available"}` |
| `/api/telemetry` | `GET` | Broadcasts simulated real-time GPS coordinates and speed. | `{"vehicle": "EcoCart 04", "speed": "8.5 mph", "gps": {"lat": 44.1472, ...}}` |
 
---
 
## 7. Relational Database Schema (MySQL)
 
* **`vehicles` Table:** Stores EcoCart cart code, name, battery level (0–100), and operating status.
* **`packages` Table:** Stores package tracking numbers, destination buildings, weight, size category, urgency priority, and current transit status.
* **`transit_events` Table:** Chronological audit log of all package milestone transitions and driver actions with foreign keys to packages.
* **`users` Table:** Stores authorized operator and courier credentials with bcrypt-compatible password hashes.
 
To import the database in MySQL:
```bash
mysql -u root -p < database/schema.sql
```
 
---
 
## 8. Team Roles & Contributions
 
* **Pratik Niroula:** Engineered client-side JavaScript architecture (`app.js`), Task 2.1 system models (`Package`, `Vehicle`, `EcoCourier`), Node.js server runtime (`server.js`), simulated telemetry feed, relational MySQL schema (`database/schema.sql`), and PHP PDO REST API endpoints (`api/`).
* **Zachary Gifford:** Designed the CSS design system (`style.css`), responsive media queries, Central Hub operator layout (`central-hub.html`), and initial repository coordination.
* **Yeabsra Tetemke:** Authored the HTML templates for Eco-Transit (`campus-eco.html`) and Recipient Tracking (`campus-endusers.html`), designed the 4-step progress tracker, and created initial project documentation.
* **Kirubel Dula:** Conducted cross-browser validation (Chrome, Safari, Firefox), mobile viewport testing, API payload verification, and presentation slide drafting.
