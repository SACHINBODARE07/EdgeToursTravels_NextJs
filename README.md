This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

### Employee Management System

The application includes a comprehensive employee management system with the following features:

#### API Endpoints
- `GET /api/admin/employees` - Fetch all employees and drivers
- `POST /api/admin/create-employee` - Create new employees or drivers
- `PUT /api/admin/update-employee` - Update existing employee/driver information
- `DELETE /api/admin/delete-employee` - Delete employees/drivers
- `GET /api/admin/employee/[id]` - Get detailed information about a specific employee/driver

#### Vehicles Management
- `GET /api/admin/vehicles` - Fetch all vehicles with vendor details
- `POST /api/admin/vehicles` - Create new vehicle with vendor information
- `PUT /api/admin/vehicles/[id]` - Update existing vehicle/vendor details
- `DELETE /api/admin/vehicles/[id]` - Delete vehicle and vendor

#### Drivers Management
- `GET /api/admin/drivers` - Fetch all drivers
- `POST /api/admin/drivers` - Create new driver with vehicle and banking details
- `PUT /api/admin/update-driver` - Update existing driver information
- `DELETE /api/admin/delete-driver` - Delete driver

#### Frontend Features
- **Vehicles**: Complete CRUD operations for vehicles and vendors with document uploads
- **Drivers**: Full driver management with vehicle assignments and KYC tracking
- **Search & Filter**: Advanced search functionality across all entities
- **File Uploads**: Secure document upload for licenses, insurance, and KYC
- **Real-time Updates**: Live data synchronization and status updates
- **Professional UI**: Modern, responsive interface with dark mode support

#### Data Models
- **Vehicles**: Cab details, vendor information, documents, and maintenance status
- **Drivers**: Personal details, vehicle assignments, banking info, and KYC status
- **Security**: JWT authentication, role-based access, and data validation

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
