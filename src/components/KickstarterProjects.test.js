import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import KickstarterProjects from './KickstarterProjects';

// Mock fetch with a more realistic dataset
const mockProjectsData = [
  { percentage_funded: 100, amount_pledged: 10000 },
  { percentage_funded: 200, amount_pledged: 20000 },
  { percentage_funded: 150, amount_pledged: 15000 },
  { percentage_funded: 120, amount_pledged: 12000 },
  { percentage_funded: 180, amount_pledged: 18000 },
  { percentage_funded: 90, amount_pledged: 9000 }
];

describe('KickstarterProjects Component', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProjectsData)
      })
    );

    // Mock console methods to prevent cluttering test output
    console.log = jest.fn();
    console.error = jest.fn();
  });

  test('renders loading state initially', () => {
    render(<KickstarterProjects />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('renders projects table after fetching', async () => {
    render(<KickstarterProjects />);
    
    await waitFor(() => {
      expect(screen.getByText('Kickstarter Projects')).toBeInTheDocument();
      expect(screen.getByText('S.No.')).toBeInTheDocument();
      expect(screen.getByText('Percentage Funded')).toBeInTheDocument();
      expect(screen.getByText('Amount Pledged')).toBeInTheDocument();
    });
  });

  test('handles pagination', async () => {
    render(<KickstarterProjects />);
    
    await waitFor(() => {
      const pageButtons = screen.getAllByRole('button');
      expect(pageButtons.length).toBeGreaterThan(0);
    });
  });

  test('handles fetch error', async () => {
    // Simulate fetch error
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500
      })
    );

    render(<KickstarterProjects />);
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
      expect(screen.getByText(/Unable to fetch Kickstarter projects/i)).toBeInTheDocument();
    });
  });

  test('handles empty projects list', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      })
    );

    render(<KickstarterProjects />);
    
    await waitFor(() => {
      expect(screen.getByText(/No projects found/i)).toBeInTheDocument();
    });
  });
});
