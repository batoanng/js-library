import { Box, Divider, styled, Typography } from '@mui/material';
import type { FieldValues } from 'react-hook-form';
import { useFormState, useWatch } from 'react-hook-form';

function replacer(key: string, value: unknown) {
  if (key == 'ref') return undefined;
  else return value;
}

const formatBlob = (value: unknown) => {
  return JSON.stringify(value, replacer, '  ');
};
const Code = styled('pre')`
  margin-top: 0;
`;

export const FormState = <TFormValues extends FieldValues = FieldValues>() => {
  const formValues = useWatch<TFormValues>({});

  // We have to read the values from formState because it's effectively a proxy
  const fs = useFormState<TFormValues>();
  const formState = {
    dirtyFields: fs.dirtyFields,
    errors: fs.errors,
    submitCount: fs.submitCount,
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Divider />

      <Typography variant="h5" sx={{ mb: 0 }}>
        Form values
      </Typography>
      <Code>{formatBlob(formValues)}</Code>

      <Typography variant="h5">Form state</Typography>
      <Code>{formatBlob(formState)}</Code>
    </Box>
  );
};
