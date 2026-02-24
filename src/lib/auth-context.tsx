"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createBrowserClient } from "@supabase/ssr";

interface Owner {
  id: string;
  authId: string;
  email: string;
  name: string | null;
  xpBalance: number;
}

interface AuthContextType {
  owner: Owner | null;
  loading: boolean;
  signInWithGithub: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [owner, setOwner] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    // Check for existing session
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        // Fetch or create owner in our database
        const res = await fetch(
          `/api/auth/callback?auth_id=${session.user.id}&email=${session.user.email}&name=${session.user.user_metadata?.full_name || ""}`
        );
        const data = await res.json();
        if (data.owner) {
          setOwner(data.owner);
        }
      }
      setLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user?.email) {
        const res = await fetch(
          `/api/auth/callback?auth_id=${session.user.id}&email=${session.user.email}&name=${session.user.user_metadata?.full_name || ""}`
        );
        const data = await res.json();
        if (data.owner) {
          setOwner(data.owner);
        }
      } else {
        setOwner(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signInWithGithub = () => {
    supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setOwner(null);
  };

  return (
    <AuthContext.Provider value={{ owner, loading, signInWithGithub, signOut }}>
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
