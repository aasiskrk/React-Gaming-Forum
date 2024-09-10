import axios from "axios";

// creating an instance of axios

const Api = axios.create({
  baseURL: "https://testhosting-lwe7.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
//creating anuthorization configureation
const config = {
  headers: {
    authorization: `Bearer ${localStorage.getItem("token")}`,
  },
};

//creating test api

export const testApi = () => Api.get("/test");

//creating register api

export const registerUserApi = (data) => Api.post("/api/user/create", data);

//creating login api
export const loginUserApi = (data) => Api.post("api/user/login", data);

//creating post api
export const forumPostApi = (data) => Api.post("api/forum/create", data);

export const getPost = (id) => Api.get(`api/forum/get_single_post/${id}`);

export const getAllPostsApi = () => Api.get("api/forum/get_all_post");

export const getUserProfileApi = (id) =>
  Api.get(`api/user/get_user/${id}`, config);

// creating update profile api
export const updateProfileApi = (id, data) =>
  Api.put(`api/user/update_profile/${id}`, data);

// Updated add comment function
export const addCommentApi = (postId, data) =>
  Api.post(`api/forum/add_comment/${postId}`, data, config);

// New edit comment function
export const editCommentApi = (postId, commentId, data) =>
  Api.put(`api/forum/edit_comment/${postId}/${commentId}`, data, config);

// New delete comment function
export const deleteCommentApi = (postId, commentId) =>
  Api.delete(`api/forum/delete_comment/${postId}/${commentId}`, config);

// Pagination for posts
// Pagination for posts with sorting
export const getPaginatedApi = (page, limit, sortOption) =>
  Api.get(
    `/api/forum/pagination?page=${page}&limit=${limit}&sort=${sortOption}`
  );

//forgot password
export const forgotPassowrdApi = (data) =>
  Api.post("/api/user/forgot_password", data);

// Search products
export const searchProductsApi = (query, tags) =>
  Api.get(`/api/forum/search?q=${query}&tags=${tags}`);

//likedislikeviews
// Creating the like post API
export const likePostApi = (postId) =>
  Api.post(`/api/forum/${postId}/like`, {}, config);

// Creating the dislike post API
export const dislikePostApi = (postId) =>
  Api.post(`/api/forum/${postId}/dislike`, {}, config);

// Creating the view post API
export const viewPostApi = (postId) =>
  Api.post(`/api/forum/${postId}/view`, {}, config);

export const getAllUserApi = () => Api.get("/api/user/get_all_users");

export const deleteUserApi = (id) => Api.delete(`/api/user/delete_user/${id}`);

export const verifyOtpApi = (data) => Api.post("/api/user/verify_otp", data);

// Get all posts by user
export const getUserPostsApi = (id) =>
  Api.get(`/api/forum/user_posts/${id}`, config);

// Get all comments by user
export const getUserCommentsApi = (id) =>
  Api.get(`/api/forum/user_comments/${id}`);

// Edit post API
export const editPostApi = (postId, data) =>
  Api.put(`/api/forum/edit_post/${postId}`, data, config);

// Delete post API
export const deletePostApi = (postId) =>
  Api.delete(`/api/forum/delete_post/${postId}`, config);

export const searchGamesApi = (query, category, sectionPageToken) =>
  Api.get("/api/forum/games", {
    params: {
      query,
      category,
      sectionPageToken,
    },
  });

// Creating game APIs
export const createGameApi = (data) => Api.post("/api/game/create", data);

export const getAllGames = () => Api.get("/api/game/get_all_games");

export const getSingleGame = (id) =>
  Api.get(`/api/game/get_single_game/${id}`);

export const deleteGame = (id) => Api.delete(`/api/game/delete_game/${id}`);

export const updateGame = (id, data) =>
  Api.put(`/api/game/update_game/${id}`, data);
