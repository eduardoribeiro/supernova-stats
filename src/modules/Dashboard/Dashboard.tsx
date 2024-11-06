import useDashboard from './hooks/useDashboard';
import StatsCard from '../../components/StatsCard';

import DetailComponentList from '../../components/DetailComponentList';
import ComponentDetails from '../../components/ComponentDetails';
import { Tab, TabPanel, Tabs } from '@icapitalnetwork/supernova-core';
import DetailComponentTree from '../../components/DetailComponentTree';

const Dashboard = () => {
  const { totals, selectedData, handleClick, selectedComponent, handleSelectComponent, componentDetailsOpen,
    toggleDrawer, getSharedDepedency, getComponentData, tabValue, tabValueMain, setTabValue, handleTabValueMain } = useDashboard();
  return (
    <>
      <Tabs value={tabValueMain} onChange={(_, newTabValueMain) => handleTabValueMain(newTabValueMain)}>
          <Tab label="Original" />
          <Tab label="Current" />
      </Tabs>
      <TabPanel value={tabValueMain} index={0}>
          <StatsCard title="ICN - Original" totals={totals} handleClick={handleClick} />
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
      </TabPanel>
      <TabPanel value={tabValueMain} index={1}>
          <StatsCard title="ICN - Current" totals={totals} handleClick={handleClick} />
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
      </TabPanel>
    </>
  );
};

export default Dashboard;
