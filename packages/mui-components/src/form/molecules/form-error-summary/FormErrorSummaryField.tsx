import { Link, ListItem, styled } from '@mui/material';
import { useMemo } from 'react';

import type { FormFieldError } from './types';

const ErrorItem = styled(ListItem)(({ theme }) => ({
  'display': 'list-item',
  'fontWeight': theme.typography.fontWeightBold,
  'fontSize': theme.typography.pxToRem(16),
  'padding': 0,
  'paddingLeft': theme.spacing(1),

  '&::marker': {
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightRegular,
  },

  '&:not(:last-of-type) > button': {
    marginBottom: theme.spacing(1),
  },
}));

type HookFormRef = {
  focus: () => void;
};

export const FormErrorSummaryField = ({ fieldName, fieldRef, message }: FormFieldError) => {
  const [canFocus, handleFocus] = useFocusOnError(fieldRef, fieldName);

  if (!canFocus) {
    return <ErrorItem>{message}</ErrorItem>;
  }

  return (
    <ErrorItem>
      <Link component="button" sx={{ display: 'block', textAlign: 'left' }} onClick={handleFocus}>
        {message}
      </Link>
    </ErrorItem>
  );
};

const isHookFormRef = (fieldRef: unknown): fieldRef is HookFormRef => {
  const hookFormRef = fieldRef as HookFormRef;
  return typeof hookFormRef?.focus === 'function';
};

function focus(fieldRef: HookFormRef, element?: Element | null) {
  fieldRef.focus();
  setTimeout(() => {
    const scrollElement = element ?? document.activeElement;
    if (scrollElement) {
      scrollElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, 0);
}

function useFocusOnError(fieldRef: unknown, fieldName: string): [boolean, () => void] {
  return useMemo(() => {
    const element = findLabelById() ?? findById() ?? findByName() ?? findByNameApproximate();

    if (isHookFormRef(fieldRef)) {
      return [true, () => focus(fieldRef, element)];
    }

    if (element) {
      return [true, () => element.scrollIntoView({ behavior: 'smooth' })];
    }

    return [
      false,
      () => {
        /* no op */
      },
    ];

    function findLabelById() {
      try {
        return document.querySelector(`label[for=${fieldName}]`) ?? document.getElementById(`${fieldName}-label`);
      } catch {
        return;
      }
    }

    function findById() {
      return document.getElementById(fieldName);
    }

    function findByName() {
      const [field] = document.getElementsByName(fieldName);
      return field;
    }

    function findByNameApproximate() {
      const xpathResult = document.evaluate(
        `//*[starts-with(name(), '${fieldName}')]`,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      );

      return xpathResult.singleNodeValue;
    }
  }, [fieldRef, fieldName]);
}
