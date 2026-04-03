import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@batoanng/mui-components', async () => {
  const { useFormContext } = await import('react-hook-form');

  return {
    Button: ({ children, color: _color, fullWidth: _fullWidth, ...props }: any) => <button {...props}>{children}</button>,
    FormTextField: ({ fullWidth: _fullWidth, label, name, rules: _rules, ...props }: any) => {
      const { register } = useFormContext();

      return (
        <label>
          {label}
          <input aria-label={label} {...register(name)} {...props} />
        </label>
      );
    },
  };
});

import { SendPasswordResetEmail } from '../src/SendPasswordResetEmail';
import { VerifyEmail } from '../src/VerifyEmail';

describe('OIDC reset-password screens', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submits the verify-email form without rendering a logo when one is not provided', async () => {
    const onPasswordReset = vi.fn();
    const toggleEmailField = vi.fn();

    render(<VerifyEmail onPasswordReset={onPasswordReset} toggleEmailField={toggleEmailField} />);

    expect(screen.queryByAltText('Authentication logo')).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Email'), {
      target: {
        value: 'user@example.com',
      },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    await waitFor(() => expect(onPasswordReset).toHaveBeenCalledWith('user@example.com'));
    expect(toggleEmailField).toHaveBeenCalledTimes(1);
  });

  it('renders the optional logo and wires the resend and change-email actions', () => {
    const onPasswordReset = vi.fn();
    const toggleEmailField = vi.fn();

    render(
      <SendPasswordResetEmail
        email="user@example.com"
        logo="/logo.svg"
        onPasswordReset={onPasswordReset}
        toggleEmailField={toggleEmailField}
      />
    );

    expect(screen.getByAltText('Authentication logo')).toHaveAttribute('src', '/logo.svg');

    fireEvent.click(screen.getByRole('button', { name: 'Resend email' }));
    expect(onPasswordReset).toHaveBeenCalledWith('user@example.com');

    fireEvent.click(screen.getByRole('button', { name: 'Change email address' }));
    expect(toggleEmailField).toHaveBeenCalledTimes(1);
  });
});
