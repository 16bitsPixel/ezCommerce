import React from "react";
import TopBar from "@/views/Topbar";
import { render, screen , fireEvent} from '@testing-library/react'

it('Renders', async () => {
  render(<TopBar />)
});

it("Lets logout", async()=>{
  render(<TopBar />)
  fireEvent.click(screen.getByRole('button'))
})