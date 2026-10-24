# Nidhi Track

**AICTE Security Deposit Management Portal**

A comprehensive Fixed Deposit Receipt (FDR) management system for AICTE and educational institutions.

## 🚀 Features

### Institution Portal
- 📊 Dashboard with FDR overview
- 💰 FDR Register management
- 📝 Release request submission
- 📋 Document verification workspace
- 🔍 Preliminary readiness checks
- 📤 Formal release wizard
- 📍 Real-time tracking

### AICTE Portal
- 🏛️ Council dashboard
- ⚖️ Case prioritization
- 🔎 Institution explorer
- ✅ Verification workspace
- 🤝 Cross-bureau intelligence
- ⚡ Authorized decision making
- 📊 Analytics and reporting

## 🛠️ Tech Stack

### Frontend
- React 19
- TypeScript
- Tailwind CSS
- Vite
- Lucide Icons
- Axios

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

## 📦 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/Prakash1448/Nidhi_Track.git
cd Nidhi_Track
```

2. **Install all dependencies (root, frontend, backend)**
```bash
npm run install:all
```

Or install manually:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Configure environment variables**

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aicte_fdr_db
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

4. **Seed the database**
```bash
cd backend
npm run seed
```

5. **Start the servers**

Option 1 - Start both together (from root):
```bash
npm run dev
```

Option 2 - Start separately:

Backend:
```bash
cd backend
npm start
# or for development with auto-reload
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

## 🔐 Default Credentials

### AICTE Admin
- Email: `admin@aicte.gov.in`
- Password: `admin123`

### AICTE Council
- Email: `council@aicte.gov.in`
- Password: `council123`

### Institution
- Email: `principal@apextech.edu.in`
- Password: `password123`

## 📁 Project Structure

```
Nidhi_Track/
├── frontend/              # React Frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── data/         # Mock data
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── types/        # TypeScript types
│   │   ├── utils/        # Utility functions
│   │   ├── views/        # Main views
│   │   ├── App.tsx       # Main app component
│   │   └── main.tsx      # Entry point
│   ├── public/           # Static assets
│   ├── index.html        # HTML template
│   ├── vite.config.ts    # Vite config
│   └── package.json      # Frontend dependencies
├── backend/              # Node.js Backend
│   ├── src/
│   │   ├── config/       # Database & app config
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Auth & validation
│   │   ├── models/       # MongoDB models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic & email
│   │   ├── utils/        # Helper functions
│   │   └── server.js     # Express server
│   └── package.json      # Backend dependencies
├── package.json          # Root workspace config
├── README.md             # Documentation
└── .gitignore           # Git ignore rules
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Institutions
- `GET /api/institutions` - Get all institutions
- `GET /api/institutions/:id` - Get single institution
- `POST /api/institutions` - Create institution
- `PUT /api/institutions/:id` - Update institution

### FDRs
- `GET /api/fdrs` - Get all FDRs
- `GET /api/fdrs/:id` - Get single FDR
- `GET /api/fdrs/institution/:id` - Get FDRs by institution
- `POST /api/fdrs` - Create FDR
- `PUT /api/fdrs/:id` - Update FDR

### Release Requests
- `GET /api/requests` - Get all requests
- `GET /api/requests/:id` - Get single request
- `POST /api/requests` - Create request
- `PUT /api/requests/:id` - Update request status

### Dashboard
- `GET /api/dashboard/stats` - Get statistics
- `GET /api/dashboard/analytics` - Get analytics data

## 🎯 Roadmap

- [x] Basic authentication system
- [x] Institution & AICTE portals
- [x] FDR management
- [x] Release request workflow
- [ ] OTP-based authentication for institutions
- [ ] Email notifications
- [ ] Document upload & OCR
- [ ] Advanced analytics
- [ ] Mobile app

## 👨‍💻 Author

**Prakash**
- GitHub: [@Prakash1448](https://github.com/Prakash1448)

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Built with ❤️ for AICTE**
