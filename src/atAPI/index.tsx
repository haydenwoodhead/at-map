import axios from 'axios';
import { useEffect, useState } from 'react';

type VehicleLocationResp = {
  Vehicles: Vehicle[];
};

type Vehicle = {
  Name: string;
  LicensePlate: string;
  Position: number[];
  Route: Route;
  Type: number;
};

type Route = {
  Name: string;
  Code: string;
};

type UseVehicleLocationAPIValue = {
  vehicles?: Vehicle[];
  hasDoneFirstLoad: boolean;
};

export const useVehicleLocationAPI = (): UseVehicleLocationAPIValue => {
  const [hasDoneFirstLoad, setHasDoneFirstLoad] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>();

  const doGetVehicleLocation = () => {
    axios.get<VehicleLocationResp>('/api/locations').then((resp) => {
      setHasDoneFirstLoad(false);
      setVehicles(resp.data.Vehicles);
      setTimeout(doGetVehicleLocation, 30000);
    });
  };

  useEffect(() => {
    doGetVehicleLocation();
  }, []);

  return { vehicles, hasDoneFirstLoad };
};
