import { describe, it, expect } from 'vitest';
import { screen, render } from "@testing-library/react";
import App from "./App";

describe("App tests", () => {
  it("should render the title", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        level: 1,
      })
    ).toHaveTextContent("");
  });
});

