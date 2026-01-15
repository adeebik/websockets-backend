# Chat App Backend

Real-time chat application backend with WebSocket support, built with Node.js and TypeScript.

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your system:

- Node.js (v14.x or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/adeebik/Chat-App_BE.git
cd Chat-App_BE
```

2. Install dependencies:
```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_URL=your_database_url

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# WebSocket Configuration
SOCKET_PORT=3000

# Add other environment variables as needed
```

### Running the Application

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm run build
npm start
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### WebSocket Connection
```
ws://localhost:3000
```
