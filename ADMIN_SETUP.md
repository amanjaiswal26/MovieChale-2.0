# Admin Setup Instructions

## Issues Fixed

The following authentication and authorization issues have been resolved:

1. **Server-side Authentication Mismatch**: Fixed the mismatch between Clerk's `req.auth().userId` and the expected `req.user?.id`
2. **Missing Role Field**: Added `role` field to the User model with default value "user" and enum ["user", "admin"]
3. **Inconsistent Authentication Flow**: Unified the authentication to use MongoDB User model for role management
4. **User Creation**: Added automatic user creation/update when users sign in
5. **Admin Protection**: Fixed admin route protection middleware

## How to Make a User Admin

### Method 1: Using the Script (Recommended)

1. First, sign up/login to your application to create a user in the database
2. Get your user ID from Clerk dashboard or by calling the API
3. Run the script:

```bash
cd server
node makeAdmin.js <your-user-id>
```

Example:
```bash
node makeAdmin.js user_2abc123def456
```

### Method 2: Using the API Endpoint

1. Get all users to find your user ID:
```bash
curl http://localhost:5000/api/admin/users
```

2. Make a user admin:
```bash
curl -X POST http://localhost:5000/api/admin/make-admin \
  -H "Content-Type: application/json" \
  -d '{"userId": "your-user-id-here"}'
```

### Method 3: Direct Database Update

If you have access to MongoDB directly:

```javascript
db.users.updateOne(
  { _id: "your-user-id-here" },
  { $set: { role: "admin" } }
)
```

## Testing Admin Access

1. Start your server:
```bash
cd server
npm start
```

2. Start your client:
```bash
cd client
npm run dev
```

3. Sign in to your application
4. Navigate to `/admin` - you should now have access to the admin dashboard

## What Was Fixed

### Server Changes:
- ✅ Updated `User` model to include `role` field
- ✅ Fixed `adminController.js` to use `req.auth().userId` instead of `req.user?.id`
- ✅ Updated `protectAdmin` middleware to check MongoDB User model
- ✅ Added user creation/update endpoint
- ✅ Added admin creation endpoints for development
- ✅ Added proper authentication to all user routes

### Client Changes:
- ✅ Updated `AppContext.jsx` to create/update users automatically on sign-in
- ✅ Fixed admin check flow to work with the new authentication system

## Security Notes

- The `/api/admin/make-admin` and `/api/admin/users` endpoints are currently open for development purposes
- In production, you should add authentication to these endpoints or remove them entirely
- Consider using environment variables to control admin access in production

## Troubleshooting

If you're still getting "not authorized" errors:

1. Make sure the user exists in MongoDB (sign in first)
2. Check that the user has the `role: "admin"` field in the database
3. Verify that the server is running and accessible
4. Check the browser console and server logs for any error messages

## Next Steps

1. Test the admin functionality
2. Remove or secure the development endpoints (`/api/admin/make-admin`, `/api/admin/users`) for production
3. Consider adding more granular permissions if needed
