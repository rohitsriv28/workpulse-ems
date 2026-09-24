# Enterprise Workforce Management System (EMS) — Frontend Client

An enterprise-grade, multi-role workforce management web application built with **React 19**, **TypeScript 5.9**, **Vite 7**, and **Tailwind CSS v4**.

Designed for enterprise operational scale, this client delivers tailored experiences across four distinct organizational roles (`ADMIN`, `HR`, `MANAGER`, and `EMPLOYEE`), featuring full workforce onboarding, real-time punctuality tracking, leave approvals, payroll period lifecycles, performance OKRs, security audit trails, and a context-aware AI HR Assistant.

---

## 🚀 Key Features

### 1. Multi-Role Dashboards & Role-Based Access Control (RBAC)

- **Centralized Permission Matrix**: Complete RBAC engine in `src/lib/permissions.ts` dynamically generates role-adaptive navigation menus for Sidebar and Mobile Bottom Bar.
- **Admin Dashboard**: Organization telemetry, headcount distribution charts, system security health, and real-time security audit event stream.
- **HR Dashboard**: Workforce presence counters, punctuality alerts, live attendance feed, and a prioritized **"Needs Attention"** triage queue (pending leaves, corrections, payroll cycles).
- **Manager Dashboard**: Scoped to direct reports; displays real-time team punch status, pending team leave requests with one-click decision triggers, and sprint deliverables.
- **Employee Dashboard**: Interactive 4-state punch card (Check In, Start Break, End Break, Check Out) with live elapsed timer, leave quota summaries, next company holiday, and recent payslip snapshot.
- **Live Demo Role Switcher**: Instant switching between Admin (`Vikram Malhotra`), HR (`Priya Sharma`), Manager (`Rahul Verma`), and Employee (`Ananya Patel`) via the header dropdown.

### 2. Employee Management, 5-Step Onboarding & Profile 360

- **Organization Directory**: Full search by name, email, or employee ID, paired with multi-select department and employment status filters.
- **5-Step Onboarding Wizard** (`EmployeeOnboardingModal`):
  1. _Personal Details_: Full name, corporate email, phone, residential address.
  2. _Employment Details_: Designation, date of joining, employment status.
  3. _Organization Assignment_: Department selection, reporting manager hierarchy.
  4. _Compensation & Bank Details_: Base salary, allowances, bank account, IFSC code.
  5. _Confirmation_: Summary card with one-click creation and automated audit log entry.
- **360° Employee Context Viewer** (`EmployeeProfile`): 6-tab modal inspection:
  - _Overview_: Identity, job metadata, reporting line, compensation overview.
  - _Attendance_: Historical workday logs, timestamps, hours worked, and late arrival flags.
  - _Leave_: Quota progress bars for Annual, Casual, and Sick leaves, plus application history.
  - _Compensation_: Itemized earnings, statutory deductions, net pay, and bank transfer details.
  - _Documents_: Repository of employee files with category tags and download triggers.
  - _Performance_: Active quarterly OKRs, progress completion sliders, and manager notes.

### 3. Attendance Operations & Punctuality Engine

- **Attendance Roster**: Departmental presence table with date picker and status filtering (`PRESENT`, `ABSENT`, `HALF_DAY`, `LATE`, `WFH`, `ON_LEAVE`).
- **Punctuality Tracking**: 15-minute grace period enforcement (arrivals after 09:15 AM marked `LATE` with calculated late minutes).
- **Punch Dispute & Correction Modal** (`AttendanceCorrectionModal`): Enables employees to request punch adjustments with reason and proposed hours; supervisors can approve or reject disputes with audit logging.
- **Personal Ledger** (`MyAttendance`): Employee workday history with status chips and dispute triggers.

### 4. Leave Management & Approval Workflows

- **Personal Leave Hub** (`MyLeavePage`): Quota tracking cards showing total, used, and remaining allocations (Annual: 18 days, Casual: 12 days, Sick: 10 days), with application history and cancellation.
- **Apply Leave Dialog** (`LeaveRequestModal`): Date selection excluding weekends, half-day toggle with Morning (Session 1) and Afternoon (Session 2) selection, and reason submission.
- **Manager Approval Queue** (`LeaveApprovalsPage`): Review workflow for managers and HR with mandatory decision comments and instant quota deduction/restoration.
- **Company Leave Registry** (`LeaveManagementPage`): Company-wide leave history for HR administrators.

### 5. Shift Schedules & Corporate Holiday Calendar

- **Shift Schedules** (`SchedulesPage` & `MySchedulePage`): Configurable shift timings (`SCH01` General Morning 09:00–18:00, `SCH02` Flexible Engineering 10:00–19:00), core collaboration hours, break allowances, and 15-minute grace settings.
- **Holiday Calendar** (`HolidayCalendarPage`): 2026 holiday calendar with countdown indicators, day-of-week badges, location tagging, and mandatory vs. optional filters.

### 6. Payroll Period Lifecycle & Printable Payslips

