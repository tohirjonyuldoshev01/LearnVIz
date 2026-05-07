# Quick Reference: SaaS Authentication

## 1. Use Auth in Components

```tsx
import { useAuth } from '@/hooks/useAuth';

export function MyComponent() {
  const { 
    user,              // Current user object
    isAuthenticated,   // Boolean
    isLoading,         // Boolean
    isInitialized,     // Boolean
    login,             // (email, password) => Promise<User>
    register,          // (email, password, name, role) => Promise<User>
    logout,            // () => Promise<void>
  } = useAuth();

  if (isLoading) return <Loader />;
  
  if (isAuthenticated) {
    return <p>Welcome, {user.displayName}!</p>;
  }

  return <p>Please log in</p>;
}
```

## 2. Protect a Page

```tsx
'use client';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function PageContent() {
  return <div>Only visible to logged-in users</div>;
}

export default function Page() {
  return (
    <ProtectedRoute>
      <PageContent />
    </ProtectedRoute>
  );
}
```

## 3. Session Expiration

Automatically handled! When 7 days pass:
- User is logged out
- SessionExpiredAlert shows message
- Redirects to login on next navigation

No action needed - built into AuthProvider.

## 4. Check If User Is Logged In

```tsx
const { isAuthenticated, user } = useAuth();

if (isAuthenticated) {
  console.log(`User: ${user.displayName}, Role: ${user.role}`);
}
```

## 5. Manual Logout

```tsx
const { logout } = useAuth();

const handleLogout = async () => {
  try {
    await logout();
    // User is now logged out
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
```

## 6. Login Flow

```tsx
const { login } = useAuth();

try {
  const user = await login('user@example.com', 'password');
  console.log('Logged in:', user);
  router.push('/dashboard');
} catch (error) {
  console.error('Login failed:', error);
}
```

## 7. Register Flow

```tsx
const { register } = useAuth();

try {
  const newUser = await register(
    'user@example.com',
    'password',
    'John Doe',
    'student' // or 'teacher', 'parent'
  );
  console.log('Registered:', newUser);
  // Auto-redirected to dashboard by Register page
} catch (error) {
  console.error('Registration failed:', error);
}
```

## 8. Check Session Expiration

```tsx
import { useAuthContext } from '@/context/AuthContext';

const { sessionExpired, clearSessionExpiredMessage } = useAuthContext();

if (sessionExpired) {
  return <div>Your session has expired. Please log in again.</div>;
}
```

## 9. Flow Priority

When component renders:
1. AuthProvider initializes (isInitialized = false)
2. Checks if session expired (localStorage timestamp)
3. Restores user or logs out
4. Sets isInitialized = true
5. Component renders properly

**Always check isInitialized or isLoading before using user!**

## 10. Key Constants

Session expiration: **7 days** (604,800,000 ms)

Change in `src/context/AuthContext.tsx`:
```typescript
const SESSION_EXPIRY_DAYS = 7;
const SESSION_EXPIRY_MS = SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
```

---

## Common Patterns

### Conditional Rendering Based on Auth

```tsx
const { isAuthenticated, user, isLoading } = useAuth();

if (isLoading) return <Spinner />;

return (
  <>
    {isAuthenticated ? (
      <UserMenu user={user} />
    ) : (
      <AuthButtons />
    )}
  </>
);
```

### Redirect After Login

The Login and Register pages handle this automatically.
They redirect to `/dashboard` after successful auth.

For custom redirects:
```tsx
const { login } = useAuth();
const router = useRouter();

await login(email, password);
router.push('/custom-page');
```

### Error Handling

```tsx
const { login } = useAuth();
const [error, setError] = useState<string | null>(null);

try {
  await login(email, password);
} catch (err: any) {
  setError(err.message); // "Invalid email or password"
}

return error && <Alert type="error">{error}</Alert>;
```

### Wait for Auth to Initialize

```tsx
const { isInitialized } = useAuth();

useEffect(() => {
  if (!isInitialized) return;
  
  // Now safe to make decisions based on auth state
  console.log('Auth is ready');
}, [isInitialized]);
```

---

## State Diagram

```
App Load
  ↓
AuthProvider initializes
  ↓
Check session expiration? (isInitialized = false)
  ├─ YES: Auto-logout, show message
  └─ NO: Restore user
  ↓
isInitialized = true
  ↓
Components render with user data
```

## Types

```typescript
// User type (from src/types/index.ts)
interface User {
  id: string;                    // Firebase UID
  email: string;                 // User email
  displayName: string;           // Full name
  role: 'student' | 'teacher' | 'parent' | 'admin';
  profilePicture?: string;       // Optional avatar URL
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
}
```

---

## Do's and Don'ts

✅ DO:
- Check isInitialized before using user
- Use ProtectedRoute for auth-required pages
- Call logout before redirecting
- Handle login/register errors

❌ DON'T:
- Access user directly without checking isAuthenticated
- Assume auth is ready on first render
- Store sensitive data in localStorage
- Use old Zustand store (use AuthContext instead)

---

## File Locations Reference

| File | Purpose |
|------|---------|
| `src/context/AuthContext.tsx` | Auth state & logic |
| `src/hooks/useAuth.ts` | Auth hook |
| `src/components/auth/ProtectedRoute.tsx` | Protected pages |
| `src/components/auth/SessionExpiredAlert.tsx` | Expiration alert |
| `src/components/layout/Header.tsx` | Dynamic navbar |
| `src/app/auth/login/page.tsx` | Login form |
| `src/app/auth/register/page.tsx` | Registration form |
| `src/services/authService.ts` | Firebase calls |

---

That's it! The authentication system is production-ready and handles all the complexity for you.
