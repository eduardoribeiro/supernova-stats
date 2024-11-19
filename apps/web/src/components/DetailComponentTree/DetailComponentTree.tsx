import type { ReactElement } from 'react';
import {
  Chip,
  Paper,
  TreeItem,
  TreeView,
} from '@icapitalnetwork/supernova-core';
import { CountedDataItem, ListData } from '../../modules/Dashboard/hooks/useDashboard';
import SubDetailComponentTree from '../SubDetailComponentTree';

type DetailComponentTreeProps = {
  action: (componentName: string) => void;
  getComponentData: (componentName: string) => CountedDataItem[] | undefined;
  getSharedDepedency: (file: string, isSubComponent: boolean) => CountedDataItem[] | void;
  selectedPackage: ListData[];
};

export type DetailComponentTreeType = ({
  action,
  getComponentData,
  getSharedDepedency,
  selectedPackage,
}: DetailComponentTreeProps) => ReactElement;

const DetailComponentTree: DetailComponentTreeType = ({
  action,
  getComponentData,
  getSharedDepedency,
  selectedPackage,
}) => {
  return(
  <Paper sx={{ padding: 1, marginBottom: 1 }} elevation={2}>
    <TreeView>
      {selectedPackage.map((data) => (
        <TreeItem
          key={`selected-${data.componentName}`}
          nodeId={`selected-${data.componentName}`}
          label={<>
            <Chip sx={{ minWidth: 35 }} label={data.count} size="small"></Chip>
            &nbsp;&nbsp;
            {data.componentName}
          </>}
        >
          { getComponentData(data.componentName)?.map((componentData) => 
            <SubDetailComponentTree
              key={`selected-${data.componentName}-${componentData.location?.file}`}
              reactKey={`selected-${data.componentName}-${componentData.location?.file}`}
              action={action}
              componentData={componentData}
              getSharedDepedency={getSharedDepedency}
            />
          ) }
        </TreeItem>
      ))}
    </TreeView>
  </Paper>
)};

export default DetailComponentTree;
