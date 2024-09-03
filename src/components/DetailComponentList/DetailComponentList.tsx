import {
  Chip,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@icapitalnetwork/supernova-core';
import { ListData } from '../../modules/Dashboard/hooks/useDashboard';
import FunctionsIcon from '@mui/icons-material/Functions';
import { ReactElement } from 'react';

type DetailComponentListProps = {
  selectedPackage: ListData[];
  action: (componentName: string) => void;
};

export type DetailComponentListType = ({
  selectedPackage,
  action,
}: DetailComponentListProps) => ReactElement;

const DetailComponentList: DetailComponentListType = ({
  selectedPackage,
  action
}) => {

  return(
  <Paper sx={{ padding: 1, marginTop: 1, marginBottom: 1 }} elevation={2}>
    <List>
      {selectedPackage &&
        selectedPackage.map((component: ListData) => (
          <ListItem divider key={component.componentName + component.count} onClick={() => action(component.componentName)} sx={{cursor: 'pointer'}}>
              <ListItemText primary={component.componentName}></ListItemText>
              <Chip
                icon={<FunctionsIcon />}
                label={component.count}
                variant="vivid"
                color="primary"
                size="small"
              />
          </ListItem>
        ))}
    </List>
  </Paper>
)};

export default DetailComponentList;
