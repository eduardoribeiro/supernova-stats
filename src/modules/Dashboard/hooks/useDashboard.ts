import { SetStateAction, useEffect, useState } from 'react';
import counter from '../../../utils/counter';
import SharedUsage from '../../../data/legacy/usage.json';
import RCLUsage from '../../../data/rcl/usage.json';
import SupernovaUsage from '../../../data/supernova/usage.json';
import othersUsage from '../../../data/other-packages/react-bootstrap-usage.json';
import SharedDetailedInfo from '../../../data/legacy/usage-details.json';
import RCLDetailedInfo from '../../../data/rcl/usage-details.json';
import SupernovaDetailedInfo from '../../../data/supernova/usage-details.json';
import OtherDetailedInfo from '../../../data/other-packages/react-bootstrap-usage-details.json';
import { CountUsage } from '../../../components/StatsCard/StatsCard';

export enum DataTypes {
  RCL = 'rcl',
  Supernova = 'supernova',
  Others = 'other',
  Shared = 'shared',
}

export type ListData = {
  componentName: string;
  count: number;
  selected: boolean;
};

const DataMapping = {
  rcl: RCLUsage,
  supernova: SupernovaUsage,
  shared: SharedUsage,
  other: othersUsage,
};

const DetailData = {
  rcl: RCLDetailedInfo,
  supernova: SupernovaDetailedInfo,
  shared: SharedDetailedInfo,
  other: OtherDetailedInfo
}

const useDashboard = () => {
  const [totals, setTotals] = useState<CountUsage[]>([]);
  const [selectedData, setSelectedData] = useState<ListData[]>([]);
  const [actualView, setActualView] = useState<DataTypes | ''>('');
  const [selectedComponent, setSelectedComponent] = useState([]);
  const [componentDetailsOpen, setComponentDetailsOpen] = useState(false);

  const updateValues = () => {
    const sharedTotals = {
      icon: DataTypes.Shared,
      name: 'Shared Folder',
      total: counter(DataMapping[DataTypes.Shared]),
    };
    const rclTotals = {
      icon: DataTypes.RCL,
      name: 'React Component Library',
      total: counter(DataMapping[DataTypes.RCL]),
    };
    const othersTotals = {
      icon: DataTypes.Others,
      name: 'Other Packages',
      total: counter(DataMapping[DataTypes.Others]),
    };
    const supernovaTotals = {
      icon: DataTypes.Supernova,
      name: 'Supernova',
      total: counter(DataMapping[DataTypes.Supernova]),
    };
    setTotals([supernovaTotals, rclTotals, sharedTotals, othersTotals]);
  };
  
  useEffect(() => updateValues(), []);

  const handleClick = (section: DataTypes) => {
    if (!section) return;
    setActualView(section)
    const actualObject = DataMapping[section];
    const newStats: SetStateAction<ListData[]> = [];
    Object.keys(actualObject).forEach((key: string) => {
      return newStats.push({
        componentName: key,
        count: actualObject[key],
        selected: false
      });
    });
    setSelectedData(newStats);
  };

  const handleSelectComponent = (componentName: string) => {
    if(actualView === '') return;
    const JsonData = DetailData[actualView];
    setComponentDetailsOpen(true);
    setSelectedComponent(JsonData[componentName].instances);
  };

  const toogleDrawer = () => componentDetailsOpen && setComponentDetailsOpen(!componentDetailsOpen)

  return {
    totals,
    selectedData,
    handleClick,
    handleSelectComponent,
    selectedComponent,
    componentDetailsOpen,
    toogleDrawer
  };
};

export default useDashboard;
