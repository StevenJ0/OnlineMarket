"use client";

import { useEffect, useState } from "react";

interface Province {
  id: string;
  name: string;
}

interface City {
  id: string;
  name: string;
  province_id: string;
}

export default function FilterSidebarToko({
  filterProvince,
  filterCity,
  onProvinceChange,
  onCityChange,
}: any) {

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);

  // Fetch Provinces
  const getAllProvinces = async () => {
    try {
      const res = await fetch("/api/provinces");
      const data = await res.json();
      setProvinces(data.data || []);
    } catch (error) {
      console.error("Error provinces:", error);
    }
  };

  // Fetch Cities
  const getAllCities = async () => {
    try {
      const res = await fetch("/api/cities");
      const data = await res.json();
      setCities(data.data || []);
    } catch (error) {
      console.error("Error cities:", error);
    }
  };

  // Load data on mount
  useEffect(() => {
    getAllProvinces();
    getAllCities();
  }, []);

  // Auto filter cities when province changes
  useEffect(() => {
    if (!filterProvince) {
      setFilteredCities(cities);
      return;
    }

    const prov = provinces.find((p) => p.name === filterProvince);

    if (prov) {
      setFilteredCities(cities.filter((c) => c.province_id === prov.id));
    }
  }, [filterProvince, cities, provinces]);


  return (
    <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">

      {/* ===================== */}
      {/* PROVINSI */}
      {/* ===================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b pb-2">
          Provinsi
        </h3>

        <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
          {provinces.map((prov) => (
            <label key={prov.id} className="flex items-center gap-3 cursor-pointer group">
              
              <input
                type="checkbox"
                className="hidden"
                checked={filterProvince === prov.name}
                onChange={() =>
                  onProvinceChange(
                    filterProvince === prov.name ? null : prov.name
                  )
                }
              />

              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                  filterProvince === prov.name
                    ? "bg-orange-500 border-orange-500"
                    : "border-slate-600 group-hover:border-orange-500"
                }`}
              >
                {filterProvince === prov.name && (
                  <div className="w-2 h-2 bg-white" />
                )}
              </div>

              <span
                className={`text-sm ${
                  filterProvince === prov.name
                    ? "text-white font-medium"
                    : "text-slate-400 group-hover:text-slate-200"
                }`}
              >
                {prov.name}
              </span>

            </label>
          ))}
        </div>
      </div>

      {/* ===================== */}
      {/* KOTA */}
      {/* ===================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b pb-2">
          Kota
        </h3>

        <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
          {filteredCities.map((city) => (
            <label key={city.id} className="flex items-center gap-3 cursor-pointer group">
              
              <input
                type="checkbox"
                className="hidden"
                checked={filterCity === city.name}
                onChange={() =>
                  onCityChange(filterCity === city.name ? null : city.name)
                }
              />

              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                  filterCity === city.name
                    ? "border-orange-500"
                    : "border-slate-600 group-hover:border-orange-500"
                }`}
              >
                {filterCity === city.name && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                )}
              </div>

              <span
                className={`text-sm ${
                  filterCity === city.name
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

    </aside>
  );
}
