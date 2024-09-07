import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { toast } from "react-toastify";
import { loginUserApi } from "../../apis/Api";
import Loginpage from "./Loginpage";

// Mock the api.js file
jest.mock("../../apis/Api");

// List of test cases
describe("Login Component", () => {
  afterEach(() => {
    // Clearing all mocks
    jest.clearAllMocks();
  });

  // Test case
  it("Should display error toast message on login fail!", async () => {
    // Rendering login page/components
    render(<Loginpage />);

    // Mock response
    const mockResponse = {
      data: {
        success: false,
        message: "Incorrect Password",
      },
    };

    // Configure mock response
    loginUserApi.mockResolvedValue(mockResponse);

    // Configure toast.error
    toast.error = jest.fn();

    // Finding elements on the rendered login component
    const email = await screen.findByPlaceholderText("Enter email");
    const password = await screen.findByPlaceholderText("Enter password");
    const loginBtn = screen.getByText("Login");

    // Simulating user input and interactions
    fireEvent.change(email, { target: { value: "admin@gmail.com" } });
    fireEvent.change(password, { target: { value: "admin" } });
    fireEvent.click(loginBtn);

    // Ensuring all tests are working fine
    await waitFor(() => {
      // Expect API call with data entered/changed
      expect(loginUserApi).toHaveBeenCalledWith({
        email: "admin@gmail.com",
        password: "admin",
      });
    });

    // Check toast.error
    expect(toast.error).toHaveBeenCalledWith("Incorrect Password");
  });
});
