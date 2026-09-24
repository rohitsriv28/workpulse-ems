# Employee Attendance System (Frontend)

A modern, responsive web application for managing employee attendance, payroll, and system logs. Built with React, TypeScript, and Vite, this application provides a comprehensive dashboard for HR and administration.

## 🚀 Features

- **Dashboard**: Real-time overview of attendance statistics, department breakdown, and recent activities.
- **Attendance Management**: Track daily employee attendance, view histories, and manage statuses (Present, Absent, etc.).
- **Payroll Reports**:
  - Generate detailed monthly salary slips.
  - Automatic calculation of deductions based on attendance, half-days, and unpaid leaves.
  - Exportable reports for employees.
- **Employee Management**: centralized database of employee profiles, roles, and departments.
- **Audit Logs**: Comprehensive tracking of system activities (e.g., logins, data modifications) for security and accountability.
- **Scanner Integration**: Built-in interface for QR/Barcode scanning to mark attendance efficiently.
- **Authentication**: Secure login system with role-based access control (RBAC) and protected routes.

## 🛠️ Tech Stack

This project uses a modern frontend stack:

- **Framework**: [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing**: [React Router DOM v6+](https://reactrouter.com/)
- **State Management & Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Forms**: [React Hook Form](https://react-hook-form.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Visualization**: Custom CSS / Tailwind-based charts and progress bars.
- **Utilities**: `clsx`, `tailwind-merge`

## 📂 Project Structure

```bash
src/
├── features/       # Feature-based architecture
│   ├── attendance/ # Attendance tracking logic
│   ├── auth/       # Authentication providers & components
│   ├── employees/  # Employee management & payroll logic
│   ├── reports/    # Reporting components
│   └── scanner/    # QR/Barcode scanner implementation
├── pages/          # Application route pages (Dashboard, Attendance, etc.)
├── components/     # Reusable UI components
├── layouts/        # Page layouts (e.g., MainLayout)
├── hooks/          # Custom React hooks
├── context/        # React Context providers (AuthContext etc.)
├── lib/            # Utility functions (payroll calc, API helpers)
└── assets/         # Static assets
```

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- npm or yarn

### Installation

1.  **Clone the repository** (if applicable) or navigate to the project directory.

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Application

Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

To create a production-ready build:

```bash
npm run build
# or
yarn build
```

The output will be in the `dist/` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
# or
yarn preview
```

## 📄 Scripts

- `dev`: Starts the Vite development server.
- `build`: Compiles TypeScript and builds the application for production.
- `preview`: Previews the production build locally.

---

**Note**: This project is currently in development (Version 0.0.0).
