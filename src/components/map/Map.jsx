import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import GeoCoderMarker from './GeoCoderMarker';

const Map = ({address, city, state, zoomLevel}) => {
  const position = [51.35, -18.8];
  
  return (
    <MapContainer 
      center={position} 
      zoom={1} 
      scrollWheelZoom={false} 
      style={{
        height: "100%",
        width: "100%",
        zIndex: 0
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoCoderMarker zoomLevel={zoomLevel} address = {`${address} ${city} ${state} Nigeria`} />

    </MapContainer>
  );
};

export default Map;