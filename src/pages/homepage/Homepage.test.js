import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import Homepage from "./Homepage";
import "@testing-library/jest-dom";
import {
  getAllUserApi,
  getPaginatedApi,
  forumPostApi,
  likePostApi,
  dislikePostApi,
  viewPostApi,
} from "../../apis/Api";
import userMock from "../../__mock__/userMock";
import postMock from "../../__mock__/postMock";

jest.mock("../../apis/Api");

test("should render Homepage and call initial APIs", async () => {
  getAllUserApi.mockResolvedValue({ data: { users: userMock } });
  getPaginatedApi.mockResolvedValue({
    data: { posts: postMock, totalCount: postMock.length },
  });

  render(<Homepage />);

  await waitFor(() => expect(getAllUserApi).toHaveBeenCalled());
  await waitFor(() =>
    expect(getPaginatedApi).toHaveBeenCalledWith(1, 4, "mostRecent")
  );
});
