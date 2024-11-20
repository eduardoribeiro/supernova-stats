import type { ReactElement } from 'react';
import {
  Box,
  Chip,
  Stack,
  TreeItem,
  Typography,
} from '@icapitalnetwork/supernova-core';
import { CountedDataItem } from '../../modules/Dashboard/hooks/useDashboard';

import CustomIcon from '../CustomIcon';

type SubDetailComponentTreeProps = {
  action: (componentName: string) => void;
  componentData: CountedDataItem;
  getSharedDepedency: (file: string, isSubComponent: boolean) => CountedDataItem[] | void;
  reactKey: string;
};

export type SubDetailComponentTreeType = ({
  action,
  componentData,
  getSharedDepedency,
  reactKey,
}: SubDetailComponentTreeProps) => ReactElement;

const SubDetailComponentTree: SubDetailComponentTreeType = ({
  action,
  componentData,
  getSharedDepedency,
  reactKey,
}) => {
  const primary = componentData.location?.file?.replace(/.*\/icn_react\/src/, "");
  const primaryComponent = primary?.match("(components|containers|modules)(\/[^\/]*)*")?.pop();
  const sharedDependency = primaryComponent && getSharedDepedency(primaryComponent, false) || undefined;
  const subDependency = primary && getSharedDepedency(primary, true) || undefined;

  if (subDependency && subDependency.length)
    console.log(primaryComponent, subDependency)

  return (
    <TreeItem
      nodeId={reactKey}
      label={<Stack gap={1} direction="row"><Chip sx={{ minWidth: 35 }} label={componentData.count} size="small"></Chip>{componentData?.location?.file?.split('/').pop()?.replace('.jsx', '')}<Chip color="error" sx={{ minWidth: 35 }} label={(sharedDependency?.length ?? 0)+(subDependency?.length ?? 0)} size="small"></Chip></Stack>}
    >
      { sharedDependency && subDependency && (sharedDependency.length > 0 || subDependency.length > 0) && (
        <Box>
          { sharedDependency?.map((dependencyData) => 
            <SubDetailComponentTree
              key={`${reactKey}-shared-${dependencyData.location?.file}`}
              reactKey={`${reactKey}-shared-${dependencyData.location?.file}`}
              action={action}
              componentData={dependencyData}
              getSharedDepedency={getSharedDepedency}
            />
          ) }
          { subDependency?.map((subData) => 
            <TreeItem 
              key={`${reactKey}-sub-${subData.importInfo?.imported || subData.importInfo?.local}`}
              nodeId={`${reactKey}-sub-${subData.importInfo?.imported || subData.importInfo?.local}`}
              label={
                <Stack direction="row" alignItems="center">
                  <Chip color="warning" sx={{ minWidth: 35 }} label={subData.count} size="small"></Chip>
                  <Typography sx={(theme) => ({ padding: theme.spacing(0, 0.5) })}>{subData.importInfo?.local}</Typography>
                  <CustomIcon icon={subData?.detail ?? null} />
                </Stack>
              }
            />
          ) }
        </Box>
      )}
    </TreeItem>
  );
};

export default SubDetailComponentTree;
