# Test Credentials

## How to Create Test Accounts

You can create test accounts by registering through the application. Here are some example credentials you can use:

### Test Account 1
- **Username:** Adobo123
- **Email:** testuser1@example.com
- **Password:** TestPassword123!

### Test Account 2
- **Username:** testuser2
- **Email:** testuser2@example.com
- **Password:** TestPassword456!

### Test Account 3
- **Username:** demouser
- **Email:** demouser@example.com
- **Password:** DemoPassword789!

## Password Requirements

Passwords must be strong and include:
- At least 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (!@#$%^&*)

## How to Register

1. Go to the application
2. Click "Log In" button
3. Click "Register" link
4. Fill in the registration form with:
   - Username (unique)
   - Email (valid email format)
   - Password (must meet requirements above)
5. Click Register
6. You'll be logged in automatically and receive a token

## How to Login

1. Go to the application
2. Click "Log In" button
3. Enter your username and password
4. Click Login
5. You'll receive a token that's stored in localStorage

## Token Storage

After login/registration, the token is automatically stored in localStorage under the key `user` as a JSON object:
```json
{
  "username": "testuser1",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userIdLogin": "507f1f77bcf86cd799439011"
}
```

## Accessing Protected Routes

All API calls to protected routes must include the token in the Authorization header:
```
Authorization: Bearer <token>
```

The client automatically handles this through the `useApi` hook.

## Testing the Feed

1. Login with any test account
2. Click "Let's Feed" button
3. Navigate to the Hardware page
4. Click "Feed Now" to trigger the manual feed
5. The request will now include your authentication token
