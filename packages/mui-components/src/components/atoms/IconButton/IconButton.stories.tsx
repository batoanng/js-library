import { Box, IconButton, Tooltip } from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import React from 'react';

export default {
  title: 'Components/Atoms/IconButton',
  decorators: [],
};

export const Default = () => {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <IconButton color="primary" aria-label="check">
        <CheckRoundedIcon />
      </IconButton>
      <IconButton color="secondary" aria-label="edit">
        <EditRoundedIcon />
      </IconButton>
      <IconButton color="error" aria-label="delete">
        <DeleteRoundedIcon />
      </IconButton>
    </Box>
  );
};

export const WithTooltip = () => {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Tooltip title="Confirm">
        <IconButton color="primary" aria-label="confirm">
          <CheckRoundedIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Edit">
        <IconButton color="secondary" aria-label="edit">
          <EditRoundedIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton color="error" aria-label="delete">
          <DeleteRoundedIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export const Disabled = () => {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <IconButton disabled color="primary" aria-label="disabled-check">
        <CheckRoundedIcon />
      </IconButton>
      <IconButton disabled color="secondary" aria-label="disabled-edit">
        <EditRoundedIcon />
      </IconButton>
      <IconButton disabled color="error" aria-label="disabled-delete">
        <DeleteRoundedIcon />
      </IconButton>
    </Box>
  );
};

export const ToggleState = () => {
  const [active, setActive] = React.useState(false);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <IconButton color={active ? 'primary' : 'default'} aria-label="toggle-check" onClick={() => setActive(!active)}>
        <CheckRoundedIcon />
      </IconButton>
      <Box>{active ? 'Active' : 'Inactive'}</Box>
    </Box>
  );
};

export const ClarifyingMessage = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <IconButton color="info" aria-label="info">
        <InfoOutlinedIcon />
      </IconButton>
      <Box component="span" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
        This button gives more information.
      </Box>
    </Box>
  );
};
