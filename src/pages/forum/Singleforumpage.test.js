import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import Singleforumpage from "./Singleforumpage";
import "@testing-library/jest-dom";
import {
  getPost,
  addCommentApi,
  editCommentApi,
  deleteCommentApi,
  likePostApi,
  dislikePostApi,
  getUserProfileApi,
} from "../../apis/Api";
import postMock from "../../__mock__/postMock";
import userMock from "../../__mock__/userMock";

jest.mock("../../apis/Api");

describe("Singleforumpage component testing", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Fetches and displays a post correctly", async () => {
    const mockPost = postMock[0];
    getPost.mockResolvedValue({ data: { post: mockPost } });

    render(<Singleforumpage />);

    await waitFor(() => {
      expect(screen.getByText(mockPost.postTitle)).toBeInTheDocument();
      expect(screen.getByText(mockPost.postDescription)).toBeInTheDocument();
    });
  });

  it("Adds a comment successfully", async () => {
    const mockPost = postMock[0];
    getPost.mockResolvedValue({ data: { post: mockPost } });
    addCommentApi.mockResolvedValue({});

    render(<Singleforumpage />);

    fireEvent.change(screen.getByPlaceholderText("Write your comment..."), {
      target: { value: "New comment" },
    });

    fireEvent.click(screen.getByText("Add Comment"));

    await waitFor(() => {
      expect(screen.getByText("New comment")).toBeInTheDocument();
    });
  });
});
