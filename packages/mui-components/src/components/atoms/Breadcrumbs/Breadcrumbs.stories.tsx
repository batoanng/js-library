import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import { Breadcrumbs, Link, Typography } from '@mui/material';

export default {
  title: 'Components/Atoms/Breadcrumbs',
  decorators: [],
};

export const Default = () => {
  return (
    <>
      <Breadcrumbs separator={<KeyboardArrowRightRoundedIcon fontSize="small" />} aria-label="breadcrumb">
        <Link color="inherit" href="/main">
          Main Navigation Level
        </Link>
        <Typography variant="body2">Secondary Navigation Level</Typography>
      </Breadcrumbs>
    </>
  );
};

export const BreadcrumbProperties = () => {
  const breadcrumbs = [
    <Link key="1" color="inherit" href="/main">
      Main Navigation Level
    </Link>,
    <Link key="2" color="inherit" href="/secondary">
      Secondary Navigation Level
    </Link>,
    <Typography key="3" variant="body2">
      Tertiary Navigation Level
    </Typography>,
  ];

  return (
    <>
      <Breadcrumbs separator={<KeyboardArrowRightRoundedIcon fontSize="small" />} aria-label="breadcrumb">
        {breadcrumbs}
      </Breadcrumbs>
    </>
  );
};
