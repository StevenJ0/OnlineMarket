"use client";

import { useEffect, useState } from "react";
import RegisterStoreView from "./store-form";
import DetailStoreView from "./detail-store";
import { useRouter } from "next/navigation";

const StoreView = () => {
  const [user, setUser] = useState<any>(null);
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const getStoreByUserId = async (userId: string) => {
    const res = await fetch(`/api/store?userId=${userId}`, {
      method: "GET",
      credentials: "include",
    });

    return await res.json();
  };

  useEffect(() => {
    async function load() {
      const sessionRes = await fetch("/api/auth/session", {
        method: "GET",
        credentials: "include",
      });

      const session = await sessionRes.json();

      if (!session.loggedIn) {
        setLoading(false);
        return;
      }

      const storeRes = await getStoreByUserId(session.user.id);

      setUser(session.user);
      setStore(storeRes.store);
      setLoading(false);

      // 🔥 ketika store ada → redirect
      if (storeRes.store?.id) {
        router.push(`/store/${storeRes.store.id}`);
      }
    }

    load();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user) return <div>Anda harus login untuk mengakses halaman ini.</div>;

  if (!store) {
    return <RegisterStoreView userId={user.id} />;
  }

  return null; // tidak pernah dipakai karena sudah redirect
};

export default StoreView;
