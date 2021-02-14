import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import { useVehicleLocationAPI } from 'src/atAPI';
import 'src/vehicleMap/map.css';

const busIcon = new L.Icon({
  iconUrl: process.env.PUBLIC_URL + 'bus.png',
  iconSize: [24, 24],
});

const trainIcon = new L.Icon({
  iconUrl: process.env.PUBLIC_URL + 'train.png',
  iconSize: [24, 24],
});

const icons: Record<number, L.Icon> = {
  2: trainIcon,
  3: busIcon,
};

const typeToName: Record<number, string> = {
  2: 'Train',
  3: 'Bus',
  4: 'Ferry',
};

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
            <Marker position={vehicle.Position} key={vehicle.Name} icon={icons[vehicle.Type]}>
              <Popup>
                <b>{typeToName[vehicle.Type]}</b> - {vehicle.Name}
                <br />
                {vehicle.Route?.Code ?? 'Unknown'} - {vehicle.Route?.Name ?? 'Unknown'}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </>
  );
};

export default VehicleMap;
