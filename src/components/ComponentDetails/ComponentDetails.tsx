import {
  Box,
  Container,
  Drawer,
  IconButton,
  IconSizes,
  SvgIcon,
  Typography,
} from '@icapitalnetwork/supernova-core';
import { ReactElement } from 'react';
import CloseIcon from '@mui/icons-material/Close';

type ComponentDetailsType = {
  selectedComponent: unknown[];
  open: boolean;
  toggleDrawer: () => false | void
};

export type ComponentDetailsProps = (
  props: ComponentDetailsType
) => ReactElement;

export const ComponentDetails: ComponentDetailsProps = ({
  selectedComponent,
  open,
  toggleDrawer,
}) => {
  console.log(open)
  return (
    <Drawer anchor="right" open={open} onClose={toggleDrawer} variant="persistent">
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <Box role="presentation">
          <Typography variant="h3">{selectedComponent[0]?.importInfo?.imported}</Typography>
        </Box>
        <div
          style={{
            top: 0,
            right: 0,
            position: 'absolute',
          }}
        >
          <IconButton
            onClick={toggleDrawer(false)}
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
