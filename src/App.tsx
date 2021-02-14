import React from 'react';

import { useVehicleLocationAPI } from 'src/atAPI';

const App: React.FC = () => {
  const { hasDoneFirstLoad, vehicles } = useVehicleLocationAPI();
  console.log(hasDoneFirstLoad, vehicles);
  return (
    <>
      <h1>Test</h1>
    </>
  );
};

export default App;
