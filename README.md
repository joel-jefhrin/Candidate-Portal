# Candidate Portal - Interview Management System

Standalone candidate portal for completing interviews independently from the admin system.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server (on port 3001)
npm run dev

# Build for production
npm build

# Start production server
npm start
```

## 🌐 Access

- **Development**: http://localhost:3001
- **Production**: Deploy separately from admin portal

## 🔐 Demo Credentials

### Candidate 1:
- **Email**: sarah.j@email.com
- **Password**: temp123

### Candidate 2:
- **Email**: michael.c@email.com
- **Password**: temp456

## 📁 Project Structure

```
candidate-portal/
├── src/
│   └── app/
│       ├── globals.css          # Global styles
│       ├── layout.tsx            # Root layout
│       ├── page.tsx              # Home (redirects to login)
│       ├── login/                # Login page
│       ├── interview/            # Interview interface
│       │   ├── page.tsx
│       │   └── complete/         # Interview completion
│       └── results/              # Results & rankings
├── package.json
├── tsconfig.json
├── next.config.js
└── tailwind.config.ts
```

## 🎨 Features

### Authentication
- Email + temporary password login
- Session management
- Auto-redirect on logout

### Interview Interface
- Real-time countdown timer
- Auto-save every 30 seconds
- Multiple question types:
  - Code editor
  - Essay
  - Multiple choice
- Progress tracking
- Question navigation

### Results
- Overall score & ranking
- Skills breakdown (Technical, Behavioral, Logical)
- Question-wise performance
- Percentile calculation
- Time tracking
- Printable results

## 🔄 Integration with Admin Portal

The candidate portal is designed to work independently but communicates with the admin portal's API:

```typescript
// .env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### API Endpoints Used:
- `GET /api/candidates/:id` - Get candidate details
- `POST /api/answers` - Submit answers
- `GET /api/results/:candidateId` - Get interview results

## 🎯 Key Routes

| Route | Description |
|-------|-------------|
| `/` | Home (redirects to login) |
| `/login` | Candidate login |
| `/interview` | Interview interface |
| `/interview/complete` | Completion confirmation |
| `/results` | Results & rankings |

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: Tailwind CSS
- **Icons**: Heroicons
- **Notifications**: react-hot-toast
- **State**: Session Storage (for candidate session)

## 🚢 Deployment

### Separate Deployment

The candidate portal runs on a different port (3001) and can be deployed independently:

```bash
# Build
npm run build

# Start production server
npm start
```

### Environment Variables

```bash
# Candidate Portal URL
NEXT_PUBLIC_CANDIDATE_URL=https://candidate.yourdomain.com

# Admin Portal API URL
NEXT_PUBLIC_API_URL=https://admin.yourdomain.com/api
```

### Deployment Platforms

- **Vercel**: Automatic deployment
- **Netlify**: Configure build command
- **AWS**: EC2/ECS with Docker
- **Azure**: App Service
- **DigitalOcean**: App Platform

## 📱 Mobile Responsive

The candidate portal is fully responsive and works seamlessly on:
- Desktop (1920px+)
- Laptop (1366px)
- Tablet (768px)
- Mobile (375px+)

## 🔒 Security

- Session-based authentication
- Auto-logout on token expiration
- HTTPS enforced in production
- CORS configuration for API calls
- XSS protection via React

## 🎨 Theming

The candidate portal uses a blue-indigo gradient theme to distinguish it from the admin portal (which uses orange):

```css
/* Primary Colors */
Blue: #2563eb
Indigo: #4f46e5

/* Status Colors */
Success: #10b981
Warning: #f59e0b
Danger: #ef4444
```

## 📧 Support

For candidate support:
- **Email**: support@demo.com
- **Phone**: +1 (555) 123-4567

## 📄 License

Private - Interview Management System

