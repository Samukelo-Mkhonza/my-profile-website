import { render, screen } from '@testing-library/react';
import Explore from './Explore';

test('explore section links every interactive page from the main site', () => {
  render(<Explore />);

  expect(screen.getByRole('heading', { name: /explore/i })).toBeInTheDocument();

  const expected = [
    ['Terminal', '#/terminal'],
    ['Playground', '#/playground'],
    ['Now', '#/now'],
    ['Uses', '#/uses'],
    ['Today I Learned', '#/til'],
    ['Case Studies', '#/case-studies'],
    ['Changelog', '#/changelog'],
  ];
  for (const [title, href] of expected) {
    const link = screen.getByRole('link', { name: `Open ${title}` });
    expect(link).toHaveAttribute('href', href);
  }
});
