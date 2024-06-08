import React from "react";
import Vendors from "@/views/vendors";
import { render, screen , fireEvent} from '@testing-library/react'

export interface Vendor {
    vendorId: number;
    name: string;
    accepted: string;
  }
const mockInitialVendors: Vendor[] = [
  { vendorId: 1, name: 'Vendor 1', accepted: "false" },
  { vendorId: 2, name: 'Vendor 2', accepted: "false" },
];

it('Renders', async () => {
  render(<Vendors initialVendors={mockInitialVendors} />)
  const button = screen.getByText('Current Vendors');
  expect(button).toBeInTheDocument();

  // Simulate a click on the button to expand the list
  fireEvent.click(button);
});

