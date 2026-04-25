import { render, screen } from '@testing-library/react';
import { AppProviders } from '@/app/providers';
import { HomePage } from './HomePage';

describe('HomePage', () => {
  it('renders the generated home page content', () => {
    render(
      <AppProviders>
        <HomePage />
      </AppProviders>,
    );

    expect(
      screen.getByRole('heading', { name: 'next' }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Feature-Sliced Design foundation/i),
    ).toBeInTheDocument();
  });
});
