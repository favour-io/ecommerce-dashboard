A modern, interactive admin dashboard for bakery business management, built with Next.js and TypeScript.

## 🗂️ Project Structure

```
├── admin-dashboard.tsx         # Dashboard overview and stats
├── admin-login.tsx             # Admin login form
├── inquiries-management.tsx    # Customer inquiries management
├── inventory-management.tsx    # Inventory management (products, stock)
├── inventory-reports.tsx       # Inventory and sales reports
├── sales-analytics.tsx         # Sales analytics and top products
├── pages/
│   └── index.tsx               # Main entry point (with tab navigation)
├── tsconfig.json
├── package.json
└── README.md
```

## 🚀 Features

- **Admin Authentication**: Simple login/logout with session persistence
- **Dashboard Overview**: Key stats (orders, revenue, customers, pending orders)
- **Inventory Management**: Add/edit products, adjust stock, low/out-of-stock alerts
- **Sales Analytics**: Monthly stats, category breakdown, top products
- **Inquiries Management**: View/respond to customer inquiries, status tracking
- **Inventory Reports**: Downloadable reports, recent transactions, top sellers
- **Tab Navigation**: Switch between all modules from a single page
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Framework**: Next.js (React + TypeScript)
- **Styling**: Inline CSS (no external CSS frameworks)
- **State**: React hooks, localStorage for persistence
- **No backend required**: All data is stored in browser localStorage for demo purposes



## 👥 Authors

- **Favour IO** - Initial work and development

**Version**: 1.0.0  
