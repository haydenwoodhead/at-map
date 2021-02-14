import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useVehicleLocationAPI } from 'src/atAPI';

import 'src/vehicleMap/map.css';

const VehicleMap: React.FC = () => {
  const { hasDoneFirstLoad, vehicles } = useVehicleLocationAPI();

  return (
    <>
      {!hasDoneFirstLoad && (
        <div className="loading-box">
          <div className="loading-modal">
            <p className="loading-text">Loading...</p>
          </div>
        </div>
      )}
      <MapContainer center={[-36.850109, 174.7677]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {vehicles?.map((vehicle) => {
          return (
            <Marker position={vehicle.Position} key={vehicle.Name}>
              <Popup>
                <b>Name:</b> {vehicle.Name} <br />
                <b>Route:</b> {vehicle.Route?.Code ?? 'Unknown'} - {vehicle.Route?.Name ?? 'Unknown'}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </>
  );
};

export default VehicleMap;
