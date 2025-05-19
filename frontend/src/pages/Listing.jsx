import React, { useState } from "react";
import Searchbar from "../components/Searchbar";
import FilterBar from "../components/FilterBar";
import useProperties from "../hooks/useProperties";
import { PuffLoader } from "react-spinners"
import Item from "../components/item";

const Listing = () => {
  const [filter, setFilter] = useState("");
  const [filters, setFilters] = useState({});
  const { data, isError, isLoading } = useProperties();

  const applyFilters = (property) => {
    // Metin araması
    const textMatch = 
      property.title.toLowerCase().includes(filter.toLowerCase()) ||
      property.city.toLowerCase().includes(filter.toLowerCase()) ||
      property.country.toLowerCase().includes(filter.toLowerCase());

    // Fiyat filtresi
    const priceMatch = 
      (!filters.minPrice || property.price >= Number(filters.minPrice)) &&
      (!filters.maxPrice || property.price <= Number(filters.maxPrice));

    // Oda sayısı filtresi
    const bedroomMatch = 
      !filters.bedrooms || 
      (filters.bedrooms === "5+" ? property.facilities.bedrooms >= 5 : 
       property.facilities.bedrooms === Number(filters.bedrooms));

    // Banyo sayısı filtresi
    const bathroomMatch = 
      !filters.bathrooms || 
      (filters.bathrooms === "4+" ? property.facilities.bathrooms >= 4 : 
       property.facilities.bathrooms === Number(filters.bathrooms));

    // Otopark filtresi
    const parkingMatch = 
      !filters.parkings || 
      (filters.parkings === "3+" ? property.facilities.parkings >= 3 : 
       property.facilities.parkings === Number(filters.parkings));

    // Şehir filtresi
    const cityMatch = !filters.city || 
      property.city.toLowerCase().includes(filters.city.toLowerCase());

    // Ülke filtresi
    const countryMatch = !filters.country || 
      property.country.toLowerCase().includes(filters.country.toLowerCase());

    return textMatch && priceMatch && bedroomMatch && bathroomMatch && 
           parkingMatch && cityMatch && countryMatch;
  };

  if(isError){
    return(
      <div>
        <span>Error while fetching data</span>
      </div>
    )
  }
  if(isLoading){
    return (
      <div className="h-64 flexCenter">
        <PuffLoader
          height = "80"
          width = "80"
          radius = {1}
          color = "#555"
          aria-label="puff-loading"
        />
      </div>
    )
  }

  const filteredProperties = data.filter(applyFilters);

  return (
    <main className="my-24">
      <div className="max-padd-container py-10 bg-gradient-to-r from-primary via-white to-white">
        <div>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
            <Searchbar filter={filter} setFilter={setFilter} />
            <FilterBar filters={filters} setFilters={setFilters} />
          </div>
          {/* CONTAINER  */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-10">
            {filteredProperties.map((property) => (
              <Item key={property.title} property={property} />
            ))}
          </div>
          {filteredProperties.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">Arama kriterlerinize uygun ev bulunamadı.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Listing;
