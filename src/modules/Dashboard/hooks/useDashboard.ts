import { SetStateAction, useEffect, useState } from 'react';
import counter from '../../../utils/counter';
import SharedUsage from '../../../data/current/legacy/usage.json';
import RCLUsage from '../../../data/current/rcl/usage.json';
import SupernovaUsage from '../../../data/current/supernova/usage.json';
import othersUsage from '../../../data/current/other-packages/react-bootstrap-usage.json';
import SharedDetailedInfo from '../../../data/current/legacy/usage-details.json';
import RCLDetailedInfo from '../../../data/current/rcl/usage-details.json';
import SupernovaDetailedInfo from '../../../data/current/supernova/usage-details.json';
import OtherDetailedInfo from '../../../data/current/other-packages/react-bootstrap-usage-details.json';
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


type ItemImportInfo = { 
  imported?: string;
  local?: string;
  moduleName?: "@icapitalnetwork/react-component-library" | "react-bootstrap" | "@icapitalnetwork/supernova-core" | string | undefined;
  importType?: 'ImportSpecifier' | string;
};

type ItemLocation = {
  file?: string;
  start: {
    line: number;
    column: number;
  }
}

export type ListDataItem = {
  importInfo?: ItemImportInfo;
  location?: ItemLocation;
  props?: {};
  propsSpread?: boolean;
  detail?: string;
};

export type InstancedDataItem = {
  instances?: ListDataItem[];
};

type DataItem = {
  [key: string]: InstancedDataItem;
}

type MappingType = {
  [key: string]: DataItem | {};
}

const DataMapping = {
  rcl: RCLUsage,
  supernova: SupernovaUsage,
  shared: SharedUsage,
  other: othersUsage,
};

const DetailData: MappingType = {
  rcl: RCLDetailedInfo,
  supernova: SupernovaDetailedInfo,
  shared: SharedDetailedInfo,
  other: OtherDetailedInfo
}

export type CountedDataItem = ListDataItem & {
  count: number;
}

const aggregateData = (data: ListDataItem[]) => data?.reduce((prev: CountedDataItem[], component) => {
  const found = prev.find((e) => 
    e.location?.file == component.location?.file && (
      (e.importInfo?.imported && component.importInfo?.imported && e.importInfo?.imported == component.importInfo?.imported) || 
      (e.importInfo?.local && component.importInfo?.local && e.importInfo?.local == component.importInfo?.local)));
  if (!!found) {
    const index = prev.indexOf(found);
    prev.splice(index, 1, { ...found, count: found.count+1 });
    return prev;
  } else {
    return prev.concat({ ...component, count: 1 });
  }
}, []).sort((a, b) => a.count > b.count ? -1 : 1);

const useDashboard = () => {
  const [totals, setTotals] = useState<CountUsage[]>([]);
  const [selectedData, setSelectedData] = useState<ListData[]>([]);
  const [actualView, setActualView] = useState<DataTypes | ''>('');
  const [selectedComponent, setSelectedComponent] = useState<CountedDataItem[]>([]);
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
    setSelectedComponent(aggregateData(JsonData[componentName].instances));
  };

  const getSharedDepedency = (file: string, isSubComponent: boolean) => {
    const occurrences: InstancedDataItem = { instances: [] };
    console.log(file)
    Object.keys(DetailData).forEach(detail => {
      const innerDetail = DetailData[detail];
      Object.keys(innerDetail).forEach(a => {
        const dependant = isSubComponent ?
          innerDetail[a]?.instances?.filter((e: ListDataItem) => e?.location?.file?.match(file)) :
          innerDetail[a]?.instances?.filter((e: ListDataItem) => e?.importInfo?.moduleName?.match(file));

        if (dependant && dependant.length)
          occurrences.instances = occurrences.instances?.concat(dependant.map(e => ({ ...e, detail })));
      });
    });
    return aggregateData(occurrences.instances ?? []);
  };

  const toggleDrawer = () => componentDetailsOpen && setComponentDetailsOpen(false);

  const getComponentData: (componentName: string) => CountedDataItem[] | undefined = (componentName) => {
    if(actualView === '') return;
    const JsonData = DetailData[actualView];
    return aggregateData(JsonData[componentName]?.instances);
  };

  return {
    totals,
    selectedData,
    handleClick,
    handleSelectComponent,
    selectedComponent,
    componentDetailsOpen,
    toggleDrawer,
    getSharedDepedency,
    getComponentData,
  };
};

export default useDashboard;
