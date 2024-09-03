import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  KeyAttribute,
  Typography,
} from '@icapitalnetwork/supernova-core';
import { Fragment } from 'react';
import CustomIcon from '../CustomIcon';
import { DataTypes } from '../../modules/Dashboard/hooks/useDashboard';

export interface CountUsage {
  name: string;
  total: number;
  icon: DataTypes;
}

export type StatsCardProps = {
  totals: CountUsage[];
  title: string;
  handleCkick: (section: DataTypes) => void;
};

export type StatsCardComponent = ({
  totals,
  title,
  handleCkick,
}: StatsCardProps) => JSX.Element;

const StatsCard: StatsCardComponent = ({ totals, title, handleCkick }) => (
  <Card showBorder={false} elevation={8}>
    <CardHeader title={<Typography variant="h4">{title}</Typography>} />
    <Divider sx={{ marginTop: 0.5 }} />
    <CardContent>
      <Grid container justifyContent="space-evenly">
        {totals.length > 0 &&
          totals
            .sort((a: CountUsage, b: CountUsage) => b.total - a.total)
            .map(({ icon, name, total }, index, totals) => (
              <Fragment key={name + total}>
                <Button variant='text' onClick={() => handleCkick(icon)}>
                <KeyAttribute
                  icon={<CustomIcon icon={icon ?? null} />}
                  label={name}
                  value={`${total}`}
                  detail="ICN source code"
                />
                </Button>
                {totals.length - 1 !== index && (
                  <Divider orientation="vertical" variant="middle" flexItem />
                )}
              </Fragment>
            ))}
      </Grid>
    </CardContent>
  </Card>
);

export default StatsCard;
