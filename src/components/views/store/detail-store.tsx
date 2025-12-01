import { useEffect, useState } from "react";
import PendingStoreView from "./pending-store-view";
import RejectStoreView from "./reject-store-view";

type DetailStoreProps = {
  storeId: string;
};

export default function DetailStoreView({ storeId }: DetailStoreProps) {
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getStoreById = async (storeId: string) => {
    const res = await fetch(`/api/detailStore?storeId=${storeId}`, {
      method: "GET",
    });

    return await res.json();
  };

  useEffect(() => {
    async function load() {
      try {
        const storeRes = await getStoreById(storeId);

        // storeRes.store.data adalah array
        const dbStore = storeRes.store?.data?.[0] || null;

        setStore(dbStore);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [storeId]);

  if (loading) return <div>Loading...</div>;
  if (!store) return <div>Store tidak ditemukan.</div>;

  if (store.status === "pending" || store.status === "awaiting_activation") {
    return (
      <PendingStoreView />
    );
  }

  if (store.status === "rejected") {
    return (
        <RejectStoreView />
    );
  }

  // status approved → tampilkan detail store
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">{store.store_name}</h1>
      <p className="text-gray-700">{store.store_description}</p>

      <div className="mt-4">
        <h2 className="font-semibold">PIC:</h2>
        <p>{store.pic_name}</p>
        <p>{store.pic_phone}</p>
        <p>{store.pic_email}</p>
      </div>

      <div className="mt-4">
        <h2 className="font-semibold">Alamat:</h2>
        <p>{store.street}</p>
        <p>RT/RW: {store.rt}/{store.rw}</p>
        <p>Kota: {store.kota}</p>
        <p>Provinsi: {store.provinsi}</p>
      </div>
    </div>
  );
}
