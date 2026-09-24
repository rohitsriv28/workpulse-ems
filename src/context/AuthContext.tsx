import { createContext, useContext, useState, type ReactNode } from "react";

// Mock user type
export interface User {
  id: string;
  name: string;
  role: "ADMIN" | "HR" | "EMPLOYEE";
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role?: User["role"]) => void; // Mock login
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, role: User["role"] = "EMPLOYEE") => {
    // Mock login logic
    setUser({
      id: "1",
      name: "Narendra Modi",
      email,
      role,
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout }}
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
