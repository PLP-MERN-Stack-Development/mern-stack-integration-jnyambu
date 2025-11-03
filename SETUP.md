# Database setup and environment variables

## Option 1: Docker (Recommended for Development)

The easiest way to run MongoDB locally is using Docker:

```bash
# Start MongoDB container
docker-compose up -d

# Stop MongoDB container
docker-compose down
```

MongoDB will be available at: mongodb://localhost:27017/merndb

## Option 2: Local MongoDB Installation

1. Download and install MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Add MongoDB binaries to your system PATH
3. Create a data directory: 
   ```bash
   mkdir -p /data/db     # Linux/macOS
   mkdir "\data\db"      # Windows
   ```
4. Start MongoDB server:
   ```bash
   mongod                # The server will start on port 27017
   ```

## Environment Variables

### Server (.env)
Copy `.env.example` to `.env` in the server directory:
```bash
cp server/.env.example server/.env    # Linux/macOS
copy server\.env.example server\.env  # Windows
```

Required variables:
- PORT: API server port (default: 5000)
- MONGODB_URI: MongoDB connection string
- NODE_ENV: development/production

### Client (.env)
Copy `.env.example` to `.env` in the client directory:
```bash
cp client/.env.example client/.env    # Linux/macOS
copy client\.env.example client\.env  # Windows
```

Required variables:
- VITE_API_URL: Backend API URL (default: http://localhost:5000)

Note: All client environment variables must start with VITE_