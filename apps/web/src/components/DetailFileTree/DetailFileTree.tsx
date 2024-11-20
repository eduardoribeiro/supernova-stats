import { useEffect, useState, type ReactElement } from 'react';
import {
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  TreeItem,
  TreeView,
  Typography,
} from '@icapitalnetwork/supernova-core';
import { CountedDataItem, ListData } from '../../modules/Dashboard/hooks/useDashboard';
import CustomIcon from '../CustomIcon';
import { ContentCopy } from '@mui/icons-material';

type DetailFileTreeProps = {
  action: (componentName: string) => void;
  getComponentData: (componentName: string) => CountedDataItem[] | undefined;
  getSharedDepedency: (file: string, isSubComponent: boolean) => CountedDataItem[] | void;
  selectedPackage: ListData[];
};

export type DetailFileTreeType = ({
  action,
  getComponentData,
  getSharedDepedency,
  selectedPackage,
}: DetailFileTreeProps) => ReactElement;

type RDTComponents = {
  component: string;
  count: number;
  detail: string;
};

type RecursiveDataFunctionType = (
  originalData: RecursiveDataType,
  data: string[],
  componentName: string,
  count: number,
  shared: () => CountedDataItem[] | void
) => RecursiveDataType;

type GetDataFunctionType = (newOriginalData: RecursiveDataType) => RecursiveDataType;

export type RecursiveDataType = {
  [key:string]: RecursiveDataType | number | RDTComponents[] | GetDataFunctionType[] | undefined;
  RDT_COMPS?: RDTComponents[];
  RDT_COUNT?: number;
  RDT_GETDATA: GetDataFunctionType[];
};

const recursiveData: RecursiveDataFunctionType = (originalData, data, componentName, count = 1, shared) => {
  const key = data[0];
  if (key) {
    if (!originalData[key]) {
      originalData[key] = { RDT_GETDATA: [] };
    }

    (originalData[key] as RecursiveDataType).RDT_COUNT = ((originalData[key] as RecursiveDataType)?.RDT_COUNT ?? 0) + count;

    if (data.length > 1) {
      (originalData[key] as RecursiveDataType).RDT_GETDATA.push(
        (newOriginalData: RecursiveDataType) => recursiveData(newOriginalData, data.slice(1), componentName, count, shared));
    } else {
      (originalData[key] as RecursiveDataType).RDT_COMPS = shared()?.map((sub) => ({
        component: sub.importInfo?.local ?? '',
        count: sub.count,
        detail: sub.detail ?? ''
      }));
    }
  }
  return originalData;
};

const RecursiveFileTree = ({ data, nodeId }: { data: RecursiveDataType, nodeId: string }) => {
  const [innerData, setInnerData] = useState(data);

  useEffect(() => {
    setInnerData(data);
  }, [data]);

  return Object.keys(innerData)
    .sort((a,b) =>
      ((innerData[a] as RecursiveDataType)?.RDT_COUNT ?? 0) >
      ((innerData[b] as RecursiveDataType)?.RDT_COUNT ?? 0) ? -1 : 1)
    .map((key) => key != 'RDT_COMPS' && key != 'RDT_COUNT' && key != 'RDT_GETDATA' ? (
      <TreeItem
        key={`${nodeId}/${key}`}
        nodeId={`${nodeId}/${key}`}
        label={
          (innerData[key] as RecursiveDataType).RDT_COMPS ?
            <Stack direction="row" justifyContent="space-between">
              <Stack direction="row">
                <Chip sx={{ minWidth: 35 }} label={(innerData[key] as RecursiveDataType).RDT_COUNT} size="small"></Chip>
                &nbsp;&nbsp;
                {key}
              </Stack>
              <Button 
                onClick={(event) => {
                  event.stopPropagation();
                  navigator.clipboard.writeText(`${nodeId}/${key}`);
                }}
                size="small"
                variant="text"
                icon={ContentCopy} />
            </Stack> : 
            <>
              <Chip sx={{ minWidth: 35 }} label={(innerData[key] as RecursiveDataType).RDT_COUNT} size="small"></Chip>
              &nbsp;&nbsp;
              {key}
            </>
        }
        onClick={() => {
          const value = (innerData[key] as RecursiveDataType);

          if (value.RDT_GETDATA.length) {
            const newData = value.RDT_GETDATA.reduce((prev, data) => data(prev), { RDT_GETDATA: [], RDT_COUNT: 0 } as RecursiveDataType);
            setInnerData({
              ...innerData,
              [key]: {
                ...newData,
                ...value
            } });
          }
        }}
      >
        { innerData[key] ?
          <RecursiveFileTree data={innerData[key] as RecursiveDataType} nodeId={`${nodeId}/${key}`} /> : 
          <CircularProgress variant="indeterminate" />
        }
      </TreeItem>
    ) : key == 'RDT_COMPS' && innerData[key]?.map((comp) => (
      <TreeItem 
        key={`${nodeId}-sub-${comp.component}`}
        nodeId={`${nodeId}-sub-${comp.component}`}
        label={
          <Stack direction="row" alignItems="center">
            <Chip color="warning" sx={{ minWidth: 35 }} label={comp.count} size="small"></Chip>
            <Typography sx={(theme) => ({ padding: theme.spacing(0, 0.5) })}>{comp.component}</Typography>
            <CustomIcon icon={comp.detail ?? null} />
          </Stack>
        }
      />
    )))
};

const DetailFileTree: DetailFileTreeType = ({
  // action,
  getComponentData,
  getSharedDepedency,
  selectedPackage,
}) => {
  const [aggregatedData, setAggregatedData] = useState<RecursiveDataType>({ RDT_GETDATA: [] });

  useEffect(() => {
    setAggregatedData({ RDT_GETDATA: [] });
    setTimeout(() => {
      const componentData = selectedPackage.map(component => getComponentData(component.componentName));
      const locationData = componentData?.map(component => component?.map(instance => 
        ({
          component: instance?.importInfo?.local,
          count: instance?.count,
          fileTree: instance?.location?.file?.replace(/.*\/icn_react\/src/, '').split('/').slice(1),
          shared: () => getSharedDepedency(instance?.location?.file?.replace(/.*\/icn/, '') ?? '', true)
        })
      ));

      const newData: RecursiveDataType = { RDT_GETDATA: [] };
      locationData.forEach((component) => {
        component?.forEach((instance) => 
          recursiveData(newData, instance?.fileTree ?? [], instance?.component ?? '', instance?.count, instance.shared)
        );
      });

      setAggregatedData(newData);
    }, 1);
  }, [selectedPackage]);

  return (
    <Paper sx={{ padding: 1, marginBottom: 1 }} elevation={2}>
      <TreeView>
        { Object.keys(aggregatedData).length ? 
          <RecursiveFileTree data={aggregatedData} nodeId="icn_react/src" /> : 
          <CircularProgress variant="indeterminate" />
        }
      </TreeView>
    </Paper>
)};

export default DetailFileTree;