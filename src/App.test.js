import { act } from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the full page without crashing', async () => {
  render(<App />);

  // The app wraps all sections in a <main> landmark.
  expect(screen.getByRole('main')).toBeInTheDocument();

  // Flush the mocked GitHub fetch in Projects so its state update lands
  // inside the test instead of after teardown.
  await act(() => Promise.resolve());
});
