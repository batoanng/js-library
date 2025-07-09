import { SvgIcon, useTheme } from '@mui/material';

export type ExternalLinkIconProps = {
  color?: string;
};

export const ExternalLinkIcon = ({ color }: ExternalLinkIconProps) => {
  const theme = useTheme();
  const fillColor = color ?? theme.palette.text.secondary;

  return (
    <SvgIcon>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M10 14H2V6H6L8 4H1C0.447715 4 0 4.44772 0 5V15C0 15.5523 0.447715 16 1 16H11C11.5523 16 12 15.5523 12 15V8L10 10V14Z"
          fill={fillColor}
        />
        <path
          d="M15.92 0.62C15.8185 0.375651 15.6243 0.181475 15.38 0.08C15.2598 0.028759 15.1307 0.00157999 15 0H10C9.44772 0 9 0.447715 9 1C9 1.55228 9.44772 2 10 2H12.59L6.29 8.29C6.10069 8.47777 5.9942 8.73336 5.9942 9C5.9942 9.26664 6.10069 9.52223 6.29 9.71C6.47777 9.89931 6.73336 10.0058 7 10.0058C7.26664 10.0058 7.52223 9.89931 7.71 9.71L14 3.41V6C14 6.55228 14.4477 7 15 7C15.5523 7 16 6.55228 16 6V1C15.9984 0.869323 15.9712 0.740222 15.92 0.62Z"
          fill={fillColor}
        />
      </svg>
    </SvgIcon>
  );
};
