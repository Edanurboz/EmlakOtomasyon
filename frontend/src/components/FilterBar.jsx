import React, { useState, useEffect } from "react";
import { MdOutlineBathtub, MdOutlineBed, MdOutlineGarage } from "react-icons/md";
import { FaFilter } from "react-icons/fa";

const FilterBar = ({ filters, setFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);

  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setTempFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    setTempFilters({});
    setFilters({});
    setIsOpen(false);
  };

  return (
    <div className="relative w-full md:w-auto">
      {/* Filtre Butonu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-base font-medium"
      >
        <FaFilter className="text-lg" />
        <span>Filtreler</span>
        {Object.keys(filters).length > 0 && (
          <span className="bg-secondary text-white text-sm px-2.5 py-1 rounded-full">
            {Object.keys(filters).length}
          </span>
        )}
      </button>

      {/* Filtre Paneli */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white p-6 rounded-lg shadow-lg z-50 w-[90vw] md:w-[800px] lg:w-[1000px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Otopark */}
            <div className="space-y-2">
              <label className="block text-base font-medium text-gray-700">Otopark</label>
              <div className="flex items-center gap-3">
                <MdOutlineGarage className="text-2xl" />
                <select
                  value={tempFilters.parkings || ""}
                  onChange={(e) => handleFilterChange("parkings", e.target.value)}
                  className="w-full p-3 border rounded-lg text-base"
                >
                  <option value="">Tümü</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3+">3+</option>
                </select>
              </div>
            </div>

            {/* Oda Sayısı */}
            <div className="space-y-2">
              <label className="block text-base font-medium text-gray-700">Oda Sayısı</label>
              <div className="flex items-center gap-3">
                <MdOutlineBed className="text-2xl" />
                <select
                  value={tempFilters.bedrooms || ""}
                  onChange={(e) => handleFilterChange("bedrooms", e.target.value)}
                  className="w-full p-3 border rounded-lg text-base"
                >
                  <option value="">Tümü</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5+">5+</option>
                </select>
              </div>
            </div>

            {/* Banyo Sayısı */}
            <div className="space-y-2">
              <label className="block text-base font-medium text-gray-700">Banyo Sayısı</label>
              <div className="flex items-center gap-3">
                <MdOutlineBathtub className="text-2xl" />
                <select
                  value={tempFilters.bathrooms || ""}
                  onChange={(e) => handleFilterChange("bathrooms", e.target.value)}
                  className="w-full p-3 border rounded-lg text-base"
                >
                  <option value="">Tümü</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4+">4+</option>
                </select>
              </div>
            </div>

            {/* Fiyat Aralığı */}
            <div className="space-y-2">
              <label className="block text-base font-medium text-gray-700">Fiyat Aralığı</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={tempFilters.minPrice || ""}
                  onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                  className="w-full p-3 border rounded-lg text-base"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={tempFilters.maxPrice || ""}
                  onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                  className="w-full p-3 border rounded-lg text-base"
                />
              </div>
            </div>

            {/* Şehir */}
            <div className="space-y-2">
              <label className="block text-base font-medium text-gray-700">Şehir</label>
              <input
                type="text"
                value={tempFilters.city || ""}
                onChange={(e) => handleFilterChange("city", e.target.value)}
                className="w-full p-3 border rounded-lg text-base"
                placeholder="Şehir ara..."
              />
            </div>

            {/* Ülke */}
            <div className="space-y-2">
              <label className="block text-base font-medium text-gray-700">Ülke</label>
              <input
                type="text"
                value={tempFilters.country || ""}
                onChange={(e) => handleFilterChange("country", e.target.value)}
                className="w-full p-3 border rounded-lg text-base"
                placeholder="Ülke ara..."
              />
            </div>
          </div>

          {/* Butonlar */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={handleClearFilters}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-base font-medium"
            >
              Filtreleri Temizle
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors text-base font-medium"
            >
              Uygula
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar; 