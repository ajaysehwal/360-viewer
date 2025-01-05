# 🚀 360° Panorama Viewer - Setup Guide

## Prerequisites

- Node.js 18+ installed
- Firebase account
- Basic knowledge of React and Next.js

## Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/360-viewer.git
cd 360-viewer
npm install
```

### 2. Environment Configuration

Create `.env.local` in your project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)

2. Enable Authentication:
   - Navigate to Authentication > Sign-in method
   - Enable Google provider
   - Configure OAuth consent screen

3. Create Storage bucket:
   - Go to Storage > Get Started
   - Create new bucket
   - Set up Storage rules

4. Add Firebase Storage Rules:


```typescript
// Firebase Storage Rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /3d-views/{userId}/{fileName} {
      allow write: if request.auth != null 
                   && request.auth.uid == userId 
                   && request.resource.size < 50 * 1024 * 1024;
      allow read: if true;
    }
  }
}
```

Visit `http://localhost:3000` to see your app.

## 🔒 Security Notes

1. Environment Variables:
   - Never commit `.env.local` to version control
   - Add `.env.local` to `.gitignore`

2. Firebase Security:
   - Restrict API key usage in Firebase Console
   - Regularly review Storage and Auth rules
   - Monitor usage in Firebase Console



### Auth Domain Configuration

For production, add your domain to authorized domains in Firebase Console:

1. Go to Authentication > Settings
2. Add your domain under "Authorized domains"
3. Save changes

## Troubleshooting

Common issues and solutions:

1. CORS errors:
   - Add your domain to Firebase Storage CORS configuration
   - Check Authentication domain settings

2. Upload failures:
   - Verify Storage rules
   - Check file size limits
   - Confirm user authentication

3. Environment variables:
   - Ensure all variables are properly set
   - Restart development server after changes