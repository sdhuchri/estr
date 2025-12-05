import { useEffect, useState } from "react";
import { getSession } from "@/lib/session";

export interface SessionData {
  userId: string;
  userDomain: string;
  userName: string;
  branchCode: string;
  branchName: string;
  userRole: string;
  userLevel: string;
  userDepartmen: string;
  userProfile: string;
  userMenu: string;
  userSession: string;
}

export function useSession() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const sessionData = await getSession();
        setSession(sessionData);
      } catch (error) {
        console.error("Failed to load session:", error);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  return { session, loading };
}
