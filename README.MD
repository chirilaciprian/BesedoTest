## Project Structure

```
BesedoTest/
  client/   - Vanilla JS SPA (HTML/CSS/JS, no build step)
  server/   - Express 5 REST API with Zod validation
```

## Install

```bash
# Server
cd server && npm install

# Client
cd client && npm install
```

## Run

```bash
# Start server (port 3000)
cd server && npm start

# Open client in browser
client/src/index.html
```

## Test

```bash
# Server tests (Jest)
cd server && npm test

# Client tests (Vitest)
cd client && npm test
```

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users | List all users |
| GET | /api/users/:id | Get user by ID |
| POST | /api/users | Create user |
| PUT | /api/users/:id | Update user |
| DELETE | /api/users/:id | Delete user |
