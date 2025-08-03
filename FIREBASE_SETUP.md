# Firebase Setup Guide for LeetScape

This guide will help you set up Firebase for user authentication and data storage in your LeetScape project.

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "leetscape-app")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Add Your Web App

1. In your Firebase project dashboard, click the web icon (</>) to add a web app
2. Enter an app nickname (e.g., "LeetScape Web")
3. Check "Also set up Firebase Hosting" if you plan to deploy there
4. Click "Register app"
5. Copy the Firebase configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
};
```

## Step 3: Update Firebase Configuration

1. Open `src/lib/firebase.ts`
2. Replace the placeholder configuration with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-actual-project-id.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-actual-project-id.appspot.com",
  messagingSenderId: "your-actual-messaging-sender-id",
  appId: "your-actual-app-id",
};
```

## Step 4: Enable Authentication

1. In the Firebase Console, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Google" as a sign-in provider
5. Configure the OAuth consent screen if needed
6. Add your domain to authorized domains

## Step 5: Set Up Firestore Database

1. In the Firebase Console, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development (you can secure it later)
4. Select a location for your database
5. Click "Done"

## Step 6: Configure Firestore Security Rules

1. In Firestore Database, go to the "Rules" tab
2. Replace the default rules with these secure rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Problem progress can only be read/written by the user who owns it
    match /userProgress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Notes can only be read/written by the user who owns them
    match /userNotes/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 7: Environment Variables (Optional but Recommended)

For better security, create a `.env` file in your project root:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Then update `src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
```

## Step 8: Test the Integration

1. Start your development server: `npm run dev`
2. Click "Sign In" in the navbar
3. Complete the Google sign-in process
4. Set up your custom username
5. Verify that user data is stored in Firestore

## Features Included

- ✅ Google Authentication
- ✅ Custom username setup
- ✅ User profile management
- ✅ Secure Firestore rules
- ✅ Authentication state management
- ✅ Loading states
- ✅ Error handling

## Next Steps

1. **Add more authentication providers** (GitHub, Twitter, etc.)
2. **Implement user data persistence** for problem progress and notes
3. **Add user profile editing** functionality
4. **Set up email verification**
5. **Add password reset functionality**
6. **Implement user roles and permissions**

## Troubleshooting

### Common Issues:

1. **"Firebase: Error (auth/popup-closed-by-user)"**

   - User closed the popup before completing sign-in
   - This is normal behavior

2. **"Firebase: Error (auth/popup-blocked)"**

   - Browser blocked the popup
   - Ask user to allow popups for your domain

3. **"Firebase: Error (auth/unauthorized-domain)"**

   - Add your domain to authorized domains in Firebase Console

4. **Firestore permission errors**
   - Check that your security rules are correct
   - Ensure the user is authenticated

### Security Best Practices:

1. Never commit your Firebase config to public repositories
2. Use environment variables for sensitive data
3. Regularly review and update Firestore security rules
4. Enable Firebase App Check for additional security
5. Monitor your Firebase usage and costs

## Support

If you encounter issues:

1. Check the Firebase Console for error logs
2. Review the Firebase documentation
3. Check the browser console for detailed error messages
4. Ensure all Firebase services are properly enabled
