import {
  Box,
  Container,
  Drawer,
  IconButton,
  IconSizes,
  List,
  SvgIcon,
  Typography,
} from '@icapitalnetwork/supernova-core';
import { ReactElement } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { CountedDataItem } from '../../modules/Dashboard/hooks/useDashboard';
import ComponentDetailsItem from '../ComponentDetailsItem';

type ComponentDetailsType = {
  selectedComponent: CountedDataItem[];
  open: boolean;
  toggleDrawer: () => false | void;
  getSharedDepedency: (file: string, isSubComponent: boolean) => CountedDataItem[] | void;
};

export type ComponentDetailsProps = (
  props: ComponentDetailsType
) => ReactElement;

export const ComponentDetails: ComponentDetailsProps = ({
  selectedComponent,
  open,
  toggleDrawer,
  getSharedDepedency,
}) => {
  
  return (
    <Drawer anchor="right" open={open} variant="persistent">
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'Start',
          paddingTop: 4,
          maxWidth: "80vw",
          height: '100%',
        }}
      >
        <Box role="presentation">
          <Typography variant="h3">{selectedComponent[0]?.importInfo?.imported ?? selectedComponent[0]?.importInfo?.local}</Typography>
        </Box>
        <br />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {selectedComponent &&
              selectedComponent.map((component) => 
                <ComponentDetailsItem key={component.location?.file} component={component} getSharedDepedency={getSharedDepedency} />)}
          </List>
        </Box>
        <div
          style={{
            top: 0,
            right: 0,
            position: 'absolute',
          }}
        >
          <IconButton
            onClick={toggleDrawer}
            sx={(theme) => ({
              marginTop: theme.spacing(0.5),
              marginRight: theme.spacing(0.5),
            })}
          >
            <SvgIcon
              size={IconSizes.large}
              sx={{ color: (theme) => theme.palette.text.tertiary }}
            >
              <CloseIcon />
            </SvgIcon>
          </IconButton>
        </div>
      </Container>
    </Drawer>
  );
};

export default ComponentDetails;
