# 💵 SpendWise Frontend - Personal & Collaborative Expense Tracker

<div align="center">
  <img src="https://i.imgur.com/YOUR_LOGO_HERE.png" alt="SpendWise Logo" width="200"/>

  [![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://spendwise-three.vercel.app/)
  [![React](https://img.shields.io/badge/Built%20with-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Styled%20with-TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
</div>

## 🌐 Live Demo
# `FrontEnd Live Demo`
[https://spend-wise-frontend-coral.vercel.app/](https://spend-wise-frontend-coral.vercel.app/)
# `BackEnd Live Demo`
[https://spendwise-backend-production.vercel.app/](https://spendwise-backend-production.vercel.app/)
# `Backend Github project `
[https://github.com/Brian-K-Gathui/SpendWise-Backend/](https://github.com/Brian-K-Gathui/SpendWise-Backend/)

## 📋 Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Folder Structure](#folder-structure)
- [Authentication](#authentication)
- [Key Features](#key-features)
- [Backend Integration](#backend-integration)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 📝 Overview

SpendWise is a modern, user-friendly expense tracking application built with React and Tailwind CSS. It allows users to manage their personal and shared finances efficiently, track spending, set budgets, and collaborate with others. This frontend application consumes a RESTful API provided by the SpendWise backend.

## 🎯 Problem Statement

Managing personal and shared expenses efficiently is a common challenge. Many individuals struggle to track their spending, set budgets, and collaborate with others on shared financial responsibilities. Popular expense tracker applications often lack intuitive collaboration features, making it difficult for families, roommates, or business partners to manage joint expenses.

SpendWise aims to solve these problems by offering a comprehensive and user-friendly expense tracking platform. The application allows users to create and manage wallets, set budgets, categorize expenses and incomes, and collaborate with others through shared wallets. With a mobile-responsive UI and insightful dashboards, users gain full visibility into their financial habits, helping them make informed decisions.

## 🛠️ Tech Stack

### Frontend
- **React**: JavaScript library for building user interfaces
- **React Router**: For navigation and routing
- **Zustand**: For state management
- **Tailwind CSS**: For styling and UI components
- **Headless UI**: For accessible UI primitives
- **React Hook Form**: For form management and validation
- **React Query**: For data fetching and caching
- **Axios**: For making HTTP requests to the backend API
- **Clerk**: For user authentication and management
- **Lucide React**: For icons

### Backend
- **Flask**: Lightweight WSGI web application framework
- **PostgreSQL**: Database for storing application data
- **SQLAlchemy**: SQL toolkit and Object-Relational Mapping (ORM)
- **JWT (JSON Web Tokens)**: For secure authentication

### Deployment
- **Vercel**: Hosting platform for the frontend application

## 🏗️ Architecture

The SpendWise frontend follows a component-based architecture:

1. **Components**: Reusable UI elements (e.g., buttons, cards, forms)
2. **Layouts**: Structures for organizing components (e.g., dashboard layout, auth layout)
3. **Pages**: Top-level components representing different routes (e.g., dashboard, login, register)
4. **Hooks**: Custom React hooks for managing state and data fetching
5. **API**: Modules for interacting with the backend API

### Folder Structure
```code
SpendWise-Frontend/
├── .vercel/              # Vercel deployment configuration
├── node_modules/         # Node.js dependencies
├── public/               # Static assets
├── src/                  # Source code
│   ├── api/              # API client and service files
│   │   ├── auth.js       # Authentication API
│   │   ├── client.js     # Base API client
│   │   ├── endpoints.js  # API endpoint definitions
│   │   └── services.js   # API service functions
│   ├── assets/           # Static assets (images, videos)
│   ├── components/       # Reusable React components
│   │   ├── auth/         # Authentication components
│   │   ├── dashboard/    # Dashboard components
│   │   ├── ui/           # Shadcn/ui components
│   │   └── ConnectWithUs.jsx # Contact information component
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── pages/            # React pages
│   ├── store/            # Zustand store
│   ├── App.jsx           # Main application component
│   ├── index.css         # Global CSS styles
│   ├── main.jsx          # Entry point for React
│   └── routes.jsx        # React Router configuration
├── .env                  # Environment variables
├── .env.example          # Example environment variables
├── .gitignore            # Git ignore file
├── components.json       # Shadcn/ui configuration
├── CONTRIBUTING.md       # Contribution guidelines
├── eslintrc.config.js    # ESLint configuration
├── index.html            # HTML entry point
├── jsconfig.json         # JavaScript configuration
├── LICENSE.md            # License file
├── package.json          # Node.js dependencies
└── vite.config.js        # Vite configuration

```

## 🔐 Authentication

SpendWise uses Clerk for user authentication and management:

1. **ClerkProvider**: Wraps the application to provide authentication context
2. **useUser**: Hook to access the current user's information
3. **useSignIn, useSignUp**: Hooks for handling sign-in and sign-up flows
4. **JWT Authentication**: Clerk provides JWT tokens for secure API requests

## ✨ Key Features

### User Authentication
- Secure user registration and login with Clerk
- Password reset and email verification
- Multi-factor authentication (MFA) support

### Dashboard
- Interactive dashboard showing total expenses, incomes, budget status, and wallet balances
- Visual insights with pie charts and spending trends
- Customizable widgets

### Wallet Management
- Create multiple wallets for different financial needs
- Real-time updates of wallet balances based on transactions
- Wallet sharing and collaboration

### Transaction Tracking
- Add transactions with details such as amount, category, date, and notes
- Filter transactions by date range, category, or wallet
- Recurring transactions for automated tracking

### Budgeting
- Set monthly or custom budgets for specific categories
- Track budget progress with visual indicators
- Receive alerts when nearing or exceeding budget limits

### Reporting
- Generate detailed financial reports with breakdowns by category and wallet
- Export data in CSV, PDF, or JSON format
- View spending and income trends using interactive graphs

### Collaboration
- Invite others to collaborate on a shared wallet
- Set different permission levels (owner, editor, viewer)
- Real-time transaction updates within shared wallets

### Notifications
- Receive budget alerts, shared wallet updates, and security warnings

## 🔌 Backend Integration

The SpendWise frontend interacts with the backend API using Axios:

1. **API Client**: `src/api/client.js` configures the base URL and request/response interceptors
2. **Authentication**: JWT tokens from Clerk are automatically added to the Authorization header
3. **Endpoints**: `src/api/endpoints.js` defines the available API endpoints
4. **Services**: `src/api/services.js` provides functions for making API requests

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Vercel CLI (optional, for deployment)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone git@github.com:Brian-K-Gathui/SpendWise-Frontend.git
   cd SpendWise-Frontend
   ```
2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install

```

3. **Set up environment variables**
Create a `.env` file in the root directory with the required environment variables (see [Environment Variables](#environment-variables) section).

4. **Run the application**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev

```

- The application will be available at `http://localhost:5173`

### ## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_BASE_URL_DEV=http://localhost:5000/api
VITE_API_BASE_URL_PROD=https://spendwise-backend.vercel.app/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📦 Deploymen

SpendWise frontend is deployed on Vercel:

1. Set up Vercel CLI
```bash
npm install -g vercel
# or
pnpm install -g vercel
```

2. **Deploy to Vercel**
```bash
vercel
```

3. **Set environment variables on Vercel**
Configure all required environment variables in the Vercel dashboard.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


Please ensure your code follows the project's coding standards and includes appropriate tests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md)

```bash
README provides a comprehensive overview of your SpendWise frontend project, including detailed information about the architecture, folder structure, authentication, features, backend integration, and setup instructions. The document is well-structured with clear sections, emojis for visual appeal, and badges to highlight key technologies.You can customize it further by:

1. Adding your actual logo URL
2. Updating the GitHub/social media links at the bottom
3. Adding more specific details about your implementation
4. Including screenshots of your application in action
Would you like me to make any specific adjustments to the README?

```
