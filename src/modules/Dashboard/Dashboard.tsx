import useDashboard from './hooks/useDashboard';
import StatsCard from '../../components/StatsCard';

import DetailComponentList from '../../components/DetailComponentList';
import ComponentDetails from '../../components/ComponentDetails';

const Dashboard = () => {

  const { totals, selectedData, handleClick, selectedComponent, handleSelectComponent, componentDetailsOpen,
    toogleDrawer } = useDashboard();
  return (
    <>
      <StatsCard title="ICN" totals={totals} handleCkick={handleClick} />
      {selectedData.length > 0 && <DetailComponentList selectedPackage={selectedData} action={handleSelectComponent} />}
     {selectedComponent.length > 0 && <ComponentDetails selectedComponent={selectedComponent} open={componentDetailsOpen} toggleDrawer={toogleDrawer} />}
    </>
  );
};

export default Dashboard;
