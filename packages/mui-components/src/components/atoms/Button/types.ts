export type ButtonType = {
  color: ButtonColour;
  variant: ButtonVariant;
};

export type ButtonColour = 'primary' | 'secondary' | 'warning' | 'inherit' | 'success' | 'error' | 'info' | undefined;

export type ButtonVariant = 'contained' | 'outlined' | 'text' | undefined;
