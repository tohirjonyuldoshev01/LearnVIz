
# SaaS Authentication System Implementation Guide

## Overview

This is a production-ready authentication system inspired by modern SaaS platforms like Notion, Udemy, and Canva. It provides:

- ✅ Automatic login after registration
- ✅ No flicker on page reload
- ✅ Dynamic navbar based on auth state
- ✅ 7-day session expiration with auto-logout
- ✅ Protected routes for authenticated users only
- ✅ Proper loading states throughout
- ✅ Firebase persistent authentication
- ✅ React Context API for state management

---

## Architecture

### 1. **AuthContext** (`src/context/AuthContext.tsx`)

Central state management using React's Context API and useReducer.

**Key Features:**
- Manages user, authentication status, loading state, and session expiration
- Handles session expiration by checking timestamp (`7 * 24 * 60 * 60 * 1000` ms)
- Stores last login timestamp in localStorage
- Auto-initializes on app load
- Provides login, register, logout, and clearSessionExpiredMessage methods

**State Properties:**
```typescript
{
  user: User | null                    // Current user object
  isAuthenticated: boolean              // Is user logged in
  isLoading: boolean                    // Are operations in progress
  isInitialized: boolean                // Has auth finished initializing
  sessionExpired: boolean               // Did session expire
}
```

**Login Flow:**
1. User registers/logs in
2. AuthContext stores login timestamp in localStorage
3. On app reload, it checks if timestamp is older than 7 days
4. If expired, signs user out and shows message
5. If valid, restores user session

---

### 2. **useAuth Hook** (`src/hooks/useAuth.ts`)

Simple wrapper around AuthContext for convenient usage.

**Usage:**
```typescript
const { user, isAuthenticated, login, logout, register } = useAuth();
```

---

### 3. **ProtectedRoute** (`src/components/auth/ProtectedRoute.tsx`)

HOC wrapper for pages requiring authentication.

**Usage in a page:**
```tsx
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
```

**Features:**
- Shows loading state during auth initialization
- Automatically redirects to login if not authenticated
- No flicker on reload due to proper initialization flow

---

### 4. **SessionExpiredAlert** (`src/components/auth/SessionExpiredAlert.tsx`)

Dismissible alert shown when session expires.

**Features:**
- Shows automatically when `sessionExpired` is true
- Auto-dismisses after 5 seconds
- Can be manually dismissed
- Displays clear message: "Your session has expired after 7 days"

---

### 5. **Header Component** (`src/components/layout/Header.tsx`)

Dynamic navigation header with auth state awareness.

**Unauthenticated State:**
- Shows "Login" button
- Shows "Sign Up" button

**Authenticated State:**
- Shows Dashboard link with icon
- Shows user avatar with initials
- Shows user name and role badge
- Dropdown menu with logout

**Mobile Menu:**
- Full responsive mobile navigation
- Same features as desktop but optimized for smaller screens

---

## Flow Diagrams

### Registration & Auto-Login Flow

```
User fills form → Register button
    ↓
register() function in AuthContext
    ↓
Firebase createUserWithEmailAndPassword()
    ↓
Create user document in Firestore
    ↓
Store login timestamp in localStorage
    ↓
Update AuthContext.user state
    ↓
useAuth hook updates (isAuthenticated = true)
    ↓
Login page useEffect detects isAuthenticated changed
    ↓
Redirect to /dashboard
    ↓
ProtectedRoute allows access
    ↓
Header shows user profile
```

### Session Expiration Check Flow (On App Load)

```
App loads → RootLayout wraps with AuthProvider
    ↓
AuthProvider useEffect runs
    ↓
checkSessionExpiration() checks timestamp
    ↓
Is elapsed time > 7 days?
    ├─ YES:
    │   ├─ logout() Firebase sign out
    │   ├─ Remove localStorage timestamp
    │   ├─ Set sessionExpired = true
    │   └─ Show SessionExpiredAlert
    │
    └─ NO:
        ├─ getCurrentUser() from Firebase
        ├─ Set user in context
        ├─ Remove sessionExpired flag
        └─ App loads normally
```

### Page Navigation Logic

```
User navigates to protected page (e.g., /dashboard)
    ↓
ProtectedRoute wrapper checks:
    ├─ Is auth initializing? → Show loader
    ├─ Is user authenticated? → Show page
    └─ Not authenticated? → Redirect to /auth/login
```

---

## Key Files

### Created Files:
1. `src/context/AuthContext.tsx` - Auth state management
2. `src/components/auth/ProtectedRoute.tsx` - Protected routes
3. `src/components/auth/SessionExpiredAlert.tsx` - Session alert
4. `src/components/auth/index.ts` - Auth exports

### Updated Files:
1. `src/app/layout.tsx` - Added AuthProvider wrapper
2. `src/hooks/useAuth.ts` - Updated to use Context API
3. `src/components/layout/Header.tsx` - Dynamic navbar
4. `src/app/auth/login/page.tsx` - Session expiration handling
5. `src/app/auth/register/page.tsx` - Auto-login after registration
6. `src/app/dashboard/page.tsx` - Protected route wrapper

