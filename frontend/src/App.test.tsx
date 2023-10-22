import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import axios from "axios";
import App from "./App";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("App", () => {
  test("renders App component", () => {
    render(<App />);
  });


  test("handles search", async () => {
    const searchTerm = "test";
    const responseData = {
      data: {
        data: [
          {
            name: "test",
            city: "test",
            country: "test",
            favorite_sport: "test",
          },
        ],
      },
    };
    mockedAxios.get.mockResolvedValue(responseData);

    render(<App />);
    const searchInput = screen.getByPlaceholderText(/search.../i);
    fireEvent.change(searchInput, { target: { value: searchTerm } });
    fireEvent.click(screen.getByText(/search/i));

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `http://localhost:3000/api/users?q=${searchTerm}`
      );
    });
  });
});