- **Period Management** (`PayrollPage`): 4-stage period lifecycle manager (`DRAFT` → `REVIEW` → `LOCKED` → `PUBLISHED`).
- **Mathematical Deduction Engine** (`src/lib/payroll.ts`):
  - 3-day paid leave threshold rule (first 3 approved leaves are paid; excess leaves and unexcused absences trigger automated salary deductions).
  - Half-day deductions calculated at 50% of the employee's daily rate (`0.5 * dailyRate`).
- **Itemized Payslip Modal** (`PayslipDetailModal`): Side-by-side earnings and statutory deductions breakdown, net take-home in localized currency format (INR `₹`), and a direct browser print trigger (`window.print()`) configured with print-optimized CSS media queries.
- **My Payslips** (`MyPayslipsPage`): Employee portal to inspect and print historical payslips.

### 7. Governance, Documents, Performance & Audit

- **Document Management** (`DocumentsPage` & `MyDocumentsPage`): Categorized document repository (`CONTRACT`, `TAX_DECLARATION`, `ID_PROOF`, `APPRAISAL`, `CERTIFICATION`) with upload simulation modal (`DocumentUploadModal`).
- **Performance OKRs** (`PerformancePage` & `MyPerformancePage`): Quarterly goal tracking with interactive progress sliders (0–100%) and manager review notes.
- **Company Announcements** (`AnnouncementsPage`): Priority-tagged bulletin board (`URGENT`, `POLICY`, `HOLIDAY`, `GENERAL`) with role targeting.
- **Analytical Reports** (`ReportsPage`): 4 analytical tabs (Attendance Summary, Punctuality Trends, Leave Utilization, Payroll Expenditure) featuring instant client-side CSV downloads via the browser Blob API.
- **Security Audit Logs** (`AuditLogsPage`): Filterable audit trail recording user identity, action, resource, IP address, and timestamp, with CSV export.
- **Self-Service Profile** (`UserProfilePage`): Self-editable contact details (phone, mailing address) alongside read-only HR employment attributes.
- **Organization Settings** (`SettingsPage`): Workweek policy rules, grace period configuration, security settings, and notification channels.

### 8. Context-Aware AI HR Assistant

- **Slide-Over Assistant Drawer** (`HRAssistantDrawer`): Natural language assistant accessible from any screen via the top header trigger.
- **Context-Aware Query Engine** (`src/lib/api/ai.ts`): Grounded in active session context, live leave balances, upcoming holidays, payslips, and HR policy rules.
- **Citations & Deep Links**: Generates structured answers with official policy citations (e.g. `[HR Policy Manual §4.2]`) and interactive deep-link action buttons (e.g., `Apply for Leave`, `View My Schedule`, `Download Payslip`).

### 9. Complete Barcode & Scanner Purge

- All legacy hardware scanner components, barcode generation models, scanner hooks (`useBarcodeScanner`), camera feeds, scanner routes, and icons have been **100% removed**.

---

## 🛠️ Tech Stack

