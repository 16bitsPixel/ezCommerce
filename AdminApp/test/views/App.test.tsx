import { render, screen } from '@testing-library/react'

import { App } from '../../src/views/App';

it('Renders', async () => {
  render(<App />)
});

it('Renders App', async () => {
    render(<App />)
    expect(screen.getByLabelText('Email Address *'))
    expect(screen.getByLabelText('Password *'))
    expect(screen.getByRole('button', { name: 'Sign In' }))
});
