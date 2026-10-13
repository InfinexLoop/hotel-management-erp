# Hotel Management ERP — InfinexLoop

> Enterprise Hospitality & Property Management System (PMS) Demonstration Platform.

An interactive, responsive, frontend-only Hotel Management ERP demonstration application engineered for **InfinexLoop**'s client presentations.

---

## 🌟 Key Modules & Features

- **Executive Dashboard**: Real-time property occupancy metrics, 5 top KPIs, room status multi-segment progress bar, Recharts weekly revenue curves, and express actions.
- **Room Inventory**: Interactive grid and list views, floor filters, dynamic room status transitions (*Available*, *Occupied*, *Cleaning*, *Maintenance*), and room registration modal.
- **Reservations & Stays**: Comprehensive booking folio management, arrival dates, guest details, and 1-click check-in/out workflows.
- **Guest Profiles & CRM**: Guest directory with lifetime value tracking, nationality tags, VIP badges, and booking history inspection.
- **Front Desk Check-In & Check-Out**: Expected arrivals queue, ID validation, RFID keycard issuance, folio balance settlement, and automatic housekeeping turnover dispatch.
- **Housekeeping & Facilities**: Room turnover board, 1-click cleaning completion that flips rooms back to *Available*, and facilities maintenance ticket tracking.
- **Billing & Folios**: Invoices list, folio settlement, payment status badges, and official printable receipt generator.
- **Staff & HR**: Department rosters (*Front Desk*, *Housekeeping*, *Maintenance*, *Management*, *Food & Beverage*), daily attendance tracking, and monthly payroll allocation.
- **Hospitality Analytics & Reports**: Industry-standard **ADR ($194.50)** and **RevPAR** metrics, 12-month revenue curve, category share donut chart, and 1-click CSV report export.
- **Room Tape Calendar**: Visual Gantt tape chart mapping rooms across timeline dates with interactive booking inspection.
- **Operational Alerts Feed**: Real-time notifications for arrivals, turnover completion, and maintenance flags.
- **System Settings (Admin Only)**: Property profile, tax configuration, custom sidebar gradient theme picker, and 1-click **Reset Demo Data** tool.

---

## 🔑 Demo Access Credentials

The login screen includes 1-click quick-login buttons:

| Role | Demo Email | Demo Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@hotel.com` | `admin123` | Full access across all 13 modules, system settings, and demo data reset |
| **Property Manager** | `manager@hotel.com` | `manager123` | Operational access across Front Desk, Bookings, Housekeeping, Billing, and Reports (*Settings restricted*) |

---

## 🛠️ Technology Stack

- **Framework**: React 18.3 (TypeScript)
- **Bundler**: Vite 5.4
- **Styling**: Tailwind CSS 3.4
- **Routing**: React Router 6.28
- **Icons**: Lucide React
- **Data Visualizations**: Recharts 2.13
- **State & Persistence**: React Context API with `localStorage`
- **Package Manager**: pnpm

---

## 🚀 Local Development

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Start the development server**:
   ```bash
   pnpm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

3. **Build for production**:
   ```bash
   pnpm run build
   ```

4. **Run TypeScript check**:
   ```bash
   pnpm run lint
   ```

---

## ☁️ Cloudflare Pages Deployment

This project is structured as a static Single Page Application (SPA):

- **Build command**: `pnpm run build`
- **Build output directory**: `dist`
- **Client-side routing**: Pre-configured via `public/_redirects` (`/*  /index.html  200`) for seamless client-side routing on direct navigation and refreshes.

---

## 📄 License & Attribution

Developed by **[InfinexLoop](https://infinexloop.com)**. All rights reserved.
