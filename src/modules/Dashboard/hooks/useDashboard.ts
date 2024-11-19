import { SetStateAction, useEffect, useState } from 'react';
import counter from '../../../utils/counter';
import SharedUsageOriginal from '../../../data/original/legacy/usage.json';
import RCLUsageOriginal from '../../../data/original/rcl/usage.json';
import SupernovaUsageOriginal from '../../../data/original/supernova/usage.json';
import othersUsageOriginal from '../../../data/original/other-packages/react-bootstrap-usage.json';
import SharedDetailedInfoOriginal from '../../../data/original/legacy/usage-details.json';
import RCLDetailedInfoOriginal from '../../../data/original/rcl/usage-details.json';
import SupernovaDetailedInfoOriginal from '../../../data/original/supernova/usage-details.json';
import OtherDetailedInfoOriginal from '../../../data/original/other-packages/react-bootstrap-usage-details.json';
import SharedUsageCurrent from '../../../data/current/legacy/usage.json';
import RCLUsageCurrent from '../../../data/current/rcl/usage.json';
import SupernovaUsageCurrent from '../../../data/current/supernova/usage.json';
import othersUsageCurrent from '../../../data/current/other-packages/react-bootstrap-usage.json';
import SharedDetailedInfoCurrent from '../../../data/current/legacy/usage-details.json';
import RCLDetailedInfoCurrent from '../../../data/current/rcl/usage-details.json';
import SupernovaDetailedInfoCurrent from '../../../data/current/supernova/usage-details.json';
import OtherDetailedInfoCurrent from '../../../data/current/other-packages/react-bootstrap-usage-details.json';

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
  original: {
    rcl: RCLUsageOriginal,
    supernova: SupernovaUsageOriginal,
    shared: SharedUsageOriginal,
    other: othersUsageOriginal,
  },
  current: {
    rcl: RCLUsageCurrent,
    supernova: SupernovaUsageCurrent,
    shared: SharedUsageCurrent,
    other: othersUsageCurrent,
  }
};

const DetailData: MappingType = {
  original: {
    rcl: RCLDetailedInfoOriginal,
    supernova: SupernovaDetailedInfoOriginal,
    shared: SharedDetailedInfoOriginal,
    other: OtherDetailedInfoOriginal
  },
  current: {
    rcl: RCLDetailedInfoCurrent,
    supernova: SupernovaDetailedInfoCurrent,
    shared: SharedDetailedInfoCurrent,
    other: OtherDetailedInfoCurrent
  }
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
  const [tabValue, setTabValue] = useState(0);
  const [tabValueMain, setTabValueMain] = useState(1);
  const [dataset, setDataset] = useState<"original" | "current">("current");
  const [totals, setTotals] = useState<CountUsage[]>([]);
  const [selectedData, setSelectedData] = useState<ListData[]>([]);
  const [actualView, setActualView] = useState<DataTypes | ''>('');
  const [selectedComponent, setSelectedComponent] = useState<CountedDataItem[]>([]);
  const [componentDetailsOpen, setComponentDetailsOpen] = useState(false);

  const updateValues = () => {
    const sharedTotals = {
      icon: DataTypes.Shared,
      name: 'Shared Folder',
      total: counter(DataMapping[dataset][DataTypes.Shared]),
    };
    const rclTotals = {
      icon: DataTypes.RCL,
      name: 'React Component Library',
      total: counter(DataMapping[dataset][DataTypes.RCL]),
    };
    const othersTotals = {
      icon: DataTypes.Others,
      name: 'Other Packages',
      total: counter(DataMapping[dataset][DataTypes.Others]),
    };
    const supernovaTotals = {
      icon: DataTypes.Supernova,
      name: 'Supernova',
      total: counter(DataMapping[dataset][DataTypes.Supernova]),
    };
    setTotals([supernovaTotals, rclTotals, sharedTotals, othersTotals]);
  };
  
  useEffect(() => updateValues(), [tabValueMain]);

  const handleClick = (section: DataTypes) => {
    if (!section) return;
    setActualView(section)
    const actualObject = DataMapping[dataset][section];
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

  const handleSelectComponent = (componentName: string | undefined) => {
    if (componentName === undefined || actualView === '') {
      setComponentDetailsOpen(false);
      setSelectedComponent([]);
      return;
    }
    setComponentDetailsOpen(true);
    const JsonData = DetailData[dataset][actualView];
    const regex = /[a-zA-Z]\.[a-zA-Z]/;
    const match = componentName.match(regex);
    if (match) {
      const componentNameSplited = componentName.split('.');
      setSelectedComponent(aggregateData(JsonData[componentNameSplited[0]]?.components[componentNameSplited[1]]?.instances));
    } else {
      setSelectedComponent(aggregateData(JsonData[componentName].instances));
    }
  };

  const getSharedDepedency = (file: string, isSubComponent: boolean) => {
    const occurrences: InstancedDataItem = { instances: [] };

    Object.keys(DetailData[dataset]).forEach(detail => {
      const innerDetail = DetailData[dataset][detail];
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
    const JsonData = DetailData[dataset][actualView];
    if (componentName.split('.').length > 1) {
      const splitName = componentName.split('.');
      return aggregateData(JsonData[splitName[0]]?.components[splitName[1]]?.instances);
    }
    return aggregateData(JsonData[componentName]?.instances);
  };

  const handleTabValueMain = (newTabValueMain: number) => {
    setTabValueMain(newTabValueMain);
    setDataset(newTabValueMain == 0 ? 'original' : 'current');
    setSelectedData([]);
    updateValues();
  }

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
    tabValue,
    tabValueMain,
    setTabValue,
    handleTabValueMain,
  };
};

export default useDashboard;
