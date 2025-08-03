import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon, ListItemButton, IconButton, styled } from '@mui/material';
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

export default {
  title: 'Components/Atoms/ListItem',
};

export const Default = () => (
  <List>
    <ListItem>
      <ListItemIcon>
        <InboxRoundedIcon />
      </ListItemIcon>
      <ListItemText primary="Inbox" />
    </ListItem>
    <ListItem>
      <ListItemIcon>
        <InboxRoundedIcon />
      </ListItemIcon>
      <ListItemText primary="Drafts" />
    </ListItem>
  </List>
);

export const WithActions = () => (
  <List>
    <ListItem
      secondaryAction={
        <IconButton edge="end" aria-label="delete">
          <DeleteRoundedIcon />
        </IconButton>
      }
    >
      <ListItemIcon>
        <InboxRoundedIcon />
      </ListItemIcon>
      <ListItemText primary="Inbox with delete" />
    </ListItem>
  </List>
);

export const Disabled = () => (
  <List>
    <ListItem>
      <ListItemIcon>
        <InboxRoundedIcon />
      </ListItemIcon>
      <ListItemText primary="Inbox (disabled)" />
    </ListItem>
  </List>
);

export const Selected = () => (
  <List>
    <ListItem>
      <ListItemIcon>
        <InboxRoundedIcon />
      </ListItemIcon>
      <ListItemText primary="Inbox (selected)" />
    </ListItem>
  </List>
);

export const Clickable = () => (
  <List>
    <ListItemButton>
      <ListItemIcon>
        <InboxRoundedIcon />
      </ListItemIcon>
      <ListItemText primary="Clickable ListItemButton" />
    </ListItemButton>
  </List>
);

export const CustomStyle = () => {
  const CustomListItem = styled(ListItem)(({ theme }) => ({
    'border': `1px solid ${theme.palette.divider}`,
    'borderRadius': '8px',
    'marginBottom': theme.spacing(1),
    'backgroundColor': theme.palette.background.paper,
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.contrastText,
    },
  }));

  return (
    <List>
      <CustomListItem>
        <ListItemIcon>
          <InboxRoundedIcon />
        </ListItemIcon>
        <ListItemText primary="Custom styled item" />
      </CustomListItem>
      <CustomListItem>
        <ListItemIcon>
          <InboxRoundedIcon />
        </ListItemIcon>
        <ListItemText primary="Custom styled selected" />
      </CustomListItem>
    </List>
  );
};
