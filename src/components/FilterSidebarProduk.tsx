"use client";

import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
}

interface Province {
  id: string;
  name: string;
}

interface City {
  id: string;
  name: string;
  province_id: string;
}

export default function FilterSidebarProduk({
  filterCategory,
  filterLocation,
  onCategoryChange,
  onLocationChange,
}: any) {

  const [categories, setCategories] = useState<Category[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [locationTree, setLocationTree] = useState<any[]>([]);

  // -----------------------------
  // Fetch Categories
  // -----------------------------
  const getAllCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.data[0] || []);
    } catch (error) {
      console.error("Error category:", error);
    }
  };

  // -----------------------------
  // Fetch Locations
  // -----------------------------
  const getAllLocations = async () => {
    try {
      const res = await fetch("/api/locations");
      const data = await res.json();

      const provincesData = data.data.provinces;
      const citiesData = data.data.cities;

      setProvinces(provincesData);
      setCities(citiesData);

      // Build tree: Province -> Cities
      const tree = provincesData.map((prov: any) => ({
        ...prov,
        cities: citiesData.filter((c: any) => c.province_id === prov.id),
      }));

      setLocationTree(tree);

    } catch (error) {
      console.error("Error locations:", error);
    }
  };

  // -----------------------------
  // On Mount
  // -----------------------------
  useEffect(() => {
    getAllCategories();
    getAllLocations();
  }, []);

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">

      {/* ===================== */}
      {/* FILTER KATEGORI       */}
      {/* ===================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
          Kategori
        </h3>

        <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                className="hidden"
                checked={filterCategory === cat.name}
                onChange={() =>
                  onCategoryChange(filterCategory === cat.name ? null : cat.name)
                }
              />

              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                  filterCategory === cat.name
                    ? "bg-orange-500 border-orange-500"
                    : "border-slate-600 group-hover:border-orange-500"
                }`}
              >
                {filterCategory === cat.name && (
                  <div className="w-2 h-2 bg-white" />
                )}
              </div>

              <span
                className={`text-sm ${
                  filterCategory === cat.name
                    ? "text-white font-medium"
                    : "text-slate-400 group-hover:text-slate-200"
                }`}
              >
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
          Lokasi Toko
        </h3>

        <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar">
          {locationTree.map((prov) => (
            <div key={prov.id}>
              {/* Province Title */}
              <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                {prov.name}
              </p>

              {/* Cities under province */}
              <div className="space-y-1 pl-2">
                {prov.cities.map((city: any) => (
                  <label
                    key={city.id}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={filterLocation === city.name}
                      onChange={() =>
                        onLocationChange(
                          filterLocation === city.name ? null : city.name
                        )
                      }
                    />

                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                        filterLocation === city.name
                          ? "border-orange-500"
                          : "border-slate-600 group-hover:border-orange-500"
                      }`}
                    >
                      {filterLocation === city.name && (
                        <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      )}
                    </div>

                    <span
                      className={`text-sm ${
                        filterLocation === city.name
                          ? "text-white font-medium"
                          : "text-slate-400 group-hover:text-slate-200"
                      }`}
                    >
                      {city.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
