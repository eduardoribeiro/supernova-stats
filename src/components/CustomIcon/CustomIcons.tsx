import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import { ReactElement } from 'react';

type CustomIconProps = {
    icon?: string | null
}
/**
 * This function will return a React Icon component, given the key of the icon we want to display
 * @param icon string
 */
export type CustomIconComponent = ({ icon }: CustomIconProps) => ReactElement;

const CustomIcon: CustomIconComponent = ({ icon }) => {
  if (!icon) return <ScreenShareIcon />;
  const IconMap: {[key: string]: ReactElement} = {
    'supernova': <AutoModeIcon color='primary' />,
    'rcl': <LinkOffIcon color='warning' />,
    'other': <ErrorOutlineIcon color='error' />,
    'shared': <ScreenShareIcon color='warning' />,
  };

  return IconMap[icon];
};

export default CustomIcon;
