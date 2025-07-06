import { Close } from '@mui/icons-material';
import { styled } from '@mui/material';
import type { ButtonHTMLAttributes } from 'react';

const Button = styled('button')(({ theme }) => ({
  'appearance': 'none',
  'backgroundColor': 'transparent',
  'border': 'none',
  'width': theme.spacing(6),
  'height': theme.spacing(6),
  'top': 0,
  'right': 0,
  'padding': 0,
  'margin': theme.spacing(1, 1, 0, 0),
  'position': 'absolute',
  'cursor': 'pointer',

  '& > svg': {
    width: '1.5rem',
    height: '1.5rem',
  },

  '&:focus': {
    outline: `${theme.palette.grey[700]} solid 3px`,
    outlineOffset: '3px',
  },
}));

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export const CloseButton = (props: Props) => {
  return (
    <Button {...props}>
      <Close />
    </Button>
  );
};
