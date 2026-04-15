# Authentication & Authorization Guide

## Overview

The application now has a complete authentication system with JWT tokens. All protected routes require a valid token to access.

## What Was Changed

### Server-Side Changes

1. **Created Authentication Middleware** (`server/middleware/requireAuth.js`)
   - Validates JWT tokens from request headers
   - Extracts user ID from token
   - Protects routes from unauthorized access

2. **Updated Routes** (`server/routes/user.js`)
   - Added `requireAuth` middleware to protected routes
   - Public routes: `/login`, `/register`
   - Protected routes: All other endpoints

### Client-Side Changes

1. **Created API Hook** (`client/src/hooks/useApi.tsx`)
   - Automatically adds Authorization header to requests
   - Includes Bearer token from localStorage
   - Simplifies API calls throughout the app

2. **Updated Hardware Page** (`client/src/pages/Hardware/index.tsx`)
   - Now uses `useApi` hook for authenticated requests
   - Properly sends token with "Feed Now" requests

## How Authentication Works

### Registration Flow
```
1. User fills registration form
2. Client sends POST /api/user/register with username, email, password
3. Server validates and hashes password
4. Server creates user and generates JWT token
5. Token is returned to client
6. Client stores token in localStorage
7. User is logged in
```

### Login Flow
```
1. User enters username and password
2. Client sends POST /api/user/login
3. Server validates credentials
4. Server generates JWT token
5. Token is returned to client
6. Client stores token in localStorage
7. User is logged in
```

### Protected Request Flow
```
1. User makes request to protected endpoint
2. Client's useApi hook adds Authorization header: "Bearer <token>"
3. Server's requireAuth middleware validates token
4. If valid: Request proceeds, user ID available in req.user._id
5. If invalid: Server returns 401 Unauthorized
```

## Token Structure

The token stored in localStorage contains:
```json
{
  "username": "testuser1",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userIdLogin": "507f1f77bcf86cd799439011"
}
```

The JWT token itself contains:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "iat": 1234567890,
  "exp": 1234654290
}
```

## Testing the Authentication

### Step 1: Register a New Account
1. Open the application
2. Click "Log In"
3. Click "Register" link
4. Fill in the form:
   - Username: `testuser1`
   - Email: `testuser1@example.com`
   - Password: `TestPassword123!`
5. Click Register
6. You'll be logged in automatically

### Step 2: Test Protected Routes
1. Click "Let's Feed" button
2. You should see the Hardware page
3. Click "Feed Now" button
4. The request should succeed (you'll see a success message)
5. Check browser console to see the response

### Step 3: Test Logout and Login
1. Click "Log out" in the sidebar
2. You'll be redirected to login page
3. Click "Log In"
4. Enter your credentials
5. Click Login
6. You'll be logged in again

### Step 4: Verify Token in Storage
1. Open browser DevTools (F12)
2. Go to Application → Local Storage
3. Find the entry with key `user`
4. You'll see your token stored there

## Protected Endpoints

All these endpoints now require authentication:

- `GET /api/user/:id` - Get user info
- `PATCH /api/user/toggle-type` - Manual feed activation
- `GET /api/user/:id/get-times` - Get timed feed schedule
- `POST /api/user/set-time` - Add timed feed
- `DELETE /api/user/delete-time` - Remove timed feed
- `POST /api/user/logs-feed` - Add feed log
- `GET /api/user/:id/get-logs` - Get feed logs
- `PATCH /api/user/esp32` - Update ESP32 ID

## Public Endpoints

These endpoints do NOT require authentication:

- `POST /api/user/login` - Login
- `POST /api/user/register` - Register

## Error Handling

### 401 Unauthorized
```json
{
  "error": "Authorization token required"
}
```
**Cause:** No token provided in Authorization header
**Solution:** Login first, then make the request

### 401 Request is not authorized
```json
{
  "error": "Request is not authorized"
}
```
**Cause:** Invalid or expired token
**Solution:** Login again to get a new token

## Token Expiration

- Tokens expire after **3 days**
- When a token expires, user must login again
- A new token is generated on each login

## Security Notes

1. **Never share your token** - It grants access to your account
2. **Tokens are stored in localStorage** - Accessible to JavaScript
3. **Use HTTPS in production** - Prevents token interception
4. **Clear localStorage on logout** - Already handled by the app
5. **Token includes user ID** - Used to verify ownership of resources

## Troubleshooting

### "Unauthorized access" error when clicking Feed
**Problem:** Token not being sent with request
**Solution:** 
1. Make sure you're logged in
2. Check localStorage has the token
3. Refresh the page
4. Try logging out and back in

### Token not persisting after refresh
**Problem:** localStorage not working
**Solution:**
1. Check browser privacy settings
2. Clear browser cache
3. Try a different browser
4. Check if localStorage is enabled

### Can't register with password
**Problem:** Password doesn't meet requirements
**Solution:** Password must have:
- At least 8 characters
- 1 uppercase letter
- 1 lowercase letter
- 1 number
- 1 special character (!@#$%^&*)

Example: `TestPassword123!`

## Next Steps

1. Create test accounts for team members
2. Update other pages to use `useApi` hook
3. Add token refresh logic for better UX
4. Implement role-based access control (admin, user, etc.)
5. Add password reset functionality
