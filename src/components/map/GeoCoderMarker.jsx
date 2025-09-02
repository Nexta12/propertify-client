import { useEffect, useState } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import * as ELG from 'esri-leaflet-geocoder';

// Initialize default icon (move this to a separate config file if used elsewhere)
const DefaultIcon = L.icon({
  iconUrl: icon,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: iconShadow,
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const GeoCoderMarker = ({ address, zoomLevel = 14 }) => {
  const map = useMap();
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!address) return;

    ELG.geocode()
      .text(address)
      .run((err, results) => {
        if (err) {
          setError('Failed to geocode address');
          console.error('Geocoding error:', err);
          return;
        }

        if (results?.results?.length > 0) {
          const { lat, lng } = results.results[0].latlng;
          setPosition([lat, lng]);
          map.flyTo([lat, lng], zoomLevel); // Increased zoom level for better precision
        } else {
          setError('Address not found');
        }
      });
  }, [address, map, zoomLevel]);

  if (!position) {
    return null; // Don't render marker if no position
  }

  return (
    <Marker position={position} icon={DefaultIcon}>
      <Popup>
        {error ? `Error: ${error}` : address}
      </Popup>
    </Marker>
  );
};

export default GeoCoderMarker;