---

## Usage Examples

### 1. Use Auth Hook in Any Component

```tsx
import { useAuth } from '@/hooks/useAuth';

export function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  return (
    <>
      {isAuthenticated && <p>Hello, {user?.displayName}</p>}
      <button onClick={() => logout()}>Logout</button>
    </>
  );
}
```

### 2. Protect a Page Route

```tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function SettingsContent() {
  return <div>User Settings</div>;
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}
```

### 3. Handle Session Expiration

The SessionExpiredAlert is automatically shown in the root layout. You can also manually check:

```tsx
import { useAuthContext } from '@/context/AuthContext';

export function MyComponent() {
  const { sessionExpired, clearSessionExpiredMessage } = useAuthContext();
  
  if (sessionExpired) {
    return <p>Please log in again</p>;
  }
}
```

---

## Security Features

### 1. Session Expiration
- Validates login timestamp on app load
- Automatically logs out after 7 days
- Prevents unauthorized access to expired sessions

### 2. Protected Routes
- Prevents unauthenticated access to protected pages
- Shows loading state to avoid flicker
- Redirects to login page smoothly

### 3. Firebase Persistence
- Uses Firebase's default persistence (localStorage)
- Auth state survives page reloads
- Secure token management by Firebase

### 4. localStorage Management
- Only stores timestamps and expiration flags
- No sensitive data stored
- Cleared on logout

---

## Customization

### Change Session Expiration Duration

Edit `src/context/AuthContext.tsx`:

```typescript
// Change from 7 days to your desired duration
const SESSION_EXPIRY_DAYS = 14; // 14 days instead of 7
```

### Customize Navbar Avatar Colors

Edit `src/components/layout/Header.tsx`:

```typescript
const getAvatarColor = (name: string) => {
  const colors = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    // Add more colors here
  ];
  return colors[hash % colors.length];
};
```

### Add Additional Auth Properties

Update `src/types/index.ts` User interface:

```typescript
export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  profilePicture?: string;      // Already exists
  createdAt: string;
  updatedAt: string;
  // Add new properties here
  lastLogin?: string;
  preferences?: Record<string, any>;
}
```

Then update `src/services/authService.ts` to include them.

---

## Testing Checklist

- [ ] Register new user → auto-redirect to dashboard
- [ ] Navbar shows user profile when logged in
- [ ] Reload page → no flicker, auth state preserved
- [ ] Manually change localStorage login timestamp to old date
- [ ] Reload page → session expiration alert appears
- [ ] Click logout → redirects to login
- [ ] Try accessing /dashboard while logged out → redirects to /login
- [ ] Mobile navbar works correctly on small screens
- [ ] Dark mode toggle works in header
- [ ] User avatar colors are different for different names

---

## Best Practices (Implemented)

✅ **Proper Loading States** - Shows loader during auth initialization
✅ **No Flicker** - Initialization complete before rendering routes
✅ **Context API** - Simple, no library overhead
✅ **Error Handling** - Catches and displays errors gracefully
✅ **TypeScript** - Fully typed for safety
✅ **Protected Routes** - Clean HOC pattern
✅ **Mobile Responsive** - Navbar works on all sizes
✅ **Dark Mode Support** - Colors adapt to theme
✅ **Accessibility** - ARIA labels, semantic HTML
✅ **Performance** - Efficient re-renders with memo and useCallback

---

## Firebase Configuration

The system uses existing Firebase setup in `src/lib/firebase/config.ts`.

Make sure you have:
- Firebase Authentication enabled
- Firestore database enabled
- User collection with proper security rules

**Firestore Security Rules Example:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Users can only read/write their own documents
      allow read, write: if request.auth.uid == userId;
    }
    match /diagrams/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## Troubleshooting

**Problem:** Page flickers on reload
**Solution:** AuthProvider initializes before rendering routes (check app layout.tsx)

**Problem:** Session doesn't expire
**Solution:** Check localStorage for `learnviz_last_login` timestamp

**Problem:** useAuth hook says "used outside AuthProvider"
**Solution:** Make sure RootLayout wraps children with AuthProvider

**Problem:** ProtectedRoute redirects logged-in user
**Solution:** Check authContext.isInitialized is true before making decisions

---

## Next Steps

Optional enhancements:
1. Add password reset flow
2. Add email verification
3. Add two-factor authentication
4. Add OAuth (Google, GitHub)
5. Add account deletion flow
6. Add profile edit page
7. Add session timeout warning before expiration
8. Add refresh token rotation

---

## Support

For issues or questions about the authentication system, refer to:
- Firebase Documentation: https://firebase.google.com/docs
- React Context API: https://react.dev/reference/react/useContext
- Next.js: https://nextjs.org/docs