| Layer                | Technology                                                   | Details                                                              |
| :------------------- | :----------------------------------------------------------- | :------------------------------------------------------------------- |
| **Framework**        | [React 19](https://react.dev/)                               | Modern functional components, hooks, React 19 architecture           |
| **Language**         | [TypeScript ~5.9](https://www.typescriptlang.org/)           | Strict compiler options (`"strict": true`, `"noUnusedLocals": true`) |
| **Build Tool**       | [Vite ^7.3](https://vitejs.dev/)                             | Lightning-fast HMR, route-level code splitting (`React.lazy`)        |
| **Styling**          | [Tailwind CSS v4](https://tailwindcss.com/)                  | Tailwind v4 with `@theme` CSS custom properties in `src/index.css`   |
| **Routing**          | [React Router DOM v7](https://reactrouter.com/)              | SPA client-side routing, protected layout shell, 18 lazy routes      |
| **State Management** | [TanStack React Query v5](https://tanstack.com/query/latest) | Async query client initialized in `main.tsx`                         |
| **Forms**            | [React Hook Form](https://react-hook-form.com/)              | Performant uncontrolled forms in onboarding & modals                 |
| **Icons**            | [Lucide React](https://lucide.dev/)                          | Clean, accessible vector SVG iconography                             |
| **Date Arithmetic**  | [date-fns](https://date-fns.org/)                            | Comprehensive date parsing, formatting, and duration math            |
| **Utilities**        | `clsx`, `tailwind-merge`                                     | Conditional class composition utility via `cn()`                     |

---

## 📂 Project Structure

```text
src/
├── assets/                  # Branding images and corporate logos
├── components/              # Shell and shared UI components
│   ├── Header.tsx           # Role switcher, notifications dropdown, AI drawer trigger
│   ├── Sidebar.tsx          # Desktop navigation with role-filtered links
│   ├── MobileBottomNav.tsx  # Sticky mobile bottom bar + "More" overflow sheet
│   └── ui/                  # Design system primitives (Badge, Modal, StatCard, EmptyState)
├── context/
│   └── AuthContext.tsx      # Auth state, persistent session restoration & role switcher
├── features/                # Domain-driven feature modules
│   ├── ai/                  # AI Assistant slide-over drawer
│   ├── announcements/       # Company bulletin board & priority announcements
│   ├── attendance/          # Punch clock, punctuality ledger & correction dispute modal
│   ├── auth/                # Login, password recovery, route guards
│   ├── dashboard/           # Role-specific dashboards (Admin, HR, Manager, Employee)
│   ├── documents/           # Organization document repository & upload modal
│   ├── employees/           # 5-step onboarding wizard & 360° employee profile viewer
│   ├── holidays/            # 2026 corporate holiday calendar
│   ├── leave/               # Quota balances, apply modal, approvals queue & registry
│   ├── payroll/             # Period lifecycle manager, payslip cards & printable modal
│   ├── performance/         # Quarterly OKR goals & progress sliders
│   ├── schedules/           # Shift schedules & weekly working hours roster
│   └── settings/            # Organization policies, grace settings & notifications
├── layouts/
│   └── MainLayout.tsx       # Master shell assembling Sidebar, Header, MobileNav, Outlet, AI Drawer
├── lib/
│   ├── api/                 # Typed API gateway, enterprise local store & AI engine
│   │   ├── ai.ts            # Natural language policy reasoning & citation generator
│   │   ├── client.ts        # Typed domain API gateway with simulated network latency
│   │   └── store.ts         # Enterprise LocalStorage store seeded with multi-role data
│   ├── payroll.ts           # Pure mathematical deduction engine (3-day paid rule, half-days)
│   ├── permissions.ts       # RBAC permission matrix & getNavigationForRole() generator
│   ├── queryClient.ts       # TanStack QueryClient singleton instance
│   └── utils.ts             # Currency (INR ₹), date, time, and class composition utilities
├── pages/                   # Route switchboards and full-page views
│   ├── AttendancePage.tsx   # Organization roster, exceptions & dispute review
│   ├── AuditLogsPage.tsx    # Security event ledger with live CSV export
│   ├── Dashboard.tsx        # Switchboard rendering role-specific dashboard
│   ├── EmployeesPage.tsx    # Employee directory with search, filters & onboarding
│   ├── ReportsPage.tsx      # Analytical reports with client-side CSV downloads
│   └── UserProfilePage.tsx  # Self-service contact edit screen
├── types/
│   └── index.ts             # Central TypeScript domain interfaces
├── App.tsx                  # Application routing tree with 18 lazy-loaded route chunks
├── index.css                # Global design system tokens (@theme)
└── main.tsx                 # DOM bootstrap & React root rendering entry point
```

---

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ or latest LTS)
- [npm](https://www.npmjs.com/) or [Bun](https://bun.sh/)

### Installation

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the Vite development server:

```bash
npm run dev
```

The application will be available at **`http://localhost:3000`**.

> **Note**: Vite is preconfigured on port `3000` in `vite.config.ts`. If running the NestJS backend concurrently, run the backend on port `3001` or `8080`.

### Production Build & Verification

Compile TypeScript and build the production bundle:

```bash
npm run build
```

This runs `tsc && vite build`, ensuring zero type errors and generating optimized, code-split route chunks in `dist/`.

Preview the production build locally:

```bash
npm run preview
```

---

## 👥 Demo Accounts & Role Switcher

The client includes persistent multi-role demo data stored in browser `localStorage`. You can immediately switch between roles using the **Role Switcher** dropdown in the top header, or log in with any of the following credentials:

| Role         | Name            | Email                    | Password     | Primary Capabilities                                                           |
| :----------- | :-------------- | :----------------------- | :----------- | :----------------------------------------------------------------------------- |
| **Admin**    | Vikram Malhotra | `admin@ems.corporate`    | `admin123`   | Organization telemetry, audit logs, system settings, all modules               |
| **HR**       | Priya Sharma    | `hr@ems.corporate`       | `hr123`      | Onboarding wizard, attendance exceptions, leave management, payroll processing |
| **Manager**  | Rahul Verma     | `manager@ems.corporate`  | `manager123` | Direct reports roster, punch status, leave approval queue, team OKRs           |
| **Employee** | Ananya Patel    | `employee@ems.corporate` | `emp123`     | Punch card clock, punch corrections, leave application, printable payslips     |

---

## 🔌 Backend Integration Architecture

All UI components interact with data exclusively through the typed gateway in [`src/lib/api/client.ts`](file:///d:/Workspace/AttendanceProject/attendance-management/client/src/lib/api/client.ts).

To connect to a live NestJS / REST backend:

1. Configure `baseURL` and authentication interceptors (JWT Bearer tokens) in `client.ts`.
2. Swap the internal `store.ts` calls inside `client.ts` with `axios` or native `fetch` requests.
3. **No UI components require modification** because all components rely strictly on the stable `api.*` method contracts.
