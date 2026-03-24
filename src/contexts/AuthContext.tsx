import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';

const BASE = 'http://localhost:3001/api';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'FREELANCER' | 'COMPANY';
  bio?: string;
  avatar?: string;
  coverPage?: string;
  headline?: string;
  createdAt?: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'FREELANCER' | 'COMPANY';
  headline?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login:      (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register:   (data: RegisterData)              => Promise<{ success: boolean; error?: string }>;
  logout:     ()                                => void;
  updateUser: (userData: Partial<UserProfile>)  => Promise<void>;
  fetchOAuthUser: ()                            => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate  = useNavigate();
  const [user,      setUser]      = useState<UserProfile | null>(null);
  const [token,     setToken]     = useState<string | null>(null); // ✅ no localStorage for cookie-based auth
  const [isLoading, setIsLoading] = useState(true);

  // ── Normalize /me response ──────────────────────────────────────────────────
  const normalizeUser = (data: any): UserProfile | null => {
    if (!data) return null;
    const u = data.user ?? data;
    if (!u?.id) return null;
    return {
      id:        u.id,
      email:     u.email     ?? '',
      name:      u.name      ?? '',
      role:      u.role      ?? 'FREELANCER',
      bio:       u.bio       ?? undefined,
      avatar:    u.avatar    ?? undefined,
      coverPage: u.coverPage ?? undefined,
      headline:  u.headline  ?? undefined,
    };
  };

  // ── Fetch current user from cookie on load ──────────────────────────────────
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res  = await fetch(`${BASE}/auth/me`, { credentials: 'include' });
        const data = await res.json();
        if (res.ok && data.success) {
          setUser(normalizeUser(data));
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // ── Manual OAuth refresh (called by GitHubCallback) ─────────────────────────
  const fetchOAuthUser = async () => {
    setIsLoading(true);
    try {
      const res  = await fetch(`${BASE}/auth/me`, { credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.success) setUser(normalizeUser(data));
    } catch {
      console.error('fetchOAuthUser failed');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Login ───────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res  = await fetch(`${BASE}/auth/login`, {
        method:      'POST',
        credentials: 'include',           // ✅ receive cookie
        headers:     { 'Content-Type': 'application/json' },
        body:        JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success)
        return { success: false, error: data.error ?? 'Invalid email or password' };

      const profile = normalizeUser(data);
      setUser(profile);

      // ✅ Redirect to feed — same for all roles
      navigate('/social/feed', { replace: true });
      return { success: true };

    } catch {
      return { success: false, error: 'Network error — please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  // ── Register ────────────────────────────────────────────────────────────────
  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      // ✅ Route to correct endpoint based on role
      const url = data.role === 'COMPANY'
        ? `${BASE}/auth/register/company`
        : `${BASE}/auth/register/freelancer`;

      const res    = await fetch(url, {
        method:      'POST',
        credentials: 'include',           // ✅ receive cookie
        headers:     { 'Content-Type': 'application/json' },
        body:        JSON.stringify({
          name:     data.name,
          email:    data.email,
          password: data.password,
          headline: data.headline ?? '',
        }),
      });
      const result = await res.json();

      if (!res.ok || !result.success)
        return { success: false, error: result.error ?? 'Registration failed' };

      setUser(normalizeUser(result));

      // ✅ Redirect to feed after registration
      navigate('/social/feed', { replace: true });
      return { success: true };

    } catch {
      return { success: false, error: 'Network error — please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  // ── Logout ──────────────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      await fetch(`${BASE}/auth/logout`, {
        method:      'POST',
        credentials: 'include',
      });
    } catch { /* ignore */ }
    setUser(null);
    setToken(null);
    navigate('/login', { replace: true });
  };

  // ── Update user ─────────────────────────────────────────────────────────────
  const updateUser = async (userData: Partial<UserProfile>) => {
    if (!user) throw new Error('Not authenticated');
    const res  = await fetch(`${BASE}/users/${user.id}`, {
      method:      'PUT',
      credentials: 'include',
      headers:     { 'Content-Type': 'application/json' },
      body:        JSON.stringify(userData),
    });
    const data = await res.json();
    setUser(normalizeUser(data));
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      updateUser,
      fetchOAuthUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return { ...context, checkAuth: context.fetchOAuthUser };
};