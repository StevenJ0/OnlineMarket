"use client";

import { useEffect, useState } from "react";
import EditStatusModal from "@/components/modals/admin/store/EditStatusModal";

const AdminStoreView = () => {
  const [listStore, setListStore] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
    const [selectedSeller, setSelectedSeller] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const getAllStore = async () => {
    try {
      const res = await fetch("/api/admin/store", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch stores");

      const data = await res.json();

      setListStore(data.data.data);
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllStore();
  }, []);

  if (loading) return <p className="p-4">Loading store data...</p>;

  return (
    <>
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative">
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg"
            />
            <button
              className="absolute top-2 right-2 bg-white px-3 py-1 rounded shadow text-sm"
              onClick={() => setPreviewImage(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ======= MAIN TABLE ======= */}
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Daftar Store</h1>

        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2">Store Name</th>
                <th className="px-4 py-2">PIC</th>
                <th className="px-4 py-2">Kontak</th>
                <th className="px-4 py-2">Alamat</th>
                <th className="px-4 py-2">Foto PIC</th>
                <th className="px-4 py-2">Foto KTP</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Created At</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {listStore.map((store: any) => (
                <tr key={store.id} className="border-t">
                  <td className="px-4 py-3 font-medium">
                    {store.store_name}
                  </td>

                  <td className="px-4 py-3">
                    {store.pic_name}
                    <br />
                    <span className="text-gray-500">{store.pic_email}</span>
                  </td>

                  <td className="px-4 py-3">{store.pic_phone}</td>

                  <td className="px-4 py-3 max-w-xs">
                    {store.street}
                    <br />
                    RT {store.rt} / RW {store.rw}
                    <br />
                    {store.kelurahan}, {store.kota}, {store.provinsi}
                  </td>

                  {/* ===== Foto PIC + Preview ===== */}
                  <td className="px-4 py-3">
                    <img
                      src={store.pic_photo_url}
                      alt="pic"
                      className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80"
                      onClick={() => setPreviewImage(store.pic_photo_url)}
                    />
                  </td>

                  {/* ===== Foto KTP + Preview ===== */}
                  <td className="px-4 py-3">
                    <img
                      src={store.pic_ktp_photo_url}
                      alt="ktp"
                      className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80"
                      onClick={() => setPreviewImage(store.pic_ktp_photo_url)}
                    />
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs ${
                        store.status === "active"
                          ? "bg-green-500"
                          : store.status === "pending"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    >
                      {store.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {new Date(store.created_at).toLocaleString()}
                  </td>

                  <td className="px-4 py-3">
                    <button
                        className="px-3 py-1 text-sm bg-yellow-500 text-white rounded"
                        onClick={() => {
                            setSelectedSeller(store);
                            setIsModalOpen(true);
                        }}
                        >
                        Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      <EditStatusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        storeId={selectedSeller?.id || ""}
        currentStatus={selectedSeller?.status || "pending"}
        onUpdated={getAllStore}
    />
    </>
  );
  
};

export default AdminStoreView;
