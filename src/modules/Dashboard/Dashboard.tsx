import useDashboard from './hooks/useDashboard';
import StatsCard from '../../components/StatsCard';

import DetailComponentList from '../../components/DetailComponentList';
import ComponentDetails from '../../components/ComponentDetails';
import { useState } from 'react';
import { Tab, Tabs } from '@icapitalnetwork/supernova-core';
import DetailComponentTree from '../../components/DetailComponentTree';

const Dashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const { totals, selectedData, handleClick, selectedComponent, handleSelectComponent, componentDetailsOpen,
    toggleDrawer, getSharedDepedency, getComponentData } = useDashboard();
  return (
    <>
      <StatsCard title="ICN" totals={totals} handleCkick={handleClick} />
      <br/>
      {selectedData.length > 0 && (
        <Tabs value={tabValue} onChange={(_, newTabValue) => setTabValue(newTabValue)}>
          <Tab label="List" />
          <Tab label="Tree" />
        </Tabs>
      )}
      {selectedData.length > 0 && tabValue === 1 && <DetailComponentTree selectedPackage={selectedData} action={handleSelectComponent}  getComponentData={getComponentData} getSharedDepedency={getSharedDepedency} />}
      {selectedData.length > 0 && tabValue === 0 && <DetailComponentList selectedPackage={selectedData} action={handleSelectComponent} />}
      {selectedComponent.length > 0 && <ComponentDetails selectedComponent={selectedComponent} getSharedDepedency={getSharedDepedency} open={componentDetailsOpen} toggleDrawer={toggleDrawer} />}
    </>
  );
};

export default Dashboard;
