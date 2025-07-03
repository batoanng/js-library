import { createTheme } from '@mui/material';

import { breakpoints } from './breakpoints';
import { defaultTypography } from './typography/default';
import { darkColors, lightColors } from './colourTheme';
import { MuiBackdrop } from './components/MuiBackdrop';
import { MuiModal } from './components/MuiModal';
import { MuiAccordion } from './components/MuiAccordion';
import { MuiAlert } from './components/MuiAlert';
import { MuiAutocomplete } from './components/MuiAutocomplete';
import { MuiBreadcrumbs } from './components/MuiBreadcrumbs';
import { MuiCard } from './components/MuiCard';
import { MuiCardActionArea } from './components/MuiCardActionArea';
import { MuiChip } from './components/MuiChip';
import { MuiCollapse } from './components/MuiCollapse';
import { MuiCssBaseline } from './components/MuiCssBaseline';
import { MuiDivider } from './components/MuiDivider';
import { MuiDrawer } from './components/MuiDrawer';
import { MuiFormLabel } from './components/MuiFormLabel';
import { MuiInputAdornment } from './components/MuiInputAdornment';
import { MuiInputLabel } from './components/MuiInputLabel';
import { MuiInputBase } from './components/MuiInputBase';
import { MuiOutlinedInput } from './components/MuiOutlinedInput';
import { MuiFormHelperText } from './components/MuiFormHelperText';
import { MuiFormControl } from './components/MuiFormControl';
import { MuiFormControlLabel } from './components/MuiFormControlLabel';
import { MuiPaper } from './components/MuiPaper';
import { MuiTextField } from './components/MuiTextField';
import { MuiCheckbox } from './components/MuiCheckbox';
import { MuiButtonBase } from './components/MuiButtonBase';
import { MuiButton } from './components/MuiButton';
import { MuiRadio } from './components/MuiRadio';
import { MuiFormGroup } from './components/MuiFormGroup';
import { MuiNativeSelect } from './components/MuiNativeSelect';
import { MuiPagination } from './components/MuiPagination';
import { MuiStepper } from './components/MuiStepper';
import { MuiSwitch } from './components/MuiSwitch';
import { MuiList } from './components/MuiList';
import { MuiStack } from './components/MuiStack';
import { MuiLink } from './components/MuiLink';
import { MuiTable } from './components/MuiTable';

export const createDefaultTheme = (isDark = false) => {
  const colors = isDark ? darkColors : lightColors;

  return createTheme({
    breakpoints: {
      values: breakpoints,
    },
    palette: {
      mode: isDark ? 'dark' : 'light',
      background: {
        default: colors.background,
        paper: colors.background,
      },
      text: {
        primary: colors.foreground,
        secondary: colors.mutedForeground,
      },
      primary: {
        main: colors.primary,
        contrastText: colors.primaryForeground,
      },
      secondary: {
        main: colors.secondary,
        contrastText: colors.secondaryForeground,
      },
      error: {
        main: colors.error,
      },
      success: {
        main: colors.success,
      },
      warning: {
        main: colors.warning,
      },
      info: {
        main: colors.info,
      },
      divider: colors.border,
    },
    shape: {
      borderRadius: 10,
    },
    typography: defaultTypography,
    components: {
      MuiAccordion,
      MuiAlert,
      MuiAutocomplete,
      MuiBackdrop,
      MuiBreadcrumbs,
      MuiCard,
      MuiCardActionArea,
      MuiChip,
      MuiCollapse,
      MuiCssBaseline,
      MuiDivider,
      MuiDrawer,
      MuiFormLabel,
      MuiInputAdornment,
      MuiInputLabel,
      MuiInputBase,
      MuiOutlinedInput,
      MuiFormHelperText,
      MuiFormControl,
      MuiFormControlLabel,
      MuiPaper,
      MuiTextField,
      MuiCheckbox,
      MuiButtonBase,
      MuiButton,
      MuiRadio,
      MuiFormGroup,
      MuiModal,
      MuiNativeSelect,
      MuiPagination,
      MuiStepper,
      MuiSwitch,
      MuiList,
      MuiStack,
      MuiLink,
      MuiTable,
    },
  });
};

export const defaultTheme = createDefaultTheme();
