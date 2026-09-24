import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { UserSession, Role } from "../types";
import { api } from "../lib/api/client";
import { getStore } from "../lib/api/store";

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role?: Role) => Promise<UserSession>;
  logout: () => Promise<void>;
  switchRole: (role: Role) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    async function restoreSession() {
      try {
        const stored = await api.getCurrentUser();
        if (stored) {
          setUser(stored);
        } else {
          // Default to Admin demo session for smooth onboarding
          const store = getStore();
          const defaultUser =
            store.users.find((u) => u.role === "ADMIN") || store.users[0];
          setUser(defaultUser);
          localStorage.setItem("ems_auth_user", JSON.stringify(defaultUser));
        }
      } catch (err) {
        console.error("Error restoring session:", err);
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  }, []);

  const login = async (email: string, role?: Role) => {
    setIsLoading(true);
    try {
      const u = await api.login(email, role);
      setUser(u);
      return u;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  const switchRole = async (targetRole: Role) => {
    const store = getStore();
    const targetUser = store.users.find((u) => u.role === targetRole);
    if (targetUser) {
      setUser(targetUser);
      localStorage.setItem("ems_auth_user", JSON.stringify(targetUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
