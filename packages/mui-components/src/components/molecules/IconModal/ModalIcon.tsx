import { ReactNode, useState } from 'react';
import styled from '@emotion/styled';
import InfoIcon from '@mui/icons-material/Info';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HelpIcon from '@mui/icons-material/Help';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const IconWrapper = styled('div')(() => ({
  'width': '1.2rem',
  'height': '1.2rem',

  '& svg': {
    width: '1.2rem',
    height: '1.2rem',
  },
}));

export type ModalIconProps = {
  title?: ReactNode;
  subtext?: ReactNode;
  helpText?: ReactNode;
  iconType?: 'info' | 'help';
};

export const ModalIcon = ({ iconType }: ModalIconProps) => {
  const [hovered, setHover] = useState(false);

  if (iconType === 'info') {
    return (
      <IconWrapper className="modal-icon" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        {hovered ? <InfoIcon /> : <InfoOutlinedIcon />}
      </IconWrapper>
    );
  }

  return (
    <IconWrapper className="modal-icon" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {hovered ? <HelpIcon /> : <HelpOutlineIcon />}
    </IconWrapper>
  );
};
