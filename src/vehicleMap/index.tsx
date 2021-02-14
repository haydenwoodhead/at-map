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
          attribution='© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'
          url={`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token=${
            process.env.REACT_APP_MAPBOX_KEY ?? ''
          }`}
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
