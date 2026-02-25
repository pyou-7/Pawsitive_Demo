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
  enableDemoMode: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [owner, setOwner] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const syncOwner = async (userId: string, email: string, name?: string) => {
    try {
      console.log("Syncing owner:", { userId, email, name });
      const res = await fetch(
        `/api/auth/callback?auth_id=${userId}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name || "")}`
      );
      const data = await res.json();
      console.log("Sync response:", res.status, data);
      if (data.owner) {
        setOwner(data.owner);
        // Store owner ID in localStorage for persistence
        localStorage.setItem("pawsitive_owner_id", data.owner.id);
      } else if (data.error) {
        console.error("Owner sync error:", data.error);
        alert(`Auth sync error: ${data.error}`);
      }
    } catch (error) {
      console.error("Failed to sync owner:", error);
      alert(`Failed to sync owner: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      // First check localStorage for persisted owner
      const savedOwnerId = localStorage.getItem("pawsitive_owner_id");
      if (savedOwnerId) {
        try {
          const res = await fetch(`/api/owners/me/stats`, {
            headers: { "x-owner-id": savedOwnerId }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.owner) {
              setOwner(data.owner);
              setLoading(false);
              return;
            }
          }
        } catch (e) {
          localStorage.removeItem("pawsitive_owner_id");
        }
      }

      // Then check Supabase session (including OAuth callback)
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await syncOwner(
          session.user.id,
          session.user.email!,
          session.user.user_metadata?.full_name || session.user.user_metadata?.name
        );
      } else {
        // Check if this is an OAuth callback by looking for code in URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        
        if (accessToken && refreshToken) {
          // Set session from OAuth callback
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          // Now get the session again
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            await syncOwner(
              session.user.id,
              session.user.email!,
              session.user.user_metadata?.full_name || session.user.user_metadata?.name
            );
            return;
          }
        }
        setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await syncOwner(
          session.user.id,
          session.user.email!,
          session.user.user_metadata?.full_name || session.user.user_metadata?.name
        );
      } else {
        setOwner(null);
        localStorage.removeItem("pawsitive_owner_id");
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signInWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        scopes: 'read:user user:email',
      },
    });
    if (error) {
      console.error("GitHub sign-in error:", error.message);
      alert(`Sign-in failed: ${error.message}`);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setOwner(null);
    localStorage.removeItem("pawsitive_owner_id");
  };

  const enableDemoMode = async () => {
    setLoading(true);
    localStorage.setItem("pawsitive_owner_id", "demo");
    try {
      const res = await fetch(`/api/owners/me/stats`, {
        headers: { "x-owner-id": "demo" }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.owner) {
          setOwner(data.owner);
        }
      }
    } catch (e) {
      console.error("Demo mode failed", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ owner, loading, signInWithGithub, signOut, enableDemoMode }}>
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
