import React, { useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import GeoCoderMarker from "./GeoCoderMarker";

const Map = ({address, city, country}) => {
  // Harita container'ına ref oluştur
  const mapRef = React.useRef(null);
  
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Harita yüklendikten sonra resize event'ini tetikle
    const handleLoad = () => {
      window.dispatchEvent(new Event('resize'));
    };
    
    // Harita container'ının görünürlüğünü kontrol et
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoad();
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(mapRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  return (
    <div ref={mapRef} style={{ width: "100%", height: "400px", position: "relative" }}>
      <MapContainer
        center={[53.35, 18.8]}
        zoom={1}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <GeoCoderMarker address={`${address} ${city} ${country}`} />
      </MapContainer>
    </div>
  );
};

export default Map;