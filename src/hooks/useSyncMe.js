import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export function useSyncMe() {
  const { isAuthenticated, user, getToken } = useAuth();

  useEffect(() => {
    const run = async () => {
      if (!isAuthenticated || !user?.email) return;
      try {
        const token = await getToken();
        await fetch(`${import.meta.env.VITE_API_BASE}/me/sync`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ profile: user }),
        });
      } catch (e) {
        console.error("sync /me failed", e);
      }
    };
    run();
  }, [isAuthenticated, user?.email]);
}
