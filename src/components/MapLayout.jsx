import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// Fix default marker issue with Leaflet in React
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";

// Define libraries as a constant outside the component
const libraries = ["marker"];
const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "var(--radius)",
};

// Create the custom marker outside the component
const customMarker = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const position = [49.4521, 11.0767]; // Example: Erlangen, Germany
const center = { lat: 49.4521, lng: 11.0767 }; // Google Maps requires this format

// Map ID is required for Advanced Markers
const mapId = "YOUR_MAP_ID_HERE";

const MapLayout = () => {
  const [map, setMap] = useState(null);
  const [advancedMarker, setAdvancedMarker] = useState(null);

  // Load the map when loaded
  const onMapLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  // Create the advanced marker after the map and libraries are loaded
  useEffect(() => {
    if (map && window.google && window.google.maps.marker) {
      try {
        // Create a marker element
        const marker = new window.google.maps.marker.AdvancedMarkerElement({
          position: center,
          map: map,
          title: "Our Location",
        });
        setAdvancedMarker(marker);
      } catch (error) {
        console.error("Error creating advanced marker:", error);
      }
    }

    // Clean up marker on unmount
    return () => {
      if (advancedMarker) {
        advancedMarker.map = null;
      }
    };
  }, [map]);

  return (
    <div className="w-full bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="border border-border rounded-lg overflow-hidden shadow-sm">
          <MapContainer
            center={position}
            zoom={10}
            style={containerStyle}
            scrollWheelZoom={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position} icon={customMarker}>
              <Popup>Jimmy's Apartment</Popup>
            </Marker>
          </MapContainer>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Powered by OpenStreetMap (No API Key Required)
        </p>

        
      </div>
    </div>
  );
};

export default MapLayout;
