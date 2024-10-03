import {
  Chip,
  ListItem,
  ListItemText,
} from '@icapitalnetwork/supernova-core';
import { ReactElement } from 'react';
import { CountedDataItem } from '../../modules/Dashboard/hooks/useDashboard';
import { USERLOC } from '../../main';

type ComponentDetailsItemType = {
  component: CountedDataItem;
  getSharedDepedency: (file: string, isSubComponent: boolean) => CountedDataItem[] | false | void;
};

export type ComponentDetailsItemProps = (
  props: ComponentDetailsItemType
) => ReactElement;

export const ComponentDetailsItem: ComponentDetailsItemProps = ({
  component,
  getSharedDepedency,
}) => {
  const primary = component.location?.file?.replaceAll(`${USERLOC}icn/icn_react/src`, "");
  const primaryComponent = primary?.match("components\/shared\/[^\/]*\/")?.pop();
  const sharedDependency = primaryComponent && getSharedDepedency(primaryComponent, false);

  return (
    <ListItem divider sx={{cursor: 'pointer'}}>
      <ListItemText
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        primary={primary} />
      { !!sharedDependency && (
        <Chip
          label={sharedDependency.reduce((acc, dep) => 
            acc+(dep?.count ?? 0), 0)}
          variant="vivid"
          color="warning"
          size="small" />
      )}
      <Chip
        label={component.count}
        variant="vivid"
        color="primary"
        size="small"
      />
    </ListItem>
  );
};

export default ComponentDetailsItem;